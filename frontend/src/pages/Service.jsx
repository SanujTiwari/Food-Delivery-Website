import { Rocket, ShieldCheck, Clock, UtensilsCrossed, Zap, Star, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Service() {
    const features = [
        {
            icon: Rocket,
            title: "Lightning Fast Delivery",
            desc: "Experience our proprietary routing algorithm that ensures your food arrives hot within 30 minutes, every single time."
        },
        {
            icon: ShieldCheck,
            title: "100% Secure Payments",
            desc: "Bank-grade encryption for all your transactions. Pay seamlessly via UPI, Credit/Debit cards, or choose Cash on Delivery."
        },
        {
            icon: UtensilsCrossed,
            title: "Premium Restaurant Curation",
            desc: "We partner exclusively with top-rated restaurants, ensuring every meal meets our rigorous quality and hygiene standards."
        },
        {
            icon: Clock,
            title: "24/7 Priority Support",
            desc: "Our dedicated customer success team is always online to assist you with any queries or order modifications."
        }
    ];

    const plans = [
        {
            name: "Basic",
            price: "Free",
            desc: "Perfect for occasional cravings",
            features: [
                "Access to all restaurants",
                "Standard delivery times",
                "Standard support",
                "Pay per delivery"
            ],
            buttonText: "Start Ordering",
            isPopular: false
        },
        {
            name: "DeliverX Pro",
            price: "₹149",
            period: "/month",
            desc: "For the true food enthusiasts",
            features: [
                "Zero delivery fees",
                "Priority 20-min delivery",
                "Exclusive Pro-only menus",
                "24/7 dedicated support line",
                "2x Loyalty Points"
            ],
            buttonText: "Upgrade to Pro",
            isPopular: true
        }
    ];

    return (
        <div className="container-app pt-24 pb-24 space-y-24 animate-fade-in">
            
            {/* HERO */}
            <div className="text-center space-y-6 max-w-3xl mx-auto">
                <span className="section-tag mx-auto">Why Choose Us</span>
                <h1 className="text-4xl md:text-6xl font-black text-text-main tracking-tight leading-[1.1]">
                    Redefining <span className="text-primary italic">Food Delivery</span>
                </h1>
                <p className="text-text-muted text-lg font-medium leading-relaxed">
                    We don't just deliver food; we deliver culinary experiences. Discover how DeliverX is changing the game with technology, speed, and uncompromising quality.
                </p>
            </div>

            {/* FEATURES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, i) => (
                    <div key={i} className="surface-card p-8 sm:p-10 hover-lift group animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="w-16 h-16 bg-primary-soft text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <feature.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-text-main mb-3">{feature.title}</h3>
                        <p className="text-text-muted leading-relaxed font-medium">{feature.desc}</p>
                    </div>
                ))}
            </div>

            {/* STATS BANNER */}
            <div className="glass-card bg-primary text-white rounded-[2rem] p-12 overflow-hidden relative shadow-primary">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
                    <div className="space-y-2 py-4">
                        <div className="flex justify-center mb-2"><Zap className="w-8 h-8 text-warning" /></div>
                        <h4 className="text-4xl font-black">22 Min</h4>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Average Delivery</p>
                    </div>
                    <div className="space-y-2 py-4">
                        <div className="flex justify-center mb-2"><Star className="w-8 h-8 text-warning" /></div>
                        <h4 className="text-4xl font-black">4.9/5</h4>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Customer Rating</p>
                    </div>
                    <div className="space-y-2 py-4">
                        <div className="flex justify-center mb-2"><ShieldCheck className="w-8 h-8 text-success" /></div>
                        <h4 className="text-4xl font-black">100%</h4>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Quality Guarantee</p>
                    </div>
                </div>
            </div>

            {/* PRICING */}
            <div className="space-y-12 max-w-5xl mx-auto">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black text-text-main">Pricing & Plans</h2>
                    <p className="text-text-muted">Choose the plan that fits your appetite.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {plans.map((plan, i) => (
                        <div key={i} className={`surface-card p-8 sm:p-10 relative overflow-hidden transition-all ${plan.isPopular ? 'border-primary ring-4 ring-primary-soft shadow-primary scale-105 z-10' : ''}`}>
                            {plan.isPopular && (
                                <div className="absolute top-6 right-6">
                                    <span className="badge badge-accent shadow-sm">Most Popular</span>
                                </div>
                            )}
                            
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black text-text-main">{plan.name}</h3>
                                    <p className="text-text-muted text-sm font-medium mt-1">{plan.desc}</p>
                                </div>
                                
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-text-main">{plan.price}</span>
                                    {plan.period && <span className="text-text-muted font-bold">{plan.period}</span>}
                                </div>

                                <div className="divider" />

                                <ul className="space-y-4">
                                    {plan.features.map((feat, j) => (
                                        <li key={j} className="flex items-center gap-3 text-text-main font-medium text-sm">
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <Link to={plan.isPopular ? "/register" : "/"} className={`block w-full text-center py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors ${
                                    plan.isPopular ? "bg-primary text-white shadow-primary hover:bg-primary-hover" : "bg-bg-subtle text-text-main hover:bg-black/5 dark:hover:bg-white/5"
                                }`}>
                                    {plan.buttonText}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
