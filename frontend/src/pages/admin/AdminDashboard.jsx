import { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";
import { LayoutDashboard, Utensils, UtensilsCrossed, ClipboardList, TrendingUp, Users, IndianRupee, ChevronRight } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        restaurants: 0,
        orders: 0,
        totalRevenue: 0,
        activeUsers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Mocking stats for now as backend might not have specialized stats endpoint
            const [restaurantRes, orderRes] = await Promise.all([
                API.get("/restaurants"),
                API.get("/orders/admin")
            ]);

            const totalRevenue = orderRes.data.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

            setStats({
                restaurants: restaurantRes.data.length,
                orders: orderRes.data.length,
                totalRevenue: totalRevenue,
                activeUsers: 42 // Mock
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    const statCards = [
        { label: "Total Restaurants", value: stats.restaurants, icon: Utensils, color: "text-primary", bg: "bg-primary/10" },
        { label: "Total Orders", value: stats.orders, icon: ClipboardList, color: "text-accent", bg: "bg-accent/10" },
        { label: "Total Revenue", value: `₹${stats.totalRevenue}`, icon: IndianRupee, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Active Customers", value: stats.activeUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-text-main flex items-center gap-3 uppercase italic tracking-tighter">
                        <LayoutDashboard className="text-primary w-8 h-8" />
                        Admin Dashboard
                    </h2>
                    <p className="text-text-muted mt-2 font-bold text-xs uppercase tracking-widest opacity-60">Manage your platform and track performance</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>View Reports</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="glass-card !bg-white p-8 space-y-4 hover:border-primary/20 transition-all shadow-xl group">
                        <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-text-muted text-[10px] uppercase tracking-[0.2em] font-black opacity-60">{stat.label}</p>
                            <p className="text-4xl font-black text-text-main mt-1 tracking-tighter italic">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-text-main px-1 uppercase tracking-wider italic">Management Controls</h3>
                    <div className="space-y-4">
                        <Link to="/admin/restaurants" className="group glass-card !bg-white p-6 flex items-center justify-between hover:border-primary/20 transition-all shadow-lg border border-black/5">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary transition-colors">
                                    <Utensils className="text-primary w-6 h-6 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="text-text-main font-black text-lg uppercase tracking-tight italic">Manage Restaurants</p>
                                    <p className="text-text-muted text-xs font-bold opacity-60">Add, edit or deactivate restaurants</p>
                                </div>
                            </div>
                            <ChevronRight className="text-text-muted group-hover:text-primary group-hover:translate-x-2 transition-all" />
                        </Link>

                        <Link to="/admin/orders" className="group glass-card !bg-white p-6 flex items-center justify-between hover:border-accent/20 transition-all shadow-lg border border-black/5">
                            <div className="flex items-center gap-4">
                                <div className="bg-accent/10 p-4 rounded-2xl group-hover:bg-accent transition-colors">
                                    <ClipboardList className="text-accent w-6 h-6 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="text-text-main font-black text-lg uppercase tracking-tight italic">Manage Orders</p>
                                    <p className="text-text-muted text-xs font-bold opacity-60">Update order status and tracking</p>
                                </div>
                            </div>
                            <ChevronRight className="text-text-muted group-hover:text-accent group-hover:translate-x-2 transition-all" />
                        </Link>
                    </div>
                </div>

                <div className="glass-card !bg-white p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl border border-black/5">
                    <div className="bg-primary/5 p-8 rounded-full">
                        <UtensilsCrossed className="text-primary w-14 h-14" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-text-main uppercase italic tracking-tighter">System Health</h3>
                        <p className="text-text-muted max-w-xs">All services are running smoothly. Database and CDN links are active.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-green-500/10 text-green-500 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        All Systems Operational
                    </div>
                </div>
            </div>
        </div>
    );
}
