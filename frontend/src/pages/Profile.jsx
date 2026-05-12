import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { 
    User, Mail, Phone, MapPin, Edit2, Shield, Heart, 
    Gift, ChevronRight, Activity, Camera, Loader2 
} from "lucide-react";

export default function Profile({ showToast }) {
    const { user, login } = useContext(AuthContext); // Note: we assume login updates the user state if we pass a new token
    const [loading, setLoading] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
    });

    // We'll mock some stats for the UI
    const stats = [
        { label: "Total Orders", value: "24", icon: Activity },
        { label: "Loyalty Points", value: "1,250", icon: Gift },
        { label: "Saved Addresses", value: "3", icon: MapPin },
        { label: "Favorite Places", value: "5", icon: Heart },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.put("/auth/profile", formData);
            // Assuming backend returns an updated token
            if (res.data.token) {
                login(res.data.token);
            }
            setIsEditing(false);
            if(showToast) showToast("Profile updated successfully", "success");
        } catch (err) {
            console.error(err);
            if(showToast) showToast("Failed to update profile", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="container-app pt-24 pb-24 space-y-12 animate-fade-in">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 dark:border-white/5 pb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black text-text-main tracking-tight uppercase">
                        My <span className="text-primary italic">Profile</span>
                    </h2>
                    <p className="text-text-muted mt-2 font-bold uppercase tracking-widest text-xs">Manage your DeliverX account</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* LEFT SIDEBAR: PROFILE SUMMARY */}
                <div className="space-y-6">
                    <div className="surface-card p-8 text-center space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary-soft to-accent-soft" />
                        
                        <div className="relative pt-8">
                            <div className="w-32 h-32 mx-auto bg-bg-card rounded-full p-2 relative shadow-xl">
                                <div className="w-full h-full bg-primary text-white rounded-full flex items-center justify-center text-4xl font-black font-[Outfit]">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <button className="absolute bottom-2 right-2 w-8 h-8 bg-white dark:bg-bg-subtle rounded-full flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <div className="mt-6 space-y-2">
                                <h3 className="text-2xl font-black text-text-main">{user.name}</h3>
                                <p className="text-text-muted font-medium text-sm flex items-center justify-center gap-2">
                                    <Shield className="w-4 h-4 text-success" />
                                    {user.role === "admin" ? "Administrator" : "Verified Customer"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="surface-card p-4 flex flex-col items-center justify-center text-center gap-2 hover-lift">
                                <div className="w-10 h-10 bg-primary-soft text-primary rounded-full flex items-center justify-center">
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <h4 className="text-xl font-black text-text-main">{stat.value}</h4>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT AREA: DETAILS & SETTINGS */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Details Form */}
                    <div className="surface-card p-8">
                        <div className="flex items-center justify-between mb-8 border-b border-black/5 dark:border-white/5 pb-4">
                            <h3 className="text-xl font-bold text-text-main uppercase tracking-widest">Personal Details</h3>
                            <button 
                                onClick={() => setIsEditing(!isEditing)}
                                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                                    isEditing ? "bg-red-500/10 text-red-500" : "bg-primary-soft text-primary hover:bg-primary hover:text-white"
                                }`}
                            >
                                {isEditing ? "Cancel" : <><Edit2 className="w-3.5 h-3.5" /> Edit</>}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase pl-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                        <input 
                                            type="text" 
                                            value={formData.name} 
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            disabled={!isEditing}
                                            className="input-base !pl-12 disabled:opacity-60 disabled:bg-black/5 dark:disabled:bg-white/5" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase pl-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                        <input 
                                            type="tel" 
                                            value={formData.phone} 
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                            disabled={!isEditing}
                                            className="input-base !pl-12 disabled:opacity-60 disabled:bg-black/5 dark:disabled:bg-white/5" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase pl-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                        <input 
                                            type="email" 
                                            value={formData.email} 
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            disabled={!isEditing}
                                            className="input-base !pl-12 disabled:opacity-60 disabled:bg-black/5 dark:disabled:bg-white/5" 
                                        />
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="pt-4 flex justify-end animate-fade-in">
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="btn-primary !py-3 !px-8 shadow-primary"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Additional Options */}
                    <div className="surface-card overflow-hidden">
                        {[
                            { title: "Delivery Addresses", desc: "Manage your saved addresses", icon: MapPin },
                            { title: "Payment Methods", desc: "Manage saved cards and UPIs", icon: Shield },
                            { title: "Notification Settings", desc: "SMS and Email preferences", icon: Activity },
                        ].map((item, i) => (
                            <div key={i} className={`p-6 flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${i !== 2 ? 'border-b border-black/5 dark:border-white/5' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-bg-subtle text-text-main rounded-xl flex items-center justify-center">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-main text-sm">{item.title}</h4>
                                        <p className="text-xs text-text-muted">{item.desc}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-text-faint" />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
