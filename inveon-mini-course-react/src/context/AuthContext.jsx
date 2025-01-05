import {createContext, useContext, useEffect, useState} from "react";
import UserService from "../Service/UserService.js";
import AuthService from "../Service/AuthService.js";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const expiration = localStorage.getItem("expiration");

        if (accessToken && refreshToken && expiration) {
            const fetchUserInfo = async () => {
                try {
                    const userInfo = await UserService.getUserInfo();
                    const decodedToken = jwtDecode(accessToken);
                    userInfo.Roles = Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role];
                    if (userInfo.Roles.includes("Instructor")) {
                        console.log("User is an Instructor.");
                    } else {
                        console.log("User is not an Instructor.");
                    }
                    setUser(userInfo);
                } catch (error) {
                    console.error("Failed to fetch user info", error);
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserInfo();
        } else {
            setLoading(false);
        }
    }, []);
    const login = async (email, password) => {
        try {
            await AuthService.login(email, password);
            const userInfo = await UserService.getUserInfo();
            const decodedToken = jwtDecode(localStorage.getItem("accessToken"));
            userInfo.Roles = Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role];
            if (userInfo.Roles.includes("Instructor")) {
                console.log("User is an Instructor.");
            } else {
                console.log("User is not an Instructor.");
            }

            setUser(userInfo);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };
    const register = async (firstName, lastName, email, password) => {
        try {
            await AuthService.register(firstName, lastName, email, password);
            console.log('User registered successfully, redirecting to login page');
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        }
    };
    const logout = () => {
        AuthService.logout();
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{user, login, register, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    return useContext(AuthContext);
}
