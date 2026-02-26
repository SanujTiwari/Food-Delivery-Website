import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { MapPin, Star, Clock, Search, UtensilsCrossed } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const res = await API.get("/restaurants");
            setRestaurants(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const scrollToRestaurants = () => {
        document.getElementById("restaurants-section")?.scrollIntoView({ behavior: "smooth" });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-20 animate-fade-in pb-24">
            
            {/* Hero Section */}
            <div className="relative min-h-[480px] flex items-center">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                    {/* Text */}
                    <div className="space-y-8 relative z-20">
                        <div className="inline-flex items-center gap-2 bg-black/5 border border-black/5 px-4 py-2 rounded-full">
                            <span className="text-primary text-xs font-black uppercase tracking-widest">Fastest Delivery</span>
                            <div className="w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center">
                                <Clock className="w-3 h-3 text-primary" />
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-text-main leading-tight tracking-tight">
                            Elevate Your <br />
                            <span className="text-primary italic">Dining</span> Experience
                        </h1>

                        <p className="text-text-muted text-lg max-w-lg leading-relaxed font-medium">
                            Experience the future of food delivery with DeliverX.
                            Curated meals from premium restaurants, delivered with precision.
                        </p>

                        <button onClick={scrollToRestaurants} className="btn-primary !rounded-full">
                            Order Now
                        </button>

                        <div className="pt-6 flex items-center gap-4 border-t border-black/5 w-fit">
                            <div>
                                <div className="flex items-center gap-1 text-primary">
                                    <Star className="w-4 h-4 fill-primary" />
                                    <span className="text-text-main font-black">4.9/5</span>
                                </div>
                                <p className="text-text-muted text-xs font-bold uppercase tracking-wider">
                                    Customer Reviews
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Smaller Hero Image */}
                    <div className="relative h-full flex items-center justify-center group lg:block hidden">
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[320px] h-[320px] bg-primary/10 rounded-full blur-[90px]" />

                        <div className="relative z-10 transition-transform duration-500 group-hover:scale-105">
                            <img
                                src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800"
                                className="w-full max-w-[240px] md:max-w-[260px] mx-auto h-auto drop-shadow-xl rounded-2xl"
                                alt="Food"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Why Choose Us */}
            <div id="why-choose-us" className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-10 space-y-6 hover:border-primary/30 transition-all group !bg-white">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Clock className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black text-text-main">Lightning Fast</h3>
                    <p className="text-text-muted text-sm font-medium">
                        Delicious meals delivered quickly while keeping freshness intact.
                    </p>
                </div>

                <div className="glass-card p-10 space-y-6 hover:border-primary/30 transition-all group !bg-white">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Star className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black text-text-main">Elite Quality</h3>
                    <p className="text-text-muted text-sm font-medium">
                        Only top-rated restaurants to ensure premium taste and quality.
                    </p>
                </div>

                <div className="glass-card p-10 space-y-6 hover:border-primary/30 transition-all group !bg-white">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <MapPin className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black text-text-main">Hot & Fresh Delivery</h3>
                    <p className="text-text-muted text-sm font-medium">
                        Your food arrives hot, fresh, and ready to enjoy every time.
                    </p>
                </div>
            </div>

            {/* Restaurants */}
            <div id="restaurants-section" className="max-w-7xl mx-auto px-4 space-y-12">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <h2 className="text-4xl font-black text-text-main flex items-center gap-4">
                            <UtensilsCrossed className="text-primary w-10 h-10" />
                            Explore Restaurants
                        </h2>
                        <p className="text-text-muted text-lg uppercase tracking-widest opacity-60">
                            Discover the best food near you
                        </p>
                    </div>

                    <div className="relative w-full md:w-[400px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search restaurants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border-2 border-black/5 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-all"
                        />
                    </div>
                </div>

                {filteredRestaurants.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-text-muted text-lg">No restaurants found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredRestaurants.map((r) => (
                            <Link to={`/restaurant/${r._id}`} key={r._id} className="glass-card !bg-white overflow-hidden hover:-translate-y-2 transition-all">

                                <img
                                    src={r.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"}
                                    className="w-full h-56 object-cover"
                                    alt={r.name}
                                />

                                <div className="p-6 space-y-3">
                                    <h3 className="text-lg font-bold">{r.name}</h3>
                                    <p className="text-sm text-text-muted line-clamp-2">{r.description}</p>

                                    <div className="flex justify-between text-xs text-text-muted pt-4">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            {r.address}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4 text-primary" />
                                            30 min
                                        </span>
                                    </div>
                                </div>

                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}