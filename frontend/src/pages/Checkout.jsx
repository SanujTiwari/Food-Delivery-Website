import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import API from "../services/api";
import { 
    MapPin, CreditCard, ChevronRight, ShoppingBag, ArrowLeft, 
    CheckCircle2, Loader2, QrCode, Smartphone, Landmark, PartyPopper
} from "lucide-react";

export default function Checkout() {
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve discount from Cart page, if any
    const discountAmount = location.state?.discountAmount || 0;

    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState("");

    const [formData, setFormData] = useState({
        name: user?.name || "",
        phone: "",
        flat: "",
        area: "",
        city: "",
        pincode: "",
        paymentMethod: "COD" // COD, UPI, CARD
    });

    // Calculate final totals matching cart logic
    const subtotal = cart?.totalAmount || 0;
    const isFreeDelivery = subtotal > 299;
    const deliveryFee = isFreeDelivery ? 0 : 49;
    const gst = Math.round(subtotal * 0.05);
    const platformFee = 15;
    const finalAmount = subtotal + deliveryFee + gst + platformFee - discountAmount;

    // Confetti effect setup when successful
    useEffect(() => {
        if (orderSuccess) {
            // A simple CSS confetti effect is handled in index.css
            setTimeout(() => navigate("/orders"), 4000);
        }
    }, [orderSuccess, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.items.length === 0) return alert("Your cart is empty");
        if (!formData.phone || !formData.flat || !formData.area || !formData.pincode) {
            return alert("Please fill all required address fields");
        }

        const fullAddress = `${formData.name}, Ph: ${formData.phone}, ${formData.flat}, ${formData.area}, ${formData.city} - ${formData.pincode}`;

        setLoading(true);
        try {
            const res = await API.post("/orders", {
                items: cart.items,
                totalAmount: finalAmount,
                deliveryAddress: fullAddress,
                paymentMethod: formData.paymentMethod
            });

            setOrderId(res.data._id);
            clearCart();
            setOrderSuccess(true);
        } catch (err) {
            console.error(err);
            alert("Error placing order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="fixed inset-0 bg-bg-main z-[200] flex flex-col items-center justify-center p-4 animate-fade-in overflow-hidden">
                {/* CSS Confetti Elements */}
                {Array.from({ length: 50 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute w-3 h-3 rounded-full opacity-70"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-10%`,
                            backgroundColor: ['#6366F1', '#F43F5E', '#10B981', '#F59E0B'][Math.floor(Math.random() * 4)],
                            animation: `confetti-fall ${2 + Math.random() * 3}s linear infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}

                <div className="surface-card p-10 max-w-lg w-full text-center space-y-8 animate-scale-in relative z-10 border-primary/20 shadow-primary">
                    <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto animate-bounce-in relative">
                        <CheckCircle2 className="w-12 h-12 text-success relative z-10" />
                        <div className="absolute inset-0 bg-success/20 rounded-full animate-pulse-ring" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-4xl font-black text-text-main tracking-tight">Order Placed!</h2>
                        <p className="text-text-muted font-medium">Your delicious food is being prepared.</p>
                        <div className="bg-bg-subtle py-3 px-6 rounded-xl inline-block mt-4 border border-black/5 dark:border-white/5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Order ID</p>
                            <p className="font-black text-primary font-mono">{orderId.slice(-8).toUpperCase()}</p>
                        </div>
                    </div>
                    <div className="pt-6">
                        <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
                        <p className="text-xs text-text-muted mt-3 font-medium">Redirecting to order tracking...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-app pt-24 pb-24 space-y-12 animate-fade-in">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 dark:border-white/5 pb-8">
                <div className="space-y-4">
                    <Link to="/cart" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Basket
                    </Link>
                    <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">
                        Check<span className="text-primary italic">out</span>
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* LEFT: FORMS */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                    
                    {/* Delivery Address */}
                    <div className="surface-card p-6 sm:p-8 space-y-8 relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-soft rounded-full blur-[50px] pointer-events-none" />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 bg-primary-soft rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/10">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-text-main tracking-tight">Delivery Details</h2>
                                <p className="text-text-muted text-xs font-bold uppercase tracking-widest">Where should we deliver?</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-main uppercase tracking-widest pl-1">Full Name *</label>
                                <input 
                                    required value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    className="input-base" placeholder="John Doe" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-main uppercase tracking-widest pl-1">Phone Number *</label>
                                <input 
                                    required value={formData.phone} 
                                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                                    className="input-base" placeholder="+91 9876543210" 
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-text-main uppercase tracking-widest pl-1">Flat / House No. / Building *</label>
                                <input 
                                    required value={formData.flat} 
                                    onChange={e => setFormData({...formData, flat: e.target.value})} 
                                    className="input-base" placeholder="A-402, Signature Towers" 
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-text-main uppercase tracking-widest pl-1">Area / Sector / Locality *</label>
                                <input 
                                    required value={formData.area} 
                                    onChange={e => setFormData({...formData, area: e.target.value})} 
                                    className="input-base" placeholder="Sector 14, MG Road" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-main uppercase tracking-widest pl-1">City *</label>
                                <input 
                                    required value={formData.city} 
                                    onChange={e => setFormData({...formData, city: e.target.value})} 
                                    className="input-base" placeholder="New Delhi" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-main uppercase tracking-widest pl-1">Pincode *</label>
                                <input 
                                    required value={formData.pincode} 
                                    onChange={e => setFormData({...formData, pincode: e.target.value})} 
                                    className="input-base" placeholder="110001" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="surface-card p-6 sm:p-8 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-soft rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/10">
                                <Landmark className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-text-main tracking-tight">Payment Method</h2>
                                <p className="text-text-muted text-xs font-bold uppercase tracking-widest">Choose how you pay</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* UPI Option */}
                            <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'UPI' ? 'border-primary bg-primary-soft/30' : 'border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <input type="radio" name="payment" checked={formData.paymentMethod === 'UPI'} onChange={() => setFormData({...formData, paymentMethod: 'UPI'})} className="w-4 h-4 accent-primary" />
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-blue-500/10 text-blue-500 rounded flex items-center justify-center"><Smartphone className="w-4 h-4"/></div>
                                            <span className="font-bold text-text-main">UPI (GPay, PhonePe, Paytm)</span>
                                        </div>
                                    </div>
                                    <span className="badge badge-primary">Fast</span>
                                </div>
                                {formData.paymentMethod === 'UPI' && (
                                    <div className="mt-4 pl-8 pr-4 animate-slide-down">
                                        <div className="bg-bg-subtle p-4 rounded-xl border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center space-y-3">
                                            <QrCode className="w-16 h-16 text-text-muted opacity-50" />
                                            <p className="text-xs text-text-muted font-medium">Scan QR code or enter UPI ID on the next step. <br/> (Demo mode: no actual payment will be taken)</p>
                                        </div>
                                    </div>
                                )}
                            </label>

                            {/* Card Option */}
                            <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'CARD' ? 'border-primary bg-primary-soft/30' : 'border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'}`}>
                                <div className="flex items-center gap-4">
                                    <input type="radio" name="payment" checked={formData.paymentMethod === 'CARD'} onChange={() => setFormData({...formData, paymentMethod: 'CARD'})} className="w-4 h-4 accent-primary" />
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-purple-500/10 text-purple-500 rounded flex items-center justify-center"><CreditCard className="w-4 h-4"/></div>
                                        <span className="font-bold text-text-main">Credit / Debit Card</span>
                                    </div>
                                </div>
                                {formData.paymentMethod === 'CARD' && (
                                    <div className="mt-4 pl-8 animate-slide-down space-y-3">
                                        <input type="text" placeholder="Card Number" className="input-base !py-2 !text-sm" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" placeholder="MM/YY" className="input-base !py-2 !text-sm" />
                                            <input type="text" placeholder="CVV" className="input-base !py-2 !text-sm" />
                                        </div>
                                        <p className="text-[10px] text-text-muted">(Demo mode: leave blank)</p>
                                    </div>
                                )}
                            </label>

                            {/* COD Option */}
                            <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'border-primary bg-primary-soft/30' : 'border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'}`}>
                                <div className="flex items-center gap-4">
                                    <input type="radio" name="payment" checked={formData.paymentMethod === 'COD'} onChange={() => setFormData({...formData, paymentMethod: 'COD'})} className="w-4 h-4 accent-primary" />
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-500/10 text-green-500 rounded flex items-center justify-center"><ShoppingBag className="w-4 h-4"/></div>
                                        <span className="font-bold text-text-main">Cash on Delivery</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* RIGHT: ORDER SUMMARY */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="surface-card p-6 sm:p-8 space-y-6 lg:sticky lg:top-28">
                        <div>
                            <h2 className="text-xl font-black text-text-main uppercase tracking-tight">Your Order</h2>
                            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Review Summary</p>
                        </div>

                        {/* Items */}
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar border-b border-black/5 dark:border-white/5 pb-6">
                            {cart.items.map((item) => (
                                <div key={item.foodId?._id} className="flex justify-between items-start gap-4 group">
                                    <div className="space-y-0.5">
                                        <p className="text-text-main font-bold text-sm leading-tight group-hover:text-primary transition-colors">{item.foodId?.name}</p>
                                        <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-text-main font-black text-sm">₹{item.foodId?.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-text-muted font-bold text-xs">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-text-muted font-bold text-xs">
                                <span>Platform Fee</span>
                                <span>₹{platformFee}</span>
                            </div>
                            <div className="flex justify-between text-text-muted font-bold text-xs">
                                <span>GST (5%)</span>
                                <span>₹{gst}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-success font-bold text-xs">
                                    <span>Discount Applied</span>
                                    <span>- ₹{discountAmount}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-xs">
                                <span className="text-text-muted">Delivery Fee</span>
                                {isFreeDelivery ? (
                                    <span className="text-success uppercase tracking-widest text-[10px]">Free</span>
                                ) : (
                                    <span>₹49</span>
                                )}
                            </div>

                            <div className="pt-6 border-t border-black/5 dark:border-white/5 flex justify-between items-end">
                                <div className="space-y-1">
                                    <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest">Total Amount</span>
                                    <p className="text-4xl font-black text-primary">₹{finalAmount}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || cart.items.length === 0}
                            className="w-full btn-primary !py-4 shadow-primary"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Place Order Securely"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
