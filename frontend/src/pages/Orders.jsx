import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { 
    Package, Truck, CheckCircle, Clock, Search, ArrowRight, 
    ShoppingBag, MapPin, ChevronDown, Flame, UtensilsCrossed, Check
} from "lucide-react";

export default function Orders({ showToast }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All"); // All, Active, Past
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get("/orders/user");
            setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    const handleReorder = async (order) => {
        try {
            for (const item of order.items) {
                if (item.foodId) {
                    await addToCart(item.foodId._id || item.foodId, item.quantity);
                }
            }
            showToast("Items added to cart", "success");
            navigate("/cart");
        } catch (err) {
            showToast("Failed to reorder items", "error");
        }
    };

    const getStatusStep = (status) => {
        switch (status) {
            case "Pending": return 1;
            case "Confirmed": return 2;
            case "Preparing": return 3;
            case "Out for Delivery": return 4;
            case "Delivered": return 5;
            default: return 1;
        }
    };

    const steps = [
        { id: 1, label: "Pending", icon: Clock },
        { id: 2, label: "Confirmed", icon: Check },
        { id: 3, label: "Preparing", icon: Flame },
        { id: 4, label: "On the way", icon: Truck },
        { id: 5, label: "Delivered", icon: CheckCircle }
    ];

    const filteredOrders = orders.filter(order => {
        const matchesTab = 
            filter === "All" || 
            (filter === "Active" && order.status !== "Delivered") ||
            (filter === "Past" && order.status === "Delivered");
            
        const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
            order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
            
        return matchesTab && matchesSearch;
    });

    if (loading) return (
        <div className="container-app pt-24 pb-20 space-y-12">
            <div className="h-16 skeleton w-1/3" />
            <div className="space-y-6">
                {[1,2,3].map(i => <div key={i} className="h-48 skeleton" />)}
            </div>
        </div>
    );

    return (
        <div className="container-app pt-24 pb-24 space-y-12 animate-fade-in">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 dark:border-white/5 pb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tight uppercase">
                        Order <span className="text-primary italic">History</span>
                    </h2>
                    <p className="text-text-muted mt-2 font-bold uppercase tracking-widest text-xs">Track your foodie moments</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex bg-bg-subtle p-1 rounded-xl">
                        {["All", "Active", "Past"].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${
                                    filter === tab ? "bg-bg-card shadow-sm text-text-main" : "text-text-muted"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Search orders..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-base !pl-10 !py-2.5 !text-sm"
                        />
                    </div>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="py-24 text-center space-y-8 animate-slide-up">
                    <div className="w-24 h-24 bg-bg-subtle rounded-full flex items-center justify-center mx-auto text-text-faint">
                        <ShoppingBag className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-text-main">No orders found</h3>
                        <p className="text-text-muted max-w-sm mx-auto font-medium">
                            {filter === "Active" ? "You have no active orders." : "Your culinary journey is just one click away."}
                        </p>
                    </div>
                    <button onClick={() => navigate("/")} className="btn-primary inline-flex">
                        Order Food Now <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order, i) => {
                        const isExpanded = expandedOrder === order._id;
                        const currentStep = getStatusStep(order.status);
                        
                        return (
                            <div 
                                key={order._id} 
                                className="surface-card overflow-hidden animate-slide-up"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {/* CARD HEADER (Always visible) */}
                                <div 
                                    className="p-6 md:p-8 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary-soft text-primary rounded-xl flex items-center justify-center">
                                                <UtensilsCrossed className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Order ID: #{order._id.slice(-8).toUpperCase()}</p>
                                                <h4 className="text-xl font-bold text-text-main flex items-center gap-2">
                                                    {order.items.length} Items
                                                    <span className="text-text-faint text-sm font-normal">• ₹{order.totalAmount}</span>
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Placed On</p>
                                                <p className="text-sm font-bold text-text-main">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                            
                                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                                                order.status === "Delivered" ? "bg-success/10 text-success border-success/20" : "bg-primary-soft text-primary border-primary/20"
                                            }`}>
                                                {order.status}
                                            </div>

                                            <button className="w-8 h-8 flex items-center justify-center text-text-muted">
                                                <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* CARD EXPANDED DETAILS */}
                                {isExpanded && (
                                    <div className="border-t border-black/5 dark:border-white/5 animate-slide-down">
                                        
                                        {/* PROGRESS TRACKER */}
                                        <div className="p-8 border-b border-black/5 dark:border-white/5 bg-bg-subtle/50">
                                            <div className="max-w-3xl mx-auto relative">
                                                {/* Connecting Line Background */}
                                                <div className="absolute top-5 left-8 right-8 h-1 bg-black/10 dark:bg-white/10 rounded-full z-0" />
                                                {/* Connecting Line Progress */}
                                                <div 
                                                    className="absolute top-5 left-8 h-1 bg-primary rounded-full z-0 transition-all duration-1000 ease-out" 
                                                    style={{ width: `calc(${((currentStep - 1) / 4) * 100}% - 1rem)` }}
                                                />
                                                
                                                <div className="flex justify-between relative z-10">
                                                    {steps.map(step => (
                                                        <div key={step.id} className="flex flex-col items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                                                                step.id < currentStep ? "bg-primary text-white" :
                                                                step.id === currentStep ? "bg-primary text-white ring-4 ring-primary-soft animate-pulse" :
                                                                "bg-bg-card text-text-faint border border-black/10 dark:border-white/10"
                                                            }`}>
                                                                <step.icon className={`w-5 h-5 ${step.id <= currentStep ? "animate-scale-in" : ""}`} />
                                                            </div>
                                                            <span className={`text-[10px] font-bold uppercase tracking-widest text-center hidden sm:block ${
                                                                step.id <= currentStep ? "text-text-main" : "text-text-faint"
                                                            }`}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-bg-card">
                                            {/* ITEMS LIST */}
                                            <div className="lg:col-span-2 space-y-4">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">Order Items</h4>
                                                <div className="space-y-3">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-4 bg-bg-subtle p-3 rounded-xl border border-black/5 dark:border-white/5">
                                                            <img 
                                                                src={item.image || item.foodId?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
                                                                className="w-12 h-12 rounded-lg object-cover" 
                                                                alt={item.name} 
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-bold text-text-main text-sm">{item.name}</p>
                                                                <p className="text-xs text-text-muted font-medium">Qty: {item.quantity}</p>
                                                            </div>
                                                            <p className="font-black text-text-main pr-2">₹{item.price * item.quantity}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ORDER SUMMARY */}
                                            <div className="space-y-6">
                                                <div className="space-y-4 bg-bg-subtle p-6 rounded-xl border border-black/5 dark:border-white/5">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Delivery Address</p>
                                                        <p className="text-sm text-text-main font-medium leading-relaxed flex items-start gap-2">
                                                            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                                            {order.deliveryAddress}
                                                        </p>
                                                    </div>
                                                    <div className="divider" />
                                                    <div className="flex justify-between items-end">
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Total Paid</p>
                                                        <p className="text-2xl font-black text-primary">₹{order.totalAmount}</p>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleReorder(order); }}
                                                    className="w-full btn-outline border-primary text-primary hover:bg-primary hover:text-white group"
                                                >
                                                    Re-order Items <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
