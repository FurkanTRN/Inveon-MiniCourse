import { createContext, useContext, useEffect, useReducer } from "react";
import {useNotificationContext} from "./ToastContext.jsx";

const CartContext = createContext();
const CART_STORAGE_KEY = "course_cart";

const cartReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_CART":
            return [...state, action.payload];
        case "REMOVE_FROM_CART":
            return state.filter((item) => item.id !== action.payload.id);
        case "CLEAR_CART":
            return [];
        default:
            return state;
    }
};

const getInitialCartState = () => {
    try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        return []; // Error is handled below with appropriate toast
    }
};

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, [], getInitialCartState);
    const { showToast } = useNotificationContext();

    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            showToast("Failed to save cart data to localStorage!", "error");
        }
    }, [cart]);

    const addToCart = (item) => {
        const isAlreadyInCart = cart.some((cartItem) => cartItem.id === item.id);
        if (isAlreadyInCart) {
            showToast(`${item.name} is already in the cart!`, "info");
            return;
        }
        dispatch({ type: "ADD_TO_CART", payload: item });
        showToast(`${item.name} has been added to the cart!`, "success");
    };

    const removeFromCart = (item) => {
        dispatch({ type: "REMOVE_FROM_CART", payload: item });
        showToast(`${item.name} has been removed from the cart.`, "info");
    };

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" });
        showToast("Cart has been cleared.", "info");
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                calculateTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    return useContext(CartContext);
};