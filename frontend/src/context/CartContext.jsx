import { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "./AuthContext";

// Create context to be used by components
export const CartContext = createContext();

/**
 * CartProvider Component
 * Manages the shopping cart state and provides methods to modify it
 */
export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(false);

    // Fetch cart data from backend whenever the user logs in
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            // Reset cart when user logs out
            setCart({ items: [], totalAmount: 0 });
        }
    }, [user]);

    /**
     * Fetches current user's cart from API
     */
    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await API.get("/cart");
            if (res.data) {
                setCart(res.data);
            }
        } catch (err) {
            console.error("Error fetching cart", err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Adds an item to the cart or updates its quantity
     */
    const addToCart = async (foodId, quantity) => {
        try {
            const res = await API.post("/cart/add", { foodId, quantity });
            setCart(res.data);
            return true;
        } catch (err) {
            console.error("Error adding to cart", err);
            return false;
        }
    };

    /**
     * Removes a specific food item from the cart entirely
     */
    const removeFromCart = async (foodId) => {
        try {
            const res = await API.delete(`/cart/remove/${foodId}`);
            setCart(res.data);
        } catch (err) {
            console.error("Error removing from cart", err);
        }
    };

    /**
     * Resets local cart state (useful after checkout)
     */
    const clearCart = () => {
        setCart({ items: [], totalAmount: 0 });
    };

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, fetchCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
