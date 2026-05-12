import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";
import { 
    TrendingUp, Users, ShoppingBag, DollarSign, Activity, 
    ArrowRight, UtensilsCrossed, Package, Star 
} from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        recentOrders: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch all orders and users
            const [ordersRes, usersRes] = await Promise.all([
                API.get("/orders"),
                API.get("/users")
            ]);
            
            const orders = ordersRes.data;
            const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

            setStats({
                totalRevenue: revenue,
                totalOrders: orders.length,
                totalUsers: usersRes.data.length,
                // Last 5 orders
                recentOrders: orders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
            });
        } catch (err) {
            console.error(err);
        }
    };

    const kpiCards = [
        { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10", trend: "+12.5%" },
        { title: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: ShoppingBag, color: "text-primary", bg: "bg-primary-soft", trend: "+8.2%" },
        { title: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-accent", bg: "bg-accent-soft", trend: "+15.3%" },
        { title: "Active Deliveries", value: "24", icon: Package, color: "text-warning", bg: "bg-warning/10", trend: "+2.1%" },
    ];

    // Mock chart data points
    const chartPoints = "0,100 20,80 40,90 60,40 80,60 100,20";

    return (
        <div className="container-app pt-24 pb-24 space-y-10 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 dark:border-white/5 pb-8">
                <div>
                    <h2 className="text-4xl font-black text-text-main tracking-tight uppercase">
                        Admin <span className="text-primary italic">Dashboard</span>
                    </h2>
                    <p className="text-text-muted mt-2 font-bold uppercase tracking-widest text-xs">Platform Overview & Analytics</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/admin/foods" className="btn-outline !py-2.5 !text-xs gap-2">
                        <UtensilsCrossed className="w-4 h-4" /> Manage Foods
                    </Link>
                    <Link to="/admin/orders" className="btn-primary !py-2.5 !text-xs gap-2">
                        <ShoppingBag className="w-4 h-4" /> All Orders
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, i) => (
                    <div key={i} className="surface-card p-6 flex flex-col justify-between h-36 hover-lift animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="flex justify-between items-start">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-1 rounded">
                                <TrendingUp className="w-3 h-3" /> {card.trend}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-text-main">{card.value}</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{card.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts & Top Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart (Mock SVG) */}
                <div className="lg:col-span-2 surface-card p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-text-main uppercase tracking-widest">Revenue Overview</h3>
                        <select className="input-base !py-1 !px-3 !w-auto !text-xs bg-transparent border-black/5 dark:border-white/5">
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    
                    <div className="relative h-64 w-full bg-bg-subtle rounded-xl border border-black/5 dark:border-white/5 flex items-end justify-between p-4 px-8 overflow-hidden">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                            {[1,2,3,4,5].map(i => <div key={i} className="w-full border-b border-text-main" />)}
                        </div>
                        
                        {/* SVG Line Chart */}
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full p-4 overflow-visible z-10">
                            <path 
                                d={`M ${chartPoints}`} 
                                fill="none" 
                                stroke="var(--primary)" 
                                strokeWidth="3" 
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="drop-shadow-lg"
                            />
                            {/* Points */}
                            {chartPoints.split(' ').map((point, i) => {
                                const [x, y] = point.split(',');
                                return (
                                    <circle key={i} cx={x} cy={y} r="3" fill="var(--bg-card)" stroke="var(--primary)" strokeWidth="2" />
                                );
                            })}
                        </svg>

                        {/* X-Axis labels */}
                        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-8 text-[10px] font-bold text-text-faint uppercase">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                        </div>
                    </div>
                </div>

                {/* Top Foods */}
                <div className="surface-card p-8 space-y-6">
                    <h3 className="text-lg font-black text-text-main uppercase tracking-widest">Trending Foods</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Margherita Pizza", orders: 145, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002" },
                            { name: "Spicy Chicken Burger", orders: 112, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd" },
                            { name: "Sushi Platter", orders: 98, img: "https://images.unsplash.com/photo-1553621042-f6e147245754" },
                            { name: "Paneer Tikka", orders: 85, img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8" },
                        ].map((food, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <img src={food.img} className="w-12 h-12 rounded-lg object-cover" alt={food.name} />
                                <div className="flex-1">
                                    <p className="font-bold text-sm text-text-main group-hover:text-primary transition-colors">{food.name}</p>
                                    <div className="flex items-center gap-1 text-[10px] text-text-muted font-bold">
                                        <Star className="w-3 h-3 text-warning fill-warning" /> 4.8
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-text-main">{food.orders}</p>
                                    <p className="text-[9px] uppercase tracking-widest text-text-muted">Orders</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to="/admin/foods" className="block w-full text-center py-2 text-xs font-bold text-primary hover:underline uppercase tracking-widest">
                        View Full Menu
                    </Link>
                </div>
            </div>

            {/* Recent Orders Activity */}
            <div className="surface-card p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black text-text-main uppercase tracking-widest">Recent Activity</h3>
                    <Link to="/admin/orders" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest flex items-center gap-1">
                        View All <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-black/5 dark:border-white/5">
                                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Order ID</th>
                                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Customer</th>
                                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Amount</th>
                                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Status</th>
                                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                            {stats.recentOrders.length > 0 ? (
                                stats.recentOrders.map(order => (
                                    <tr key={order._id} className="hover:bg-bg-subtle transition-colors">
                                        <td className="py-4 font-mono text-xs font-bold">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="py-4">
                                            <p className="text-sm font-bold text-text-main truncate max-w-[150px]">{order.deliveryAddress.split(',')[0]}</p>
                                        </td>
                                        <td className="py-4 font-black text-text-main">₹{order.totalAmount}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                                                order.status === "Delivered" ? "bg-success/10 text-success" :
                                                order.status === "Pending" ? "bg-warning/10 text-warning" :
                                                "bg-primary-soft text-primary"
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-xs font-medium text-text-muted flex items-center gap-1">
                                            <Activity className="w-3 h-3" />
                                            {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-text-muted text-sm font-medium">No recent orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
