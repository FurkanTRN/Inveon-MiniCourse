import { createContext, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const showToast = (message, type = "success") => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message);
        } else if (type === "info") {
            toast.info(message);
        } else if (type === "warning") {
            toast.warning(message);
        } else {
            toast(message);
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </ToastContext.Provider>
    );
};

export const useNotificationContext = () => {
    return useContext(ToastContext);
};