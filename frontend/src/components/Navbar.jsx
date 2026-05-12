import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { 
    ShoppingCart, User, LogOut, Utensils, LayoutDashboard, 
    Menu, X, ChevronDown, Package, Sun, Moon 
} from "lucide-react";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const { isDark, toggleTheme } = useTheme();
    
    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);

    const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        setIsMenuOpen(false);
        navigate("/login");
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/service", label: "Service" },
        { path: "/contact", label: "Contact" }
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
                scrolled ? "bg-bg-card/80 backdrop-blur-xl border-b border-black/5 shadow-sm py-4" : "bg-transparent py-6"
            }`}>
                <div className="container-app flex items-center justify-between">
                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsMenuOpen(true)}
                        className="md:hidden p-2 -ml-2 text-text-main hover:bg-black/5 rounded-xl transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group hover-lift">
                        <div className="bg-primary p-2.5 rounded-2xl shadow-primary">
                            <Utensils className="text-white w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black text-text-main tracking-tight font-[Outfit]">
                            Deliver<span className="text-primary tracking-widest ml-1">X</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <Link 
                                key={link.path}
                                to={link.path} 
                                className={`text-[13px] font-bold uppercase tracking-widest transition-all relative ${
                                    location.pathname === link.path ? "text-primary" : "text-text-muted hover:text-text-main"
                                }`}
                            >
                                {link.label}
                                {location.pathname === link.path && (
                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-scale-in" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 sm:gap-6">
                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme}
                            className="p-2 sm:p-2.5 rounded-full hover:bg-black/5 transition-colors text-text-muted hover:text-primary"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 sm:p-2.5 rounded-full hover:bg-black/5 transition-colors group">
                            <ShoppingCart className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute 0 right-0 bg-accent text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-md animate-bounce-in">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative hidden sm:block" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 hover:bg-black/5 p-1 pr-2 rounded-full transition-all border border-transparent hover:border-black/5"
                                >
                                    <div className="w-9 h-9 bg-primary-soft rounded-full flex items-center justify-center text-primary font-black text-sm">
                                        {userInitial}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute top-12 right-0 w-64 surface-card p-2 animate-slide-up origin-top-right z-50">
                                        <div className="p-4 border-b border-black/5">
                                            <p className="text-[10px] font-bold tracking-widest text-primary uppercase">Logged in as</p>
                                            <h4 className="text-base font-bold text-text-main truncate mt-1">{user.name}</h4>
                                        </div>

                                        <div className="p-2 space-y-1 mt-1">
                                            <button
                                                onClick={() => { navigate("/profile"); setIsProfileOpen(false); }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 text-text-muted hover:text-text-main transition-all text-sm font-semibold"
                                            >
                                                <User className="w-4 h-4" /> My Profile
                                            </button>
                                            <button
                                                onClick={() => { navigate("/orders"); setIsProfileOpen(false); }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 text-text-muted hover:text-text-main transition-all text-sm font-semibold"
                                            >
                                                <Package className="w-4 h-4" /> My Orders
                                            </button>

                                            {user.role === "admin" && (
                                                <button
                                                    onClick={() => { navigate("/admin/dashboard"); setIsProfileOpen(false); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-soft text-primary transition-all text-sm font-semibold"
                                                >
                                                    <LayoutDashboard className="w-4 h-4" /> Admin Panel
                                                </button>
                                            )}

                                            <div className="divider my-1" />

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-500 transition-all text-sm font-semibold"
                                            >
                                                <LogOut className="w-4 h-4" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-3">
                                <Link to="/login" className="btn-ghost !text-xs !tracking-widest !uppercase">Login</Link>
                                <Link to="/register" className="btn-primary !px-5 !py-2 !text-xs">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Overlay */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] md:hidden animate-fade-in"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Mobile Drawer Menu */}
            <div className={`fixed top-0 left-0 bottom-0 w-[280px] bg-bg-card z-[120] transform transition-transform duration-300 ease-out md:hidden shadow-2xl flex flex-col ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                <div className="p-6 flex items-center justify-between border-b border-black/5">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-xl">
                            <Utensils className="text-white w-4 h-4" />
                        </div>
                        <span className="text-xl font-black text-text-main font-[Outfit]">DeliverX</span>
                    </Link>
                    <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 hover:bg-black/5 rounded-full text-text-muted"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-2">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-4 py-3 rounded-xl font-bold transition-colors ${
                                location.pathname === link.path ? "bg-primary-soft text-primary" : "text-text-main hover:bg-black/5"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="divider my-4 mx-4" />

                    {user ? (
                        <>
                            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-text-main hover:bg-black/5">
                                <User className="w-5 h-5 text-text-muted" /> Profile
                            </Link>
                            <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-text-main hover:bg-black/5">
                                <Package className="w-5 h-5 text-text-muted" /> Orders
                            </Link>
                            {user.role === "admin" && (
                                <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-primary bg-primary-soft/50">
                                    <LayoutDashboard className="w-5 h-5" /> Admin Panel
                                </Link>
                            )}
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-500/10">
                                <LogOut className="w-5 h-5" /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="space-y-3 pt-2">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl font-bold text-text-main border border-black/5 hover:bg-black/5">
                                Login
                            </Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full text-center px-4 py-3 rounded-xl font-bold text-white bg-primary shadow-primary">
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
