import { useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Plus, Minus, ShoppingCart, ShieldCheck, Ticket } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Cart({ showToast }) {
    const { cart, loading, removeFromCart, addToCart, fetchCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemove = async (foodId, name) => {
        if (!foodId) return;
        await removeFromCart(foodId);
        showToast(`${name} removed from your basket`, "info");
    };

    const handleQuantityChange = async (foodId, name, delta) => {
        const success = await addToCart(foodId, delta);
        if (success && delta > 0) {
            showToast(`Added another ${name}`, "success");
        }
    };

    if (loading && !cart.items.length) return <LoadingSpinner />;

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-24 pt-12 px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-8">
                <div className="space-y-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-all text-xs font-bold uppercase tracking-widest group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black text-text-main tracking-tight">
                        Your <span className="text-primary italic">Basket</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-xl border border-black/5">
                    <ShoppingCart className="text-primary w-5 h-5" />
                    <span className="text-text-main font-bold">{cart.items.length} Items</span>
                </div>
            </div>

            {!cart || cart.items.length === 0 ? (
                <div className="py-24 text-center space-y-8">
                    <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-black/5">
                        <ShoppingBag className="w-10 h-10 text-text-muted opacity-40" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-text-main">Your basket is empty</h3>
                        <p className="text-text-muted max-w-sm mx-auto">Discover the finest cuisines and fill your basket with deliciousness.</p>
                    </div>
                    <Link to="/" className="inline-block btn-primary px-10 py-4 !rounded-full">
                        Explore Restaurants
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Side: Items List */}
                    <div className="lg:col-span-8 space-y-4">
                        {cart.items.map((item) => (
                            <div
                                key={item.foodId?._id || item._id}
                                className="glass-card !bg-white p-6 flex flex-col sm:flex-row gap-6 items-center hover:border-primary/20 transition-all border border-black/5"
                            >
                                {/* Product Image */}
                                <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 border border-black/5">
                                    <img
                                        src={item.foodId?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                                        alt={item.foodId?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-grow space-y-2 text-center sm:text-left">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-60">
                                            {item.foodId?.category || "Delicacy"}
                                        </span>
                                        <h4 className="text-xl font-bold text-text-main">{item.foodId?.name || "Product Unavailable"}</h4>
                                    </div>
                                    <p className="text-lg font-bold text-text-main">₹{item.foodId?.price || 0}</p>
                                    <button
                                        onClick={() => handleRemove(item.foodId?._id || item._id, item.foodId?.name || "this item")}
                                        className="text-red-500/80 hover:text-red-500 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mx-auto sm:mx-0"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Remove
                                    </button>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex flex-col items-center sm:items-end gap-4 min-w-[140px]">
                                    <div className="flex items-center bg-gray-50 rounded-xl border border-black/5 p-1">
                                        <button
                                            onClick={() => handleQuantityChange(item.foodId?._id, item.foodId?.name || "item", -1)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg text-text-main transition-all disabled:opacity-20 shadow-sm"
                                            disabled={item.quantity <= 1 || !item.foodId}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 text-center font-bold text-lg text-text-main">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.foodId?._id, item.foodId?.name || "item", 1)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg text-text-main transition-all shadow-sm"
                                            disabled={!item.foodId}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-40">Section Total</p>
                                        <p className="text-2xl font-black text-text-main italic">₹{(item.foodId?.price || 0) * item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-28">
                        <div className="glass-card !bg-white p-8 space-y-8 shadow-xl border border-black/5">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-text-main uppercase tracking-tight">Summary</h2>
                                <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest opacity-40">Price Details</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted font-medium">Subtotal</span>
                                    <span className="text-text-main font-bold">₹{cart.totalAmount}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-text-muted font-medium">Delivery Fee</span>
                                        <span className="bg-primary/10 px-1.5 py-0.5 rounded text-[8px] font-bold text-primary uppercase">Free</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-text-muted/40 line-through text-xs italic">₹50</span>
                                        <span className="text-green-500 font-bold">₹0</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-muted font-medium">Platform Fee</span>
                                    <span className="text-text-main font-bold">₹15</span>
                                </div>

                                <div className="pt-6 border-t border-black/5">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-40">Total Amount</p>
                                            <p className="text-4xl font-black text-primary">₹{Number(cart.totalAmount || 0) + 15}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/checkout")}
                                className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-3 !rounded-full shadow-lg shadow-primary/20 group"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="pt-4 text-center">
                                <div className="flex items-center gap-2 text-text-muted justify-center opacity-50 grayscale hover:grayscale-0 transition-all">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
                                </div>
                                <p className="text-[9px] text-text-muted font-medium mt-4 leading-relaxed">
                                    By proceeding, you agree to our <br />
                                    <Link to="/" className="text-primary hover:underline">Terms</Link> & <Link to="/" className="text-primary hover:underline">Privacy Policy</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
