import { useEffect, useState } from "react";
import API from "../../services/api";
import { Package, Truck, CheckCircle, XCircle, Clock, Search, Filter, Eye, RefreshCcw, LayoutGrid } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

/**
 * Administrative interface for monitoring and updating the status of all orders
 * across the platform. Includes live status filtering and fulfillment tools.
 */
export default function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    // Real-time counters for different order states
    const [stats, setStats] = useState({ pending: 0, preparing: 0, delivered: 0 });

    // Initial load of global orders
    useEffect(() => {
        fetchOrders();
    }, []);

    /**
     * Retrieves all orders and calculates basic breakdown stats
     */
    const fetchOrders = async () => {
        try {
            const res = await API.get("/orders/admin");
            // Standard sort to put most recent activity at the top
            const data = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(data);

            // Dynamically calculate status counts for header cards
            setStats({
                pending: data.filter(o => o.status === "Pending").length,
                preparing: data.filter(o => o.status === "Preparing").length,
                delivered: data.filter(o => o.status === "Delivered").length,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Updates an order's fulfillment stage in the database
     */
    const updateStatus = async (id, status) => {
        try {
            await API.put(`/orders/${id}/status`, { status });
            // Refresh list to reflect state changes across the board
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * Visual mapping helper for badge styling based on status
     */
    const getStatusStyles = (status) => {
        switch (status) {
            case "Pending": return "bg-primary/10 text-primary border-primary/20";
            case "Preparing": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "Out for Delivery": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "Delivered": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-black/5 text-text-muted border-black/5";
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-12 animate-fade-in pb-20">

            {/* Command Header and Summary Counters */}
            <div className="flex flex-wrap items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase italic">Logistics Hub</h2>
                    <p className="text-text-muted mt-2 font-black uppercase tracking-[0.2em] text-[10px] opacity-60">Real-time Fulfillment Command Center</p>
                </div>

                <div className="flex gap-4">
                    {/* Status Breakdown Cards */}
                    <div className="glass-card !bg-white px-6 py-4 flex items-center gap-4 border border-black/5 shadow-lg">
                        <div className="bg-primary/10 p-2 rounded-xl"><Clock className="text-primary w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Pending</p>
                            <p className="text-xl font-black text-text-main leading-none italic">{stats.pending}</p>
                        </div>
                    </div>
                    <div className="glass-card !bg-white px-6 py-4 flex items-center gap-4 border border-black/5 shadow-lg">
                        <div className="bg-accent/10 p-2 rounded-xl"><RefreshCcw className="text-accent w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">In Kitchen</p>
                            <p className="text-xl font-black text-text-main leading-none italic">{stats.preparing}</p>
                        </div>
                    </div>
                    <div className="glass-card !bg-white px-6 py-4 flex items-center gap-4 border border-black/5 shadow-lg text-green-500">
                        <div className="bg-green-500/10 p-2 rounded-xl"><CheckCircle className="text-green-500 w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Fulfilled</p>
                            <p className="text-xl font-black text-text-main leading-none italic">{stats.delivered}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Central Order Registry Table */}
            <div className="glass-card !bg-white overflow-hidden border border-black/5 shadow-2xl">
                {/* Table Toolbars */}
                <div className="p-6 border-b border-black/5 flex flex-wrap items-center justify-between gap-4 bg-gray-50">
                    <div className="flex items-center gap-4">
                        <LayoutGrid className="text-primary w-5 h-5" />
                        <h3 className="text-lg font-black text-text-main uppercase tracking-widest italic">Active Consignments</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input className="bg-gray-100/80 border border-black/10 rounded-xl py-2 pl-10 pr-4 text-sm text-text-main focus:outline-none focus:border-primary shadow-sm placeholder:text-text-muted/40" placeholder="Search ID..." />
                        </div>
                        <button className="p-2 bg-white rounded-xl text-text-muted hover:text-primary border border-gray-200 shadow-sm transition-all"><Filter className="w-4 h-4" /></button>
                    </div>
                </div>

                {/* Main Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.01] text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                                <th className="px-8 py-6">Order Identity</th>
                                <th className="px-8 py-6">Consignee & Route</th>
                                <th className="px-8 py-6">Inventory Items</th>
                                <th className="px-8 py-6">Total Value</th>
                                <th className="px-8 py-6">Mission Status</th>
                                <th className="px-8 py-6 text-right">Command</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                                    {/* Order Primary Identity */}
                                    <td className="px-8 py-6">
                                        <p className="text-text-main font-black tracking-widest text-xs uppercase italic">#{order._id.slice(-8).toUpperCase()}</p>
                                        <p className="text-[10px] text-text-muted mt-1 font-bold">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    {/* Customer & Address Details */}
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary uppercase">
                                                {order.userId?.name?.[0] || 'U'}
                                            </div>
                                            <p className="text-sm font-black text-text-main italic">{order.userId?.name || 'Client'}</p>
                                        </div>
                                        <p className="text-[10px] text-text-muted truncate max-w-[180px] font-bold opacity-60 italic">{order.deliveryAddress}</p>
                                    </td>
                                    {/* Visual Item List (Avatar Stack) */}
                                    <td className="px-8 py-6">
                                        <div className="flex -space-x-2">
                                            {order.items.slice(0, 3).map((item, i) => (
                                                <div key={i} className="w-8 h-8 rounded-lg border-2 border-white overflow-hidden bg-gray-100 shadow-sm" title={item.name || item.foodId?.name}>
                                                    <img src={item.image || item.foodId?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=50"} className="w-full h-full object-cover" alt="" />
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-8 h-8 rounded-lg border-2 border-white bg-primary flex items-center justify-center text-[8px] font-black text-white shadow-sm">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    {/* Payment and Value Summary */}
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-text-main italic">₹{order.totalAmount}</p>
                                        <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase opacity-60 italic">{order.paymentMethod}</p>
                                    </td>
                                    {/* Current Resolution State Badge */}
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    {/* Master Status Control Select */}
                                    <td className="px-8 py-6 text-right">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-[10px] font-black uppercase tracking-widest text-primary focus:outline-none focus:border-primary transition-all cursor-pointer hover:bg-gray-100 shadow-sm italic"
                                        >
                                            <option value="Pending" className="bg-white text-text-main">Pending</option>
                                            <option value="Preparing" className="bg-white text-text-main">Preparing</option>
                                            <option value="Out for Delivery" className="bg-white text-text-main">Dispatch</option>
                                            <option value="Delivered" className="bg-white text-text-main">Delivered</option>
                                            <option value="Cancelled" className="bg-white text-text-main">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
