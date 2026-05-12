import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { 
    Plus, Minus, ArrowLeft, Info, Star, ChevronRight, 
    UtensilsCrossed, Search, MapPin, Clock, Flame
} from "lucide-react";
import SkeletonCard from "../components/SkeletonCard";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function Restaurant({ showToast }) {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // UI states
    const [quantities, setQuantities] = useState({});
    const [adding, setAdding] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [dietFilter, setDietFilter] = useState("All"); // All, Veg, Non-Veg

    useEffect(() => {
        fetchDetails();
    }, [id]);

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
            setTimeout(() => setLoading(false), 500);
        }
    };

    const handleQuantity = (foodId, delta) => {
        setQuantities(prev => ({
            ...prev,
            [foodId]: Math.max(1, (prev[foodId] || 1) + delta)
        }));
    };

    const handleAddToCart = async (food) => {
        if (!user) {
            showToast("You must login first", "error");
            navigate("/login");
            return;
        }

        setAdding(food._id);
        const qty = quantities[food._id] || 1;
        const success = await addToCart(food._id, qty);

        if (success) {
            showToast(`${food.name} added to cart!`, "success");
            setQuantities(prev => ({ ...prev, [food._id]: 1 }));
            if (selectedFood) setSelectedFood(null);
        } else {
            showToast("Failed to add item.", "error");
        }
        setAdding(null);
    };

    if (loading) return (
        <div className="container-app pt-24 pb-20 space-y-12">
            <div className="h-[400px] skeleton rounded-3xl" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <div className="hidden lg:block h-[500px] skeleton rounded-2xl" />
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
                </div>
            </div>
        </div>
    );

    if (!restaurant) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 animate-fade-in">
            <div className="bg-bg-subtle p-10 rounded-full text-text-faint">
                <UtensilsCrossed className="w-20 h-20" />
            </div>
            <h2 className="text-3xl font-black">Restaurant not found.</h2>
            <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
    );

    const categories = ["All", ...new Set(foods.map(f => f.category))];

    const filteredFoods = foods.filter(f => {
        const matchesCategory = activeCategory === "All" || f.category === activeCategory;
        const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDiet = dietFilter === "All" || 
                           (dietFilter === "Veg" && f.isVeg) || 
                           (dietFilter === "Non-Veg" && f.isVeg === false);
        return matchesCategory && matchesSearch && matchesDiet;
    });

    return (
        <div className="container-app pt-24 pb-24 space-y-12 animate-fade-in">

            {/* 1. HERO BANNER */}
            <div className="relative h-[400px] rounded-[2rem] overflow-hidden shadow-2xl group">
                <img
                    src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    alt={restaurant.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute top-6 left-6">
                    <Link to="/" className="btn-outline !bg-black/20 !border-white/20 !text-white hover:!bg-primary !backdrop-blur-md">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4 text-white">
                        <div className="flex gap-2">
                            <span className="badge bg-white/20 text-white backdrop-blur-md">{restaurant.cuisine || "Multi-Cuisine"}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-lg">{restaurant.name}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium">
                            <div className="flex items-center gap-2 bg-success/20 text-success px-3 py-1.5 rounded-xl backdrop-blur-md border border-success/30 font-bold">
                                <Star className="w-4 h-4 fill-success" />
                                {restaurant.rating || "4.8"} (500+ Reviews)
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span className="text-sm drop-shadow-md">{restaurant.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                <span className="text-sm drop-shadow-md">{restaurant.deliveryTime || "30"} mins</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* Sidebar (Desktop) / Top Tabs (Mobile) */}
                <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-28 h-fit">
                    
                    {/* Search & Filter */}
                    <div className="space-y-4 surface-card p-6">
                        <h3 className="font-bold text-text-main uppercase tracking-widest text-xs">Search Menu</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input 
                                type="text" 
                                placeholder="Find a dish..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-base !pl-10 !py-2.5 !text-sm"
                            />
                        </div>

                        <div className="pt-4 space-y-2">
                            <h3 className="font-bold text-text-main uppercase tracking-widest text-xs">Dietary</h3>
                            <div className="flex bg-bg-subtle p-1 rounded-xl">
                                {["All", "Veg", "Non-Veg"].map(diet => (
                                    <button 
                                        key={diet}
                                        onClick={() => setDietFilter(diet)}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                            dietFilter === diet ? "bg-bg-card shadow-sm text-text-main" : "text-text-muted"
                                        }`}
                                    >
                                        {diet}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="hidden lg:block surface-card overflow-hidden">
                        <h3 className="font-bold text-text-main uppercase tracking-widest text-xs p-6 border-b border-black/5 dark:border-white/5">Categories</h3>
                        <div className="flex flex-col">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`text-left px-6 py-4 transition-all flex items-center justify-between font-bold text-sm ${
                                        activeCategory === cat 
                                        ? "bg-primary-soft text-primary border-l-4 border-primary" 
                                        : "text-text-muted hover:bg-bg-hover border-l-4 border-transparent"
                                    }`}
                                >
                                    {cat}
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === cat ? "opacity-100" : "opacity-0"}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Horizontal Tabs */}
                    <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-xl font-bold whitespace-nowrap text-sm ${
                                    activeCategory === cat 
                                    ? "bg-primary text-white" 
                                    : "surface-card text-text-muted"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Feed */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-primary rounded-full" />
                        <h2 className="text-2xl font-black text-text-main">{activeCategory === "All" ? "Full Menu" : activeCategory}</h2>
                        <span className="badge badge-dark ml-2">{filteredFoods.length}</span>
                    </div>

                    {filteredFoods.length === 0 ? (
                        <div className="surface-card py-20 text-center">
                            <Search className="w-10 h-10 text-text-faint mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-text-main">No dishes found</h3>
                            <p className="text-text-muted">Try changing your search or dietary filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredFoods.map((food, i) => (
                                <div 
                                    key={food._id}
                                    className="surface-card flex p-4 gap-5 hover-lift cursor-pointer animate-slide-up"
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                    onClick={() => setSelectedFood(food)}
                                >
                                    <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0 border border-black/5 dark:border-white/5 relative">
                                        <img
                                            src={food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                                            className="w-full h-full object-cover"
                                            alt={food.name}
                                        />
                                        {/* Veg/Non-Veg icon */}
                                        <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm p-0.5 rounded">
                                            <div className={`w-3 h-3 border ${food.isVeg !== false ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${food.isVeg !== false ? 'bg-green-600' : 'bg-red-600'}`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-bold text-text-main leading-tight">{food.name}</h4>
                                            <p className="text-text-muted text-xs line-clamp-2">{food.description || "Delightful culinary experience featuring premium ingredients."}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-xl font-black text-text-main">₹{food.price}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddToCart(food);
                                                }}
                                                disabled={adding === food._id}
                                                className="btn-primary !px-4 !py-1.5 !text-[10px] !rounded-lg"
                                            >
                                                {adding === food._id ? <span className="animate-pulse">ADDING...</span> : "ADD +"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 3. ENHANCED FOOD MODAL */}
            {selectedFood && (
                <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center animate-fade-in p-4 sm:p-0">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedFood(null)} />
                    <div className="surface-card w-full sm:max-w-lg overflow-hidden relative animate-slide-up sm:animate-scale-in z-10 max-h-[90vh] flex flex-col">
                        
                        <button 
                            onClick={() => setSelectedFood(null)}
                            className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
                        >
                            <Plus className="w-5 h-5 rotate-45" />
                        </button>

                        <div className="relative h-64 shrink-0">
                            <img
                                src={selectedFood.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                                className="w-full h-full object-cover"
                                alt={selectedFood.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
                        </div>

                        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className={`w-4 h-4 border ${selectedFood.isVeg !== false ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
                                        <div className={`w-2 h-2 rounded-full ${selectedFood.isVeg !== false ? 'bg-green-600' : 'bg-red-600'}`} />
                                    </div>
                                    <span className="badge badge-accent"><Flame className="w-3 h-3"/> Bestseller</span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black text-text-main">{selectedFood.name}</h2>
                                <p className="text-text-muted text-sm leading-relaxed font-medium">
                                    {selectedFood.description || "A symphony of flavors prepared with premium ingredients and authentic culinary techniques. Perfect for your cravings."}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 py-4 border-y border-black/5 dark:border-white/5">
                                <div className="flex-1 text-center border-r border-black/5 dark:border-white/5">
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Energy</p>
                                    <p className="font-black text-text-main">{selectedFood.calories || "320"} kcal</p>
                                </div>
                                <div className="flex-1 text-center">
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Rating</p>
                                    <p className="font-black text-text-main flex items-center justify-center gap-1">
                                        4.5 <Star className="w-3 h-3 text-warning fill-warning" />
                                    </p>
                                </div>
                            </div>
                            
                            {/* Special Instructions */}
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-text-main uppercase tracking-widest">Special Instructions</p>
                                <textarea 
                                    className="input-base !h-20 !text-sm resize-none" 
                                    placeholder="E.g. less spicy, extra cheese..."
                                />
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 bg-bg-subtle border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-4 shrink-0">
                            <div className="flex items-center bg-bg-card rounded-xl border border-black/5 dark:border-white/5 shadow-sm p-1">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleQuantity(selectedFood._id, -1); }}
                                    className="w-10 h-10 hover:bg-bg-hover rounded-lg text-text-main flex items-center justify-center transition-colors disabled:opacity-30"
                                    disabled={(quantities[selectedFood._id] || 1) <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-black text-lg">{quantities[selectedFood._id] || 1}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleQuantity(selectedFood._id, 1); }}
                                    className="w-10 h-10 hover:bg-bg-hover rounded-lg text-text-main flex items-center justify-center transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <button
                                onClick={() => handleAddToCart(selectedFood)}
                                disabled={adding === selectedFood._id || selectedFood.isAvailable === false}
                                className="btn-primary flex-1 !py-3.5 !text-base flex justify-between items-center"
                            >
                                <span>{adding === selectedFood._id ? "Adding..." : "Add to Cart"}</span>
                                <span>₹{selectedFood.price * (quantities[selectedFood._id] || 1)}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}