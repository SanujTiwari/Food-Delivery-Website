import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import "./index.css";

// Render the React application into the 'root' div in index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  // AuthProvider: Manages user login state globally
  <AuthProvider>
    // CartProvider: Manages the shopping cart state globally
    <CartProvider>
      // BrowserRouter: Enables client-side routing
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);