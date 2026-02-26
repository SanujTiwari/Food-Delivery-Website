import { ShieldCheck, Truck, Utensils, Award, Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Service() {
    const services = [
        {
            icon: <Truck className="w-10 h-10 text-primary" />,
            title: "Lightning Fast Delivery",
            desc: "Hot and fresh meals at your doorstep in under 30 minutes, every single time."
        },
        {
            icon: <ShieldCheck className="w-10 h-10 text-primary" />,
            title: "Elite Quality Control",
            desc: "We partner only with top-rated restaurants that pass our rigorous 50-point hygiene check."
        },
        {
            icon: <Award className="w-10 h-10 text-primary" />,
            title: "Curated Excellence",
            desc: "Discover hand-picked menus from the city's finest chefs, exclusively on QuickBite."
        },
        {
            icon: <Zap className="w-10 h-10 text-primary" />,
            title: "Live Tracking",
            desc: "Watch your meal travel from the kitchen to your table with real-time GPS precision."
        },
        {
            icon: <Utensils className="w-10 h-10 text-primary" />,
            title: "Zero Plastic Initiative",
            desc: "Committed to the planet—all our deliveries use 100% biodegradable and eco-friendly packaging."
        },
        {
            icon: <Heart className="w-10 h-10 text-primary" />,
            title: "Personalized Menus",
            desc: "An AI-powered engine that learns your taste to suggest meals you'll actually love."
        }
    ];

    return (
        <div className="space-y-20 animate-fade-in pb-24 px-4 md:px-0">
            <div className="max-w-4xl mx-auto text-center space-y-6">
                <span className="text-primary font-black uppercase tracking-[0.3em] text-sm">Experience the Elite</span>
                <h1 className="text-5xl md:text-8xl font-black text-text-main tracking-tighter leading-none">
                    Redefining <br /> <span className="gradient-text">The Art of Dining</span>
                </h1>
                <p className="text-text-muted text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                    At QuickBite, we don't just deliver food; we craft experiences. From the moment you browse to the first bite, excellence is our only standard.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((s, i) => (
                    <div key={i} className="glass-card !bg-white p-10 space-y-6 hover:border-primary/20 transition-all group hover:-translate-y-2 duration-500 shadow-xl">
                        <div className="bg-black/5 w-20 h-20 rounded-[30px] flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all border border-black/5">
                            {s.icon}
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-text-main group-hover:text-primary transition-colors">{s.title}</h3>
                            <p className="text-text-muted font-medium leading-relaxed opacity-70">{s.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="max-w-5xl mx-auto overflow-hidden relative rounded-[50px] bg-primary/5 p-16 text-center space-y-10 border border-primary/10 shadow-[0_0_100px_rgba(99,102,241,0.05)]">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-transparent opacity-30" />
                <h2 className="text-4xl md:text-6xl font-black text-text-main relative z-10">Ready to taste the future?</h2>
                <Link to="/" className="inline-block btn-primary px-16 py-6 text-2xl relative z-10 hover:shadow-[0_0_40px_rgba(255,184,0,0.3)]">
                    Explore The Menu
                </Link>
            </div>
        </div >
    );
}
