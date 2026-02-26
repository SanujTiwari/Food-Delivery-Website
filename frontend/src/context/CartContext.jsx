import { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart({ items: [], totalAmount: 0 });
        }
    }, [user]);

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

    const removeFromCart = async (foodId) => {
        try {
            const res = await API.delete(`/cart/remove/${foodId}`);
            setCart(res.data);
        } catch (err) {
            console.error("Error removing from cart", err);
        }
    };

    const clearCart = () => {
        setCart({ items: [], totalAmount: 0 });
    };

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, fetchCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
