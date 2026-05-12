import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { 
    MapPin, Star, Clock, Search, UtensilsCrossed, ArrowRight,
    TrendingUp, Tag, Heart, ChevronRight, ShieldCheck, Zap
} from "lucide-react";
import SkeletonCard from "../components/SkeletonCard";

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const res = await API.get("/restaurants");
            setRestaurants(res.data);
        } catch (err) {
            console.error("Failed to fetch restaurants:", err);
        } finally {
            // Add a small artificial delay to show off the skeleton loading state
            setTimeout(() => setLoading(false), 800);
        }
    };

    const categories = [
        { name: "All", icon: "🍽️" },
        { name: "Pizza", icon: "🍕" },
        { name: "Burgers", icon: "🍔" },
        { name: "Sushi", icon: "🍣" },
        { name: "Healthy", icon: "🥗" },
        { name: "Desserts", icon: "🍦" }
    ];

    const filteredRestaurants = (Array.isArray(restaurants) ? restaurants : []).filter(r => {
        if (!r) return false;
        const search = searchTerm ? String(searchTerm).toLowerCase() : "";
        const nameMatch = r.name ? String(r.name).toLowerCase().includes(search) : false;
        const descMatch = r.description ? String(r.description).toLowerCase().includes(search) : false;
        const matchesSearch = search === "" || nameMatch || descMatch;
        const matchesCategory = activeCategory === "All" || (r.cuisine && String(r.cuisine).includes(activeCategory));
        return matchesSearch && matchesCategory;
    });

    const scrollToRestaurants = () => {
        document.getElementById("restaurants-section")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="space-y-24 animate-fade-in pb-24">
            
            {/* 1. HERO SECTION */}
            <section className="relative pt-20 md:pt-32 pb-12 overflow-hidden bg-gradient-hero">
                <div className="container-app relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-fade-in-left delay-100">
                        <div className="badge badge-primary">
                            <Zap className="w-3.5 h-3.5" /> 
                            Fastest Delivery in City
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black text-text-main leading-[1.1] tracking-tight">
                            Craving Something <br/>
                            <span className="gradient-text italic">Delicious?</span>
                        </h1>
                        
                        <p className="text-text-muted text-lg max-w-lg leading-relaxed font-medium">
                            Experience the future of food delivery with DeliverX. 
                            Curated meals from premium restaurants, delivered with precision.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 pt-2">
                            <button onClick={scrollToRestaurants} className="btn-primary">
                                Order Now <ArrowRight className="w-4 h-4" />
                            </button>
                            <Link to="/service" className="btn-outline">
                                How it works
                            </Link>
                        </div>
                        
                        <div className="pt-6 flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-bg-main" />
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-warning text-warning" />
                                    <span className="font-bold">4.9/5</span>
                                </div>
                                <span className="text-xs text-text-muted font-bold tracking-wider uppercase">from 2k+ reviews</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative hidden lg:flex justify-center items-center animate-fade-in-right delay-200">
                        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                        <div className="relative z-10 hover-lift">
                            <img 
                                src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800" 
                                className="w-full max-w-[400px] rounded-[2rem] shadow-2xl border-4 border-white/10"
                                alt="Premium Food"
                            />
                            {/* Floating Badges */}
                            <div className="absolute -left-6 top-12 glass-card p-4 flex items-center gap-3 animate-float delay-100">
                                <div className="bg-success/20 p-2 rounded-full text-success"><Clock className="w-5 h-5"/></div>
                                <div>
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Delivery</p>
                                    <p className="font-bold">25 Min</p>
                                </div>
                            </div>
                            <div className="absolute -right-8 bottom-12 glass-card p-4 flex items-center gap-3 animate-float delay-300">
                                <div className="bg-warning/20 p-2 rounded-full text-warning"><Star className="w-5 h-5 fill-warning"/></div>
                                <div>
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Top Rated</p>
                                    <p className="font-bold">4.9 Star</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. STATS BANNER */}
            <section className="container-app">
                <div className="glass-card grid grid-cols-2 md:grid-cols-4 divide-x divide-black/5 dark:divide-white/5 py-8">
                    {[
                        { num: "50K+", label: "Happy Customers" },
                        { num: "200+", label: "Top Restaurants" },
                        { num: "99%", label: "On-Time Delivery" },
                        { num: "4.9★", label: "App Rating" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center space-y-1">
                            <h3 className="text-3xl font-black gradient-text">{stat.num}</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. TRENDING BANNER */}
            <section className="bg-primary overflow-hidden py-4 whitespace-nowrap flex shadow-primary relative">
                <div className="animate-marquee flex gap-12 items-center">
                    {[1,2,3].map(loop => (
                        <React.Fragment key={loop}>
                            <span className="text-white/90 font-black text-xl tracking-widest uppercase flex items-center gap-4">
                                <TrendingUp className="w-6 h-6" /> FLAT 50% OFF ON FIRST ORDER
                            </span>
                            <span className="text-white/50">✦</span>
                            <span className="text-white/90 font-black text-xl tracking-widest uppercase flex items-center gap-4">
                                <Tag className="w-6 h-6" /> FREE DELIVERY ABOVE ₹299
                            </span>
                            <span className="text-white/50">✦</span>
                        </React.Fragment>
                    ))}
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section className="container-app space-y-12">
                <div className="text-center space-y-4">
                    <span className="section-tag">Process</span>
                    <h2 className="text-3xl md:text-5xl font-black text-text-main">How It <span className="text-primary italic">Works</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: UtensilsCrossed, title: "Choose Order", desc: "Browse through our extensive list of premium restaurants and dishes." },
                        { icon: ShieldCheck, title: "Secure Payment", desc: "Pay quickly and securely using multiple options including COD and UPI." },
                        { icon: Clock, title: "Fast Delivery", desc: "Get your food delivered hot and fresh within 30 minutes." }
                    ].map((step, i) => (
                        <div key={i} className="surface-card p-8 text-center group hover-lift space-y-4">
                            <div className="w-16 h-16 bg-primary-soft text-primary rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold">{step.title}</h3>
                            <p className="text-text-muted text-sm">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. RESTAURANTS SECTION */}
            <section id="restaurants-section" className="container-app space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <span className="section-tag">Explore</span>
                        <h2 className="text-3xl md:text-5xl font-black text-text-main">Top <span className="text-primary italic">Restaurants</span></h2>
                    </div>
                    <div className="relative w-full md:w-[350px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Search restaurants..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-base !pl-12"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                    {categories.map(cat => (
                        <button 
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`px-6 py-3 rounded-xl whitespace-nowrap font-bold transition-all flex items-center gap-2 ${
                                activeCategory === cat.name 
                                ? "bg-primary text-white shadow-primary" 
                                : "surface-card text-text-muted hover:text-text-main"
                            }`}
                        >
                            <span>{cat.icon}</span> {cat.name}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    ) : filteredRestaurants.length === 0 ? (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-primary-soft text-primary rounded-full flex items-center justify-center mx-auto">
                                <Search className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold">No restaurants found</h3>
                            <p className="text-text-muted">Try adjusting your search or category filter.</p>
                        </div>
                    ) : (
                        filteredRestaurants.map((r, i) => (
                            <Link 
                                to={`/restaurant/${r._id}`} 
                                key={r._id} 
                                className="surface-card group hover-lift overflow-hidden animate-slide-up"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img 
                                        src={r.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        alt={r.name} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    
                                    {/* Badges overlay */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {(r.rating || 4.5) > 4.7 && <span className="badge badge-warning bg-white shadow-sm"><Star className="w-3 h-3 fill-warning"/> Top Pick</span>}
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <button className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-accent transition-colors">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                                        <div>
                                            <p className="font-bold text-sm tracking-wider uppercase drop-shadow-md">{r.cuisine || "Multi-Cuisine"}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors truncate">{r.name}</h3>
                                        <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded text-xs font-bold shrink-0">
                                            <Star className="w-3 h-3 fill-success" />
                                            {r.rating || "4.5"}
                                        </div>
                                    </div>
                                    
                                    <p className="text-text-muted text-sm line-clamp-2 font-medium">{r.description}</p>
                                    
                                    <div className="divider" />
                                    
                                    <div className="flex justify-between text-xs text-text-muted font-bold">
                                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {r.deliveryTime || "30"} mins</span>
                                        <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-primary" /> Min ₹{r.minOrder || "150"}</span>
                                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> 2.5 km</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>

        </div>
    );
}