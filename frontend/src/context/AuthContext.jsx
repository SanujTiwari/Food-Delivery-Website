import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create context for authentication state
export const AuthContext = createContext();

/**
 * AuthProvider Component
 * Manages user authentication state by storing the JWT in localStorage
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Run once on app mount to check for existing session
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                // Decode the JWT to get user details (id, role, etc.)
                const decoded = jwtDecode(token);
                // Check if the token has expired
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem("token");
                    setUser(null);
                } else {
                    // Token is valid, set user state
                    setUser(decoded);
                }
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);

    /**
     * Helper to log in a user and save token
     */
    const login = (token) => {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        setUser(decoded);
    };

    /**
     * Helper to log out a user and clear session
     */
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};