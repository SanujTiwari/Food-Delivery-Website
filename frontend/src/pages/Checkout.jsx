import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { MapPin, CreditCard, ChevronRight, ShoppingBag, ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";

export default function Checkout() {
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const [formData, setFormData] = useState({
        address: "",
        paymentMethod: "COD"
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.items.length === 0) return alert("Your cart is empty");

        setLoading(true);
        try {
            await API.post("/orders", {
                items: cart.items,
                totalAmount: cart.totalAmount + 15, // Including platform fee
                deliveryAddress: formData.address,
                paymentMethod: formData.paymentMethod
            });
            clearCart();
            setOrderSuccess(true);
            setTimeout(() => navigate("/orders"), 3000);
        } catch (err) {
            console.error(err);
            alert("Error placing order");
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="max-w-xl mx-auto py-32 text-center space-y-8 animate-fade-in">
                <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto border border-black/5">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-text-main">Order Successfully Placed!</h2>
                    <p className="text-text-muted text-lg font-medium max-w-sm mx-auto">Your order has been transmitted to our kitchen. Redirecting to your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20 pt-12 px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-8">
                <div className="space-y-4">
                    <Link to="/cart" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Basket
                    </Link>
                    <h2 className="text-4xl md:text-6xl font-black text-text-main tracking-tight">
                        Check<span className="text-primary italic">out</span>
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                <div className="lg:col-span-3 space-y-8">
                    {/* Delivery Section */}
                    <div className="glass-card !bg-white p-8 space-y-8 border border-black/5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary border border-black/5">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-text-main uppercase tracking-tight">Delivery Address</h2>
                                <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest opacity-40">Where should we deliver?</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <textarea
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-5 px-6 text-text-main focus:outline-none focus:border-primary transition-all h-32 resize-none font-medium text-lg shadow-sm"
                                placeholder="Enter your full address..."
                            />
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="glass-card !bg-white p-8 space-y-8 border border-black/5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary border border-black/5">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-text-main uppercase tracking-tight">Payment Method</h2>
                                <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest opacity-40">Choose your settlement</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, paymentMethod: "COD" })}
                                className={`p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${formData.paymentMethod === "COD" ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}
                            >
                                <div className={`p-3 rounded-lg ${formData.paymentMethod === "COD" ? 'bg-primary text-white' : 'bg-gray-200 text-text-muted opacity-40'}`}>
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <span className={`block font-bold uppercase tracking-widest text-xs ${formData.paymentMethod === "COD" ? 'text-text-main' : 'text-text-muted opacity-40'}`}>COD</span>
                                    <span className="text-[10px] text-text-muted opacity-60">Cash on Delivery</span>
                                </div>
                            </button>
                            <button
                                type="button"
                                disabled
                                className="p-6 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50 opacity-40 cursor-not-allowed flex items-center gap-4"
                            >
                                <div className="p-3 rounded-lg bg-gray-100 text-text-muted">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <span className="block font-bold uppercase tracking-widest text-xs text-text-muted">Online</span>
                                    <span className="text-[10px] text-text-muted opacity-60">Coming Soon</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="glass-card !bg-white p-8 space-y-8 border border-black/5 lg:sticky lg:top-24">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-text-main uppercase tracking-tight">Your Order</h2>
                            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest opacity-40">Review Summary</p>
                        </div>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto px-1 custom-scrollbar">
                            {cart.items.map((item) => (
                                <div key={item.foodId?._id} className="flex justify-between items-start gap-4">
                                    <div className="space-y-0.5">
                                        <p className="text-text-main font-bold text-sm leading-tight">{item.foodId?.name}</p>
                                        <p className="text-text-muted text-[10px] font-bold uppercase">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-text-main font-bold text-sm">₹{item.foodId?.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-black/5 space-y-3">
                            <div className="flex justify-between text-text-muted font-bold text-[10px] uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>₹{cart.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-text-muted font-bold text-[10px] uppercase tracking-widest">
                                <span>Platform Fee</span>
                                <span>₹15</span>
                            </div>
                            <div className="flex justify-between text-green-500 font-bold text-[10px] uppercase tracking-widest">
                                <span>Delivery Fee</span>
                                <span>Free</span>
                            </div>

                            <div className="pt-6 border-t border-black/5 flex justify-between items-end">
                                <div className="space-y-1">
                                    <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest opacity-40">Total Amount</span>
                                    <p className="text-4xl font-black text-primary">₹{cart.totalAmount + 15}</p>
                                </div>
                                {loading && <Loader2 className="w-6 h-6 text-primary animate-spin" />}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || cart.items.length === 0}
                            className="w-full btn-primary !py-5 text-lg font-bold flex items-center justify-center gap-3 !rounded-full shadow-lg shadow-primary/20 disabled:opacity-50 relative overflow-hidden"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-6 h-6" />
                            ) : (
                                <>
                                    <span>Place Order</span>
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-[10px] text-text-muted font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Order Instantly
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
