import { useEffect, useState } from "react";
import API from "../../services/api";
import { useParams, Link } from "react-router-dom";
import { Plus, Edit2, Trash2, ArrowLeft, X, Check, UtensilsCrossed, Image as ImageIcon, Upload } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

/**
 * ManageFoods Component
 * Admin view for adding, editing, and deleting food items for a specific restaurant.
 * Handles inventory cataloging and image uploads.
 */
export default function ManageFoods() {
    const { restaurantId } = useParams(); // ID of the restaurant being managed
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentFood, setCurrentFood] = useState(null); // The food item currently being edited (null if adding new)
    const [saving, setSaving] = useState(false);

    // States for image handling
    const [imageFile, setImageFile] = useState(null); // The actual file object for upload
    const [imagePreview, setImagePreview] = useState(""); // URL for local preview before upload

    // Form state for creating/updating food entries
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        isAvailable: true
    });

    // Fetch initial data on restaurant ID change
    useEffect(() => {
        fetchRestaurant();
        fetchFoods();
    }, [restaurantId]);

    /**
     * Gets restaurant profile to display context in header
     */
    const fetchRestaurant = async () => {
        try {
            const res = await API.get(`/restaurants/${restaurantId}`);
            setRestaurant(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * Gets the current menu for the restaurant
     */
    const fetchFoods = async () => {
        try {
            const res = await API.get(`/foods/${restaurantId}`);
            setFoods(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Preps the form modal for either creation OR editing
     */
    const handleOpenModal = (food = null) => {
        if (food) {
            // Populate form for editing existing item
            setCurrentFood(food);
            setFormData({
                name: food.name,
                price: food.price,
                category: food.category,
                isAvailable: food.isAvailable
            });
            setImagePreview(food.image || "");
        } else {
            // Reset form for adding new item
            setCurrentFood(null);
            setFormData({
                name: "",
                price: "",
                category: "",
                isAvailable: true
            });
            setImagePreview("");
        }
        setImageFile(null);
        setShowModal(true);
    };

    /**
     * Handles local image selection and preview generation
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); // Create temp URL for UI
        }
    };

    /**
     * Submits form data (using FormData to support multi-part image uploads)
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("price", formData.price);
            data.append("category", formData.category);
            data.append("isAvailable", formData.isAvailable);

            // Only attach image if a new file was selected
            if (imageFile) {
                data.append("image", imageFile);
            }

            if (currentFood) {
                // Update existing item
                await API.put(`/foods/${currentFood._id}`, data);
            } else {
                // Create new item for this restaurant
                await API.post(`/foods/${restaurantId}`, data);
            }

            // Refresh data and close UI
            fetchFoods();
            setShowModal(false);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.msg || "Error saving food item";
            alert(msg);
        } finally {
            setSaving(false);
        }
    };

    /**
     * Removes a food item from the menu after confirmation
     */
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this food item?")) {
            try {
                await API.delete(`/foods/${id}`);
                fetchFoods();
            } catch (err) {
                console.error(err);
                alert("Error deleting food item");
            }
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-10 animate-fade-in pb-20">

            {/* Header: Identity and Add Trigger */}
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link to="/admin/restaurants" className="p-3 bg-white !rounded-2xl shadow-lg border border-gray-100 hover:bg-gray-50 transition-all group">
                        <ArrowLeft className="w-6 h-6 text-text-main group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h2 className="text-4xl font-black text-text-main flex items-center gap-4 tracking-tighter uppercase italic">
                            <UtensilsCrossed className="text-primary w-10 h-10" />
                            {restaurant?.name} - Pantry
                        </h2>
                        <p className="text-text-muted mt-1 uppercase tracking-widest text-[10px] font-black italic opacity-60">Inventory & Catalog Management</p>
                    </div>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-3 !py-4 !px-8 text-lg">
                    <Plus className="w-6 h-6" />
                    <span>Create Delicacy</span>
                </button>
            </div>

            {/* Grid of Food Item Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {foods.map((f) => (
                    <div key={f._id} className="glass-card !bg-white overflow-hidden group hover:translate-y-[-8px] transition-all duration-300 shadow-xl border border-black/5">
                        {/* Visual Asset Section */}
                        <div className="relative h-56 bg-gray-50 p-4">
                            <div className="relative h-full rounded-2xl overflow-hidden">
                                <img src={f.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={f.name} />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Per-card Administrative Actions */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button onClick={() => handleOpenModal(f)} className="p-3 bg-white/80 hover:bg-white text-text-main backdrop-blur-xl transition-all shadow-xl rounded-xl">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(f._id)} className="p-3 bg-red-500 hover:bg-red-600 text-white backdrop-blur-xl transition-all shadow-xl rounded-xl">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-primary/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-2xl">
                                        {f.category}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Summary Information */}
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-black text-text-main group-hover:text-primary transition-colors tracking-tight italic uppercase">{f.name}</h3>
                                <div className="text-right">
                                    <p className="text-3xl font-black gradient-text tracking-tighter italic">₹{f.price}</p>
                                    <p className="text-[10px] text-text-muted font-black uppercase tracking-tighter opacity-60">Per Serving</p>
                                </div>
                            </div>

                            {/* Availability Toggle Representation */}
                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className={`w-3 h-3 rounded-full ${f.isAvailable ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`} />
                                <span className={`text-xs font-black uppercase tracking-widest ${f.isAvailable ? 'text-green-500' : 'text-red-500 font-bold opacity-60'}`}>
                                    {f.isAvailable ? 'Cooked & Ready' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form Modal for Add/Edit logic */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-0">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !saving && setShowModal(false)} />
                    <div className="relative glass-card !bg-white w-full max-w-2xl p-10 space-y-10 animate-fade-in shadow-2xl border border-black/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-3xl font-black text-text-main italic tracking-tighter uppercase">{currentFood ? 'REDEFINE DELICACY' : 'CRAFT NEW DISH'}</h3>
                                <p className="text-text-muted text-xs font-bold uppercase tracking-[0.2em] mt-2 opacity-60">Signature Menu Addition</p>
                            </div>
                            <button onClick={() => !saving && setShowModal(false)} className="p-3 hover:bg-gray-100 rounded-full text-text-muted transition-all">
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    {/* Name Input */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2">Dish Name</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-100/80 border border-black/10 rounded-2xl py-4 px-6 text-text-main focus:outline-none focus:border-primary transition-all font-bold text-lg shadow-sm placeholder:text-text-muted/40"
                                            placeholder="e.g. Diamond Truffle Pasta"
                                        />
                                    </div>
                                    {/* Price Input */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2">Price Point (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-gray-100/80 border border-black/10 rounded-2xl py-4 px-6 text-text-main focus:outline-none focus:border-primary transition-all font-bold text-xl shadow-sm placeholder:text-text-muted/40"
                                            placeholder="999"
                                        />
                                    </div>
                                </div>

                                {/* Custom Upload UI for Images */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2 block">Menu Visual</label>
                                    <div className="relative group/upload h-[178px] rounded-[2.5rem] border-2 border-dashed border-gray-200 hover:border-primary/50 transition-all overflow-hidden bg-gray-50 shadow-sm">
                                        {imagePreview ? (
                                            <>
                                                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/upload:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                    <label className="cursor-pointer bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                                                        Swap Image
                                                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                                    </label>
                                                </div>
                                            </>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center h-full cursor-pointer group-hover/upload:bg-gray-100/50">
                                                <div className="bg-gray-200/50 p-5 rounded-full mb-3 group-hover/upload:bg-primary/10 transition-colors">
                                                    <Upload className="w-8 h-8 text-text-muted group-hover/upload:text-primary transition-colors" />
                                                </div>
                                                <span className="text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em]">Upload Dish Photo</span>
                                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Category String Input */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2">Menu Category</label>
                                    <input
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-gray-100/80 border border-black/10 rounded-2xl py-4 px-6 text-text-main focus:outline-none focus:border-primary transition-all font-bold shadow-sm placeholder:text-text-muted/40"
                                        placeholder="e.g. Signature Mains"
                                    />
                                </div>
                                {/* Availability Checkbox UI */}
                                <div className="flex flex-col justify-end">
                                    <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors shadow-sm" onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}>
                                        <div className={`w-6 h-6 rounded-md border-2 border-primary flex items-center justify-center transition-all ${formData.isAvailable ? 'bg-primary border-primary' : 'bg-white'}`}>
                                            {formData.isAvailable && <Check className="w-4 h-4 text-white font-bold" />}
                                        </div>
                                        <span className="text-text-main font-black text-xs uppercase tracking-[0.1em]">Available for Dispatch</span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Action Buttons */}
                            <div className="flex items-center gap-8 pt-6">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-grow btn-primary flex items-center justify-center gap-4 !py-6 text-xl tracking-tighter shadow-2xl shadow-primary/30"
                                >
                                    {saving ? (
                                        <div className="w-7 h-7 border-[5px] border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Check className="w-7 h-7" />
                                            <span className="font-black italic">{currentFood ? 'FINALIZE UPDATES' : 'ENLIST DELICACY'}</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    disabled={saving}
                                    className="px-12 py-6 bg-white hover:bg-gray-100 text-text-main transition-all font-black tracking-[0.2em] uppercase text-[10px] border border-gray-200 rounded-xl"
                                >
                                    ABORT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
