import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Plus, Minus, ShoppingBag, ArrowLeft, Info, Star, ChevronRight, UtensilsCrossed } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

/**
 * Restaurant Detail Page Component
 * Displays restaurant information and its menu items with add-to-cart functionality
 */
export default function Restaurant({ showToast }) {
    const { id } = useParams(); // Get restaurant ID from URL
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Local state for restaurant details, menu items, and UI feedback
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({}); // Tracks quantity selected for each food item locally before adding to cart
    const [adding, setAdding] = useState(null); // Tracks which item is currently being added to API
    const [selectedFood, setSelectedFood] = useState(null); // For detail modal
    const [activeCategory, setActiveCategory] = useState(null); // For sidebar filtering

    // Fetch data when restaurant ID changes
    useEffect(() => {
        fetchDetails();
    }, [id]);

    /**
     * Parallel fetch for restaurant profile and its associated food items
     */
    const fetchDetails = async () => {
        try {
            const [resRest, resFood] = await Promise.all([
                API.get(`/restaurants/${id}`),
                API.get(`/foods/${id}`)
            ]);
            setRestaurant(resRest.data);
            setFoods(resFood.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Updates the local quantity for a specific food item
     */
    const handleQuantity = (foodId, delta) => {
        setQuantities(prev => ({
            ...prev,
            [foodId]: Math.max(1, (prev[foodId] || 1) + delta)
        }));
    };

    /**
     * Adds an item to the global cart state
     */
    const handleAddToCart = async (food) => {
        // Enforce login before adding to cart
        if (!user) {
            showToast("You must login or signup first", "error");
            navigate("/login");
            return;
        }

        setAdding(food._id);
        const qty = quantities[food._id] || 1;
        const success = await addToCart(food._id, qty);

        if (success) {
            showToast(`${food.name} added to cart!`, "success");
            // Reset local quantity after success
            setQuantities(prev => ({ ...prev, [food._id]: 1 }));
            setSelectedFood(null);
        } else {
            showToast("Failed to add item. Try again.", "error");
        }
        setAdding(null);
    };

    if (loading) return <LoadingSpinner />;

    // Empty state if restaurant doesn't exist
    if (!restaurant) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 animate-fade-in">
            <div className="bg-black/5 p-10 rounded-full">
                <UtensilsCrossed className="w-20 h-20 text-text-main/20" />
            </div>
            <h2 className="text-3xl font-bold text-text-main tracking-tight">Restaurant not found.</h2>
            <Link to="/" className="btn-primary px-8 py-3">Explore Other Dining Options</Link>
        </div>
    );

    // Get unique categories from the food list for the sidebar
    const categories = [...new Set(foods.map(f => f.category))];

    return (
        <div className="space-y-12 animate-fade-in pb-20 relative">

            {/* Hero Image & Information */}
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                    src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2000"}
                    className="w-full h-full object-cover"
                    alt={restaurant.name}
                />
                <div className="absolute inset-0 bg-linear-to-t from-bg-dark via-bg-dark/40 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <Link to="/" className="inline-flex items-center gap-2 text-text-main hover:text-primary transition-colors text-sm font-semibold glass-card px-4 py-2 !rounded-full">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dining
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-bold text-text-main tracking-tight">{restaurant.name}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90">
                            <div className="flex items-center gap-2 bg-black/5 px-4 py-2 rounded-xl backdrop-blur-md">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-text-main">4.8 (500+ Reviews)</span>
                            </div>
                            <div className="flex items-center gap-2 text-text-muted">
                                <Info className="w-5 h-5 text-primary" />
                                <span className="text-sm">{restaurant.description}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* Categories Sidebar Index */}
                <div className="lg:col-span-1 space-y-4 hidden lg:block sticky top-24 h-fit">
                    <h3 className="text-xl font-bold text-text-main px-4 border-l-4 border-primary ml-2">Categories</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${!activeCategory ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-black/5 hover:text-text-main'}`}
                        >
                            <span className="font-bold uppercase tracking-widest text-[10px]">All Dishes</span>
                            <ChevronRight className={`w-4 h-4 transition-all ${!activeCategory ? 'opacity-100 rotate-90' : 'opacity-0 group-hover:opacity-100'}`} />
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-black/5 hover:text-text-main'}`}
                            >
                                <span className="font-bold uppercase tracking-widest text-[10px]">{cat}</span>
                                <ChevronRight className={`w-4 h-4 transition-all ${activeCategory === cat ? 'opacity-100 rotate-90' : 'opacity-0 group-hover:opacity-100'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Menu Feed: Grouped by category */}
                <div className="lg:col-span-3 space-y-12">
                    {categories.filter(cat => !activeCategory || cat === activeCategory).map(cat => (
                        <div key={cat} className="space-y-6">
                            <h3 className="text-2xl font-black text-text-main flex items-center gap-4">
                                <span className="w-2 h-8 bg-primary rounded-full" />
                                {cat}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {foods.filter(f => f.category === cat).map(food => (
                                    <div
                                        key={food._id}
                                        className="glass-card !bg-white flex p-5 gap-6 hover:border-primary/20 transition-all group relative overflow-hidden active:scale-[0.98] duration-200"
                                    >
                                        <div
                                            onClick={() => setSelectedFood(food)}
                                            className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5 shadow-xl cursor-pointer"
                                        >
                                            <img
                                                src={food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                alt={food.name}
                                            />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between py-1">
                                            <div onClick={() => setSelectedFood(food)} className="space-y-1 cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3 h-3 border border-green-500 flex items-center justify-center rounded-[2px] p-[1px]">
                                                        <span className="w-full h-full bg-green-500 rounded-full" />
                                                    </span>
                                                    <h4 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">{food.name}</h4>
                                                </div>
                                                <p className="text-text-muted text-xs line-clamp-2 italic opacity-60">Delightful culinary experience featuring premium ingredients.</p>
                                                <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold pt-1">
                                                    <Star className="w-3 h-3 fill-yellow-400" />
                                                    <span>4.0 (78)</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-4 mt-4">
                                                <span className="text-2xl font-black text-text-main">₹{food.price}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToCart(food);
                                                    }}
                                                    disabled={adding === food._id}
                                                    className="bg-black/5 hover:bg-primary text-text-main hover:text-white font-black py-2.5 px-6 rounded-xl border border-black/5 group-hover:border-primary/50 transition-all text-xs uppercase tracking-widest flex items-center gap-2"
                                                >
                                                    {adding === food._id ? (
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        "ADD +"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Food Detail Modal: Triggered on item click */}
            {selectedFood && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
                    <div
                        className="absolute inset-0 bg-bg-dark/80 backdrop-blur-xl"
                        onClick={() => setSelectedFood(null)}
                    />

                    <div className="glass-card !bg-white w-full max-w-lg overflow-hidden relative animate-slide-up shadow-[0_0_50px_rgba(0,0,0,0.1)] border border-black/5">
                        <button
                            onClick={() => setSelectedFood(null)}
                            className="absolute top-4 right-4 z-50 bg-black/10 hover:bg-black/20 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                        >
                            <Plus className="w-6 h-6 text-text-main rotate-45" />
                        </button>

                        <div className="relative h-72">
                            <img
                                src={selectedFood.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"}
                                className="w-full h-full object-cover"
                                alt={selectedFood.name}
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-bg-dark via-transparent to-transparent" />
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 border border-green-500 flex items-center justify-center rounded-[3px] p-[2px]">
                                        <span className="w-full h-full bg-green-500 rounded-full" />
                                    </span>
                                    <h2 className="text-3xl font-black text-text-main">{selectedFood.name}</h2>
                                </div>
                                <p className="text-2xl font-black text-text-main italic">₹{selectedFood.price}</p>
                                <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                                    <Star className="w-4 h-4 fill-yellow-400" />
                                    <span>4.0 (78)</span>
                                </div>
                            </div>

                            <p className="text-text-muted leading-relaxed font-medium">
                                experience symphony of flavors with our {selectedFood.name}. prepared with premium ingredients and authentic culinary techniques.
                            </p>

                            {/* Quantity Control UI in Modal */}
                            <div className="flex items-center justify-between pt-6 border-t border-black/5">
                                <div className="flex items-center bg-black/5 rounded-2xl border border-black/5 p-1.5 min-w-[140px] justify-between">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleQuantity(selectedFood._id, -1); }}
                                        className="w-10 h-10 hover:bg-black/10 rounded-xl text-text-main transition-all disabled:opacity-30 flex items-center justify-center"
                                        disabled={(quantities[selectedFood._id] || 1) <= 1}
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="text-xl font-black text-text-main">{quantities[selectedFood._id] || 1}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleQuantity(selectedFood._id, 1); }}
                                        className="w-10 h-10 hover:bg-black/10 rounded-xl text-text-main transition-all flex items-center justify-center"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex flex-col items-center gap-1 group">
                                    <button
                                        onClick={() => handleAddToCart(selectedFood)}
                                        disabled={adding === selectedFood._id || !selectedFood.isAvailable}
                                        className="btn-primary !px-12 !py-4 text-lg font-black tracking-widest flex items-center gap-3 relative overflow-hidden"
                                    >
                                        {adding === selectedFood._id ? (
                                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            "ADD +"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}