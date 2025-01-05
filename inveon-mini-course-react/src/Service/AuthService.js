import apiClient from './apiClient';

const AuthService = {
    login: async (email, password) => {
        try {
            const response = await apiClient.post('/auth/login', {
                email,
                password,
            });

            const {accessToken, refreshToken, expiration} = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('expiration', expiration);

        } catch (error) {
            console.error('Login failed', error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiration');
        window.location.href = '/';
    },
    register: async (firstName, lastName, email, password) => {
        try {
            const response = await apiClient.post('/auth/register', {
                firstName,
                lastName,
                email,
                password,
            });

            if (response.status === 201) {
                console.log('Registration successful');
            } else {
                console.error('Registration failed, status code:', response.status);
                throw new Error('Registration failed, please try again.');
            }
        } catch (error) {
            console.error('Registration failed', error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },
    updatePassword: async (currentPassword, newPassword) => {
        try {
            const response = await apiClient.post('/auth/update-password', {
                currentPassword,
                newPassword
            })
            return response;
        } catch (error) {
            console.error('Update password failed', error);
        }
    }
};
export default AuthService;