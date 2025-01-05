import axios from 'axios';

const API_BASE_URL = 'https://localhost:7034/api';

// Save tokens to localStorage
const saveAuthTokens = ({ accessToken, refreshToken, expiration }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expiration', expiration);
};

// Clear tokens from localStorage
const clearAuthTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiration');
};

// Get tokens from localStorage
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const getExpiration = () => localStorage.getItem('expiration');

// Check if access token is expired
const isAccessTokenExpired = () => {
    const expiration = getExpiration();
    if (!expiration) return true; // If no expiration, assume token is expired
    return new Date() > new Date(expiration);
};

// Refresh access token using refresh token
const refreshAccessToken = async () => {
    try {
        const refreshToken = getRefreshToken();
        const accessToken = getAccessToken();

        if (!refreshToken || !accessToken) {
            throw new Error('No refresh token or access token available');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            accessToken,
            refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken, expiration } = response.data;
        saveAuthTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken, expiration });
        return newAccessToken;
    } catch (error) {
        console.error('Failed to refresh access token:', error);

        // If the refresh token is expired or revoked, clear tokens and redirect to login
        if (error.response?.data?.message?.includes('Refresh token is not active')) {
            console.error('Refresh token is expired or revoked. Redirecting to login...');
            clearAuthTokens(); // Clear expired tokens
            window.location.href = '/login'; // Redirect to login page
        }

        throw error;
    }
};

// Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Add access token to headers
apiClient.interceptors.request.use(
    async (config) => {
        let token = getAccessToken();

        // If access token is expired and refresh token exists, try to refresh the token
        if (isAccessTokenExpired() && getRefreshToken()) {
            try {
                token = await refreshAccessToken();
            } catch (error) {
                console.error('Unable to refresh access token. Redirecting to login...', error);
                clearAuthTokens(); // Clear expired tokens
                window.location.href = '/login'; // Redirect to login page
                return Promise.reject(error);
            }
        }

        // Add token to headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor: Handle 401 errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 (Unauthorized) and the request hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request as retried

            try {
                const newAccessToken = await refreshAccessToken(); // Refresh the token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // Update the headers
                return apiClient(originalRequest); // Retry the request
            } catch (refreshError) {
                console.error('Failed to refresh token. Redirecting to login...', refreshError);
                clearAuthTokens(); // Clear expired tokens
                window.location.href = '/login'; // Redirect to login page
                return Promise.reject(refreshError);
            }
        }

        // For other errors, reject the promise
        return Promise.reject(error);
    }
);

export default apiClient;