import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Restaurant from "./pages/Restaurant.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import Service from "./pages/Service.jsx";
import Contact from "./pages/Contact.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageRestaurants from "./pages/admin/ManageRestaurants.jsx";
import ManageFoods from "./pages/admin/ManageFoods.jsx";
import ManageOrders from "./pages/admin/ManageOrders.jsx";

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" />;

  return children;
};

import { useState, useCallback } from "react";
import Toast from "./components/Toast.jsx";

function App() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 pt-32 pb-20">
        <Routes>
          <Route path="/" element={<Home showToast={showToast} />} />
          <Route path="/login" element={<Login showToast={showToast} />} />
          <Route path="/register" element={<Register showToast={showToast} />} />
          <Route path="/restaurant/:id" element={<Restaurant showToast={showToast} />} />
          <Route path="/cart" element={<Cart showToast={showToast} />} />
          <Route path="/service" element={<Service />} />
          <Route path="/contact" element={<Contact />} />

          {/* User Protected Routes */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout showToast={showToast} /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders showToast={showToast} /></ProtectedRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard showToast={showToast} /></ProtectedRoute>} />
          <Route path="/admin/restaurants" element={<ProtectedRoute adminOnly={true}><ManageRestaurants showToast={showToast} /></ProtectedRoute>} />
          <Route path="/admin/restaurants/:restaurantId/foods" element={<ProtectedRoute adminOnly={true}><ManageFoods showToast={showToast} /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute adminOnly={true}><ManageOrders showToast={showToast} /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;