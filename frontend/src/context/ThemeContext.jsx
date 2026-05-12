import { createContext, useContext, useState, useEffect } from "react";

/**
 * ThemeContext — provides dark/light mode state globally.
 * Persists the user's preference to localStorage.
 */
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Initialise from localStorage or system preference
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem("theme");
        if (stored) return stored === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    // Apply the theme attribute on every change
    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Convenience hook
export const useTheme = () => useContext(ThemeContext);
