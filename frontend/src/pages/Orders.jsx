import { useEffect, useState } from "react";
import API from "../services/api";
import { Package, Truck, CheckCircle, Clock, Search, ArrowRight, ShoppingBag, MapPin, Receipt, Star } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Orders History Page Component
 * Displays a list of all past orders placed by the current user
 */
export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial data fetch on mount
    useEffect(() => {
        fetchOrders();
    }, []);

    /**
     * Fetches user-specific orders and sorts them by most recent first
     */
    const fetchOrders = async () => {
        try {
            const res = await API.get("/orders/user");
            // Standard JS sort to ensure newest orders appear at the top
            setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Helper to map order status strings to visual Lucide icons
     */
    const getStatusIcon = (status) => {
        switch (status) {
            case "Preparing": return <Clock className="text-orange-400" />;
            case "Out for Delivery": return <Truck className="text-blue-400" />;
            case "Delivered": return <CheckCircle className="text-green-400" />;
            default: return <Package className="text-primary" />;
        }
    };

    /**
     * Helper to map order status strings to Tailwind CSS styling classes
     */
    const getStatusClass = (status) => {
        switch (status) {
            case "Preparing": return "bg-orange-500/20 text-orange-500 border-orange-500/30";
            case "Out for Delivery": return "bg-blue-500/20 text-blue-500 border-blue-500/30";
            case "Delivered": return "bg-green-500/20 text-green-500 border-green-500/30";
            default: return "bg-primary/20 text-primary border-primary/30";
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20 pt-12 px-4">

            {/* Page Header and Search UI */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-8">
                <div>
                    <h2 className="text-4xl md:text-6xl font-black text-text-main tracking-tight uppercase">
                        Order <span className="text-primary italic">History</span>
                    </h2>
                    <p className="text-text-muted mt-2 font-bold uppercase tracking-widest text-xs opacity-40">Your past foodie moments</p>
                </div>
                {/* Search Bar (Functional placeholder for UI completeness) */}
                <div className="relative group min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                        placeholder="Search orders..."
                        className="w-full bg-gray-50 border border-black/5 rounded-xl py-4 pl-12 pr-6 text-text-main focus:outline-none focus:border-primary transition-all font-medium shadow-sm"
                    />
                </div>
            </div>

            {/* Empty State for New Users */}
            {orders.length === 0 ? (
                <div className="py-24 text-center space-y-8">
                    <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto border border-black/5">
                        <ShoppingBag className="w-10 h-10 text-text-muted opacity-40" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-text-main">No orders found</h3>
                        <p className="text-text-muted max-w-sm mx-auto font-medium">Your culinary journey is just one click away. Start your first order now.</p>
                    </div>
                    <button className="btn-primary px-10 py-4 !rounded-full">
                        Order Food Now
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Map through each order card */}
                    {orders.map((order) => (
                        <div key={order._id} className="glass-card !bg-white overflow-hidden hover:border-black/20 transition-all border border-black/5 shadow-xl">

                            {/* Card Top Banner: Status and ID */}
                            <div className="p-6 md:p-8 flex flex-wrap items-center justify-between gap-6 border-b border-black/5 bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl border ${getStatusClass(order.status)} flex items-center justify-center`}>
                                        {getStatusIcon(order.status)}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-40">Status</p>
                                        <h4 className="text-xl font-bold text-text-main">{order.status}</h4>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-40 mb-1">Placed On</p>
                                    <p className="text-text-main font-bold">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-40 mb-1">Order ID</p>
                                    <p className="text-primary font-black tracking-widest text-[10px]">#{order._id.slice(-8).toUpperCase()}</p>
                                </div>
                            </div>

                            {/* Card Content: Item Grid and Summary */}
                            <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className="lg:col-span-8 space-y-4">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-40">Items</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-black/5 group/item hover:bg-white transition-all">
                                                <div className="w-14 h-14 rounded-lg overflow-hidden border border-black/5 flex-shrink-0">
                                                    <img
                                                        src={item.image || item.foodId?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                                                        alt={item.name || item.foodId?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-text-main font-bold text-sm">{item.name || item.foodId?.name || "Deleted Item"}</p>
                                                    <p className="text-text-muted text-[10px] font-bold">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Summary Sidebar (Address & Amount) */}
                                <div className="lg:col-span-4 bg-gray-50 p-6 rounded-2xl border border-black/5 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="text-primary w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-40">Delivery To</p>
                                                <p className="text-text-main font-medium text-xs leading-relaxed">{order.deliveryAddress}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-black/5">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-40">Paid Amount</p>
                                                <p className="text-3xl font-black text-primary">₹{order.totalAmount}</p>
                                            </div>
                                            <Star className="text-primary w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
