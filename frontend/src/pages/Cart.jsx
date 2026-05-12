import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { 
    Trash2, ShoppingBag, ArrowRight, ArrowLeft, Plus, Minus, 
    ShoppingCart, ShieldCheck, Ticket, Tag, CheckCircle2, ChevronRight
} from "lucide-react";
import SkeletonCard from "../components/SkeletonCard";

export default function Cart({ showToast }) {
    const { cart, loading, removeFromCart, addToCart, fetchCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState("");

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

    const applyCoupon = () => {
        setCouponError("");
        if (coupon.toUpperCase() === "FIRST50") {
            setAppliedCoupon({ code: "FIRST50", discount: 50 });
            showToast("Coupon FIRST50 applied! Flat ₹50 off.", "success");
        } else if (coupon.toUpperCase() === "SAVE20") {
            setAppliedCoupon({ code: "SAVE20", discount: cart.totalAmount * 0.2 });
            showToast("Coupon SAVE20 applied! 20% off.", "success");
        } else {
            setCouponError("Invalid coupon code");
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCoupon("");
        showToast("Coupon removed", "info");
    };

    if (loading && !cart?.items?.length) return (
        <div className="container-app pt-24 pb-20 space-y-12">
            <div className="h-16 skeleton w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-32 skeleton" />)}
                </div>
                <div className="lg:col-span-4 h-96 skeleton" />
            </div>
        </div>
    );

    const isCartEmpty = !cart || !cart.items || cart.items.length === 0;

    // Calculations
    const subtotal = cart?.totalAmount || 0;
    const isFreeDelivery = subtotal > 299;
    const deliveryFee = isFreeDelivery ? 0 : 49;
    const gst = Math.round(subtotal * 0.05); // 5% GST
    const platformFee = 15;
    const discountAmount = appliedCoupon ? Math.round(appliedCoupon.discount) : 0;
    const totalToPay = subtotal + deliveryFee + gst + platformFee - discountAmount;

    return (
        <div className="container-app pt-24 pb-24 space-y-12 animate-fade-in">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 dark:border-white/5 pb-8">
                <div className="space-y-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Menu
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">
                        Your <span className="text-primary italic">Basket</span>
                    </h1>
                </div>
                {!isCartEmpty && (
                    <div className="flex items-center gap-3 surface-card px-5 py-2.5 shadow-sm">
                        <ShoppingCart className="text-primary w-5 h-5" />
                        <span className="font-bold text-sm">{cart.items.length} Items</span>
                    </div>
                )}
            </div>

            {isCartEmpty ? (
                <div className="py-24 text-center space-y-8 animate-slide-up">
                    <div className="w-24 h-24 bg-bg-subtle rounded-full flex items-center justify-center mx-auto text-text-faint">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-text-main">Your basket is empty</h3>
                        <p className="text-text-muted max-w-sm mx-auto font-medium">Looks like you haven't added anything to your cart yet. Let's fix that!</p>
                    </div>
                    <Link to="/" className="btn-primary inline-flex">
                        Explore Restaurants <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT COLUMN: ITEMS & UPSELL */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                        <div className="space-y-4">
                            {cart.items.map((item, i) => (
                                <div
                                    key={item.foodId?._id || item._id}
                                    className="surface-card p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center hover-lift animate-slide-up"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 border border-black/5 dark:border-white/5 relative">
                                        <img
                                            src={item.foodId?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                                            alt={item.foodId?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-grow space-y-1 text-center sm:text-left w-full">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                            {item.foodId?.category || "Delicacy"}
                                        </span>
                                        <h4 className="text-lg sm:text-xl font-bold text-text-main truncate">{item.foodId?.name || "Product Unavailable"}</h4>
                                        <p className="text-lg font-black text-text-main">₹{item.foodId?.price || 0}</p>
                                        
                                        <button
                                            onClick={() => handleRemove(item.foodId?._id || item._id, item.foodId?.name || "this item")}
                                            className="text-red-500/80 hover:text-red-500 transition-colors flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest mx-auto sm:mx-0 mt-2"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Remove
                                        </button>
                                    </div>

                                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                                        <div className="flex items-center bg-bg-subtle rounded-xl border border-black/5 dark:border-white/5 p-1 shadow-sm">
                                            <button
                                                onClick={() => handleQuantityChange(item.foodId?._id, item.foodId?.name || "item", -1)}
                                                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-bg-hover rounded-lg text-text-main transition-colors disabled:opacity-30"
                                                disabled={item.quantity <= 1 || !item.foodId}
                                            >
                                                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                            <span className="w-8 sm:w-10 text-center font-black text-base sm:text-lg text-text-main">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.foodId?._id, item.foodId?.name || "item", 1)}
                                                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-bg-hover rounded-lg text-text-main transition-colors"
                                                disabled={!item.foodId}
                                            >
                                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total</p>
                                            <p className="text-xl font-black text-text-main">₹{(item.foodId?.price || 0) * item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY & CHECKOUT */}
                    <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 space-y-6">
                        
                        {/* Coupons */}
                        <div className="surface-card p-6 space-y-4">
                            <h3 className="font-bold text-text-main flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-primary" /> Apply Coupon
                            </h3>
                            
                            {appliedCoupon ? (
                                <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-success" />
                                        <div>
                                            <p className="font-bold text-success text-sm">{appliedCoupon.code} Applied</p>
                                            <p className="text-xs text-success/80">You saved ₹{discountAmount}</p>
                                        </div>
                                    </div>
                                    <button onClick={removeCoupon} className="text-xs font-bold text-red-500 hover:underline uppercase tracking-widest">Remove</button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Enter promo code" 
                                            value={coupon}
                                            onChange={(e) => setCoupon(e.target.value)}
                                            className="input-base flex-1 uppercase !py-2.5 !text-sm"
                                        />
                                        <button 
                                            onClick={applyCoupon}
                                            className="btn-outline !py-2.5 !px-4"
                                            disabled={!coupon}
                                        >
                                            APPLY
                                        </button>
                                    </div>
                                    {couponError && <p className="text-xs text-red-500 font-medium pl-1">{couponError}</p>}
                                    
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => setCoupon("FIRST50")} className="badge badge-primary hover:bg-primary hover:text-white transition-colors cursor-pointer border border-primary/20">FIRST50</button>
                                        <button onClick={() => setCoupon("SAVE20")} className="badge badge-accent hover:bg-accent hover:text-white transition-colors cursor-pointer border border-accent/20">SAVE20</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bill Details */}
                        <div className="surface-card p-6 sm:p-8 space-y-6">
                            <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Bill Details</h2>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-medium text-text-muted">
                                    <span>Item Total</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                
                                <div className="flex justify-between items-center text-sm font-medium text-text-muted">
                                    <div className="flex items-center gap-2">
                                        <span>Delivery Fee</span>
                                        {isFreeDelivery && <span className="bg-success/10 px-1.5 py-0.5 rounded text-[9px] font-bold text-success uppercase tracking-widest">Free</span>}
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        {isFreeDelivery && <span className="text-text-muted/40 line-through text-xs italic">₹49</span>}
                                        <span className={isFreeDelivery ? "text-success font-bold" : ""}>₹{deliveryFee}</span>
                                    </div>
                                </div>

                                {appliedCoupon && (
                                    <div className="flex justify-between items-center text-sm font-bold text-success">
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span>- ₹{discountAmount}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-sm font-medium text-text-muted">
                                    <span>GST (5%)</span>
                                    <span>₹{gst}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-text-muted">
                                    <span>Platform Fee</span>
                                    <span>₹{platformFee}</span>
                                </div>

                                <div className="divider !my-4" />

                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">To Pay</p>
                                        <p className="text-3xl font-black text-text-main">₹{totalToPay}</p>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="bg-success/10 text-success px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border border-success/20">
                                            Total Savings: ₹{discountAmount + (isFreeDelivery ? 49 : 0)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/checkout", { state: { discountAmount } })}
                                className="w-full btn-primary !py-4 shadow-primary hover-lift"
                            >
                                Proceed to Checkout <ChevronRight className="w-5 h-5 ml-1" />
                            </button>

                            <div className="text-center pt-2">
                                <div className="flex items-center justify-center gap-2 text-text-muted opacity-60">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
