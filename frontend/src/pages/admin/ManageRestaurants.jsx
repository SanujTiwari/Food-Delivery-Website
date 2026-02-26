import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import API from "../../services/api";
import { Plus, Edit2, Trash2, Power, PowerOff, MapPin, X, Check, Image as ImageIcon, Upload } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Link } from "react-router-dom";

export default function ManageRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentRestaurant, setCurrentRestaurant] = useState(null);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        isActive: true
    });

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            // Admin needs all restaurants, including inactive ones
            const res = await API.get("/restaurants?all=true");
            setRestaurants(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (restaurant = null) => {
        if (restaurant) {
            setCurrentRestaurant(restaurant);
            setFormData({
                name: restaurant.name,
                description: restaurant.description,
                address: restaurant.address,
                isActive: restaurant.isActive
            });
            setImagePreview(restaurant.image || "");
        } else {
            setCurrentRestaurant(null);
            setFormData({
                name: "",
                description: "",
                address: "",
                isActive: true
            });
            setImagePreview("");
        }
        setImageFile(null);
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("address", formData.address);
            data.append("isActive", formData.isActive);
            if (imageFile) {
                data.append("image", imageFile);
            }

            if (currentRestaurant) {
                // do not set Content-Type manually when sending FormData, axios will handle the boundary
                await API.put(`/restaurants/${currentRestaurant._id}`, data);
            } else {
                await API.post("/restaurants", data);
            }
            fetchRestaurants();
            setShowModal(false);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.msg || "Error saving restaurant";
            alert(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this restaurant?")) {
            try {
                await API.delete(`/restaurants/${id}`);
                fetchRestaurants();
            } catch (err) {
                console.error(err);
                alert("Error deleting restaurant");
            }
        }
    };

    const toggleStatus = async (restaurant) => {
        try {
            await API.put(`/restaurants/${restaurant._id}`, {
                ...restaurant,
                isActive: !restaurant.isActive
            });
            fetchRestaurants();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase italic">Restaurant HQ</h2>
                    <p className="text-text-muted mt-1 font-bold text-xs uppercase tracking-widest opacity-60">Unified control center for your dining partners</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 !py-4">
                    <Plus className="w-5 h-5" />
                    <span>Onboard Restaurant</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {restaurants.map((r) => (
                    <div key={r._id} className="glass-card !bg-white overflow-hidden group hover:border-primary/20 transition-all shadow-xl border border-black/5">
                        <div className="relative h-48 overflow-hidden bg-gray-50">
                            <img src={r.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={r.name} />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(r)}
                                    className="p-2 glass-card bg-white/80 hover:bg-white text-text-main transition-all backdrop-blur-md shadow-lg"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(r._id)}
                                    className="p-2 glass-card bg-red-50 hover:bg-red-600 text-white transition-all backdrop-blur-md shadow-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md shadow-xl ${r.isActive ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${r.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                    {r.isActive ? 'Active' : 'Offline'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <h3 className="text-xl font-black text-text-main uppercase tracking-tight group-hover:text-primary transition-colors italic">{r.name}</h3>
                            <p className="text-text-muted text-sm line-clamp-2 italic opacity-80">{r.description}</p>
                            <div className="flex items-center gap-3 text-text-muted text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="truncate">{r.address}</span>
                            </div>
                            <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                                <Link to={`/admin/restaurants/${r._id}/foods`} className="text-[10px] font-black text-white hover:bg-primary/90 transition-colors flex items-center gap-2 uppercase tracking-widest bg-primary px-4 py-2 rounded-lg">
                                    Manage Menu
                                    <Plus className="w-3 h-3" />
                                </Link>
                                <button
                                    onClick={() => toggleStatus(r)}
                                    className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all px-3 py-2 rounded-lg ${r.isActive ? 'text-red-500 hover:bg-red-500/10' : 'text-green-500 hover:bg-green-500/10'}`}
                                >
                                    {r.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                                    {r.isActive ? 'Go Offline' : 'Go Live'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !saving && setShowModal(false)} />
                    <div className="relative glass-card !bg-white w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.2)] border border-black/5 animate-fade-in">
                        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                            {/* Header */}
                            <div className="p-10 pb-6 flex items-center justify-between border-b border-black/5 bg-gray-50">
                                <div>
                                    <h3 className="text-3xl font-black text-text-main uppercase tracking-tight leading-none italic">{currentRestaurant ? 'Modify Partner' : 'New Partner'}</h3>
                                    <p className="text-text-muted text-[11px] mt-2 font-bold uppercase tracking-widest opacity-50">Restaurant Onboarding System</p>
                                </div>
                                <button type="button" onClick={() => !saving && setShowModal(false)} className="p-3 hover:bg-gray-200 rounded-full text-text-muted transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Scrollable Body */}
                            <div className="flex-grow overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                {/* Section 1: Identity */}
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] inline-block border-b border-primary/30 pb-1">Essential Identity</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1 opacity-70">Restaurant Name</label>
                                                <input
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-gray-100/80 border border-black/10 rounded-xl py-4 px-6 text-text-main focus:outline-none focus:border-primary transition-all font-bold text-base shadow-sm placeholder:text-text-muted/40"
                                                    placeholder="e.g. Gourmet Central"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1 opacity-70">Location Address</label>
                                                <input
                                                    required
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-6 text-text-main focus:outline-none focus:border-primary/50 transition-all font-bold text-base shadow-sm"
                                                    placeholder="Full physical address"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1 opacity-70 block">Brand Visual</label>
                                            <div className="relative group/upload h-[178px] rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/50 transition-all overflow-hidden bg-gray-50 shadow-sm cursor-pointer">
                                                {imagePreview ? (
                                                    <>
                                                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                            <label className="cursor-pointer bg-white text-black px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
                                                                Update Visual
                                                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                                            </label>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-gray-100 transition-colors">
                                                        <Upload className="w-10 h-10 text-text-muted mb-3 group-hover/upload:text-primary transition-all group-hover/upload:-translate-y-1" />
                                                        <span className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.2em]">Upload Resolution Asset</span>
                                                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Narrative */}
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] inline-block border-b border-primary/30 pb-1">Brand Narrative</h4>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1 opacity-70">Story & Description</label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-gray-100/80 border border-black/10 rounded-xl py-5 px-6 text-text-main focus:outline-none focus:border-primary transition-all h-40 resize-none font-medium text-sm leading-relaxed shadow-sm placeholder:text-text-muted/40"
                                            placeholder="Tell the story of this dining destination..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-10 pt-6 border-t border-black/5 bg-gray-50">
                                <div className="flex items-center gap-6">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-grow btn-primary flex items-center justify-center gap-3 !py-5 text-xs font-black tracking-widest shadow-xl shadow-primary/10"
                                    >
                                        {saving ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5" />
                                                <span className="uppercase">{currentRestaurant ? 'Save Changes' : 'Initialize Partner'}</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        disabled={saving}
                                        className="px-10 py-5 bg-white hover:bg-gray-100 text-text-main transition-all font-black tracking-[0.2em] uppercase text-[10px] border border-gray-200 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
