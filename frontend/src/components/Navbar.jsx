import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, User, LogOut, Utensils, LayoutDashboard, Menu, X, Home, ChevronDown, Package, ShieldCheck } from "lucide-react";

/**
 * Navbar Component
 * Navigation bar that handles routing, cart count, and user profile management
 */
export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    // UI States for mobile menu and profile dropdown
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Calculate total quantity of items in cart
    const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate("/login");
    };

    // Effect to close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-bg-dark/90 backdrop-blur-3xl border-b border-black/5 px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-primary p-2.5 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all shadow-xl shadow-primary/20">
                        <Utensils className="text-white w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-text-main tracking-tighter">Deliver<span className="text-primary tracking-[0.1em] ml-1">X</span></span>
                </Link>

                {/* Main Navigation Links */}
                <div className="hidden md:flex items-center gap-10">
                    <Link to="/" className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-primary ${location.pathname === "/" ? "text-primary" : "text-text-muted"}`}>Home</Link>

                    {/* Menu Button with smooth scroll to restaurants section */}
                    <button onClick={() => {
                        if (location.pathname !== "/") {
                            navigate("/");
                            setTimeout(() => document.getElementById("restaurants-section")?.scrollIntoView({ behavior: "smooth" }), 100);
                        } else {
                            document.getElementById("restaurants-section")?.scrollIntoView({ behavior: "smooth" });
                        }
                    }} className="text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-primary transition-all">Menu</button>

                    <Link to="/service" className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-primary ${location.pathname === "/service" ? "text-primary" : "text-text-muted"}`}>Service</Link>
                    <Link to="/contact" className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-primary ${location.pathname === "/contact" ? "text-primary" : "text-text-muted"}`}>Contact</Link>
                </div>

                {/* Right Side Actions (Cart & User) */}
                <div className="flex items-center gap-6">
                    {/* Shopping Cart Icon with Badge */}
                    <Link to="/cart" className="relative group p-3 hover:bg-black/5 rounded-2xl transition-all border border-transparent hover:border-black/5">
                        <ShoppingCart className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full animate-pulse shadow-lg shadow-red-500/30">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        // User Profile Dropdown
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 hover:bg-black/5 p-1 rounded-2xl transition-all border-2 border-transparent hover:border-primary/20"
                            >
                                <div className="w-10 h-10 bg-primary/10 rounded-xl border-2 border-primary/20 flex items-center justify-center text-primary font-black text-xl">
                                    {userInitial}
                                </div>
                                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown Menu Items */}
                            {isProfileOpen && (
                                <div className="absolute top-14 right-0 w-72 bg-white p-2 border border-black/5 shadow-[0_30px_60px_rgba(0,0,0,0.1)] animate-slide-up origin-top-right rounded-2xl">
                                    <div className="p-6 border-b border-black/5 space-y-1">
                                        <p className="text-[10px] font-black tracking-widest text-primary uppercase">Welcome back</p>
                                        <h4 className="text-xl font-black text-text-main truncate">{user.name}</h4>
                                        <p className="text-xs font-medium text-text-muted opacity-60 truncate">{user.email}</p>
                                    </div>

                                    <div className="p-2 space-y-1">
                                        <button
                                            onClick={() => { navigate("/orders"); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-black/5 text-text-muted hover:text-text-main transition-all group"
                                        >
                                            <Package className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                                            <span className="font-bold text-sm">My Orders</span>
                                        </button>

                                        {/* Admin Dashboard Link - Only shown to admins */}
                                        {user.role === "admin" && (
                                            <button
                                                onClick={() => { navigate("/admin/dashboard"); setIsProfileOpen(false); }}
                                                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-black/5 text-text-muted hover:text-text-main transition-all group"
                                            >
                                                <LayoutDashboard className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                                                <span className="font-bold text-sm">Admin Panel</span>
                                            </button>
                                        )}

                                        <div className="h-px bg-black/5 my-2 mx-4" />

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-red-500/10 text-red-500 transition-all group"
                                        >
                                            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            <span className="font-black text-sm uppercase tracking-widest">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Login/Register Buttons for guests
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-xs font-black uppercase tracking-widest text-text-muted hover:text-text-main px-4 py-2 transition-all">Login</Link>
                            <Link to="/register" className="btn-primary !py-2.5 !px-6 !text-[10px] !font-black !rounded-xl">JOIN NOW</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
