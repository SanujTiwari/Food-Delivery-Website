import { useState, useContext, useEffect } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, AlertCircle, Eye, EyeOff, UtensilsCrossed, Phone, CheckCircle2 } from "lucide-react";

export default function Register({ showToast }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Password strength evaluator
    useEffect(() => {
        let strength = 0;
        if (password.length > 5) strength += 1;
        if (password.length > 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        setPasswordStrength(strength);
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (passwordStrength < 3) {
            setError("Please use a stronger password.");
            return;
        }

        setLoading(true);
        try {
            const res = await API.post("/auth/register", { name, email, password, phone });
            login(res.data.token);
            if(showToast) showToast("Account created successfully!", "success");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.msg || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 2) return "bg-red-500";
        if (passwordStrength === 3) return "bg-warning";
        return "bg-success";
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 animate-fade-in pt-24 bg-bg-main">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-bg-card rounded-[2rem] overflow-hidden shadow-2xl border border-black/5 dark:border-white/5">

                {/* Left Side: Auth Form */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center text-left relative order-2 lg:order-1">
                    <div className="max-w-md mx-auto w-full space-y-8">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-primary-soft text-primary rounded-xl flex items-center justify-center mb-6 lg:hidden">
                                <UtensilsCrossed className="w-6 h-6" />
                            </div>
                            <h2 className="text-4xl font-black text-text-main tracking-tight uppercase">
                                Create <span className="text-primary italic">Account</span>
                            </h2>
                            <p className="text-text-muted font-medium text-sm">Join us to start ordering premium food.</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm animate-shake font-bold">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase pl-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-base !pl-12 !py-3"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase pl-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-base !pl-12 !py-3"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase pl-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="input-base !pl-12 !py-3"
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase pl-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-base !pl-12 !pr-12 !py-3"
                                        placeholder="••••••••"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {/* Password Strength Meter */}
                                {password && (
                                    <div className="pt-2 animate-fade-in space-y-1">
                                        <div className="flex gap-1 h-1.5 w-full">
                                            <div className={`flex-1 rounded-full ${passwordStrength >= 1 ? getStrengthColor() : 'bg-bg-subtle'}`} />
                                            <div className={`flex-1 rounded-full ${passwordStrength >= 2 ? getStrengthColor() : 'bg-bg-subtle'}`} />
                                            <div className={`flex-1 rounded-full ${passwordStrength >= 3 ? getStrengthColor() : 'bg-bg-subtle'}`} />
                                            <div className={`flex-1 rounded-full ${passwordStrength >= 4 ? getStrengthColor() : 'bg-bg-subtle'}`} />
                                            <div className={`flex-1 rounded-full ${passwordStrength >= 5 ? getStrengthColor() : 'bg-bg-subtle'}`} />
                                        </div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-right text-text-muted">
                                            {passwordStrength <= 2 ? "Weak" : passwordStrength === 3 ? "Good" : "Strong"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <label className="flex items-start gap-3 cursor-pointer py-2">
                                <input type="checkbox" required className="mt-1 w-4 h-4 accent-primary" />
                                <span className="text-xs text-text-muted font-medium">
                                    I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary !py-4 shadow-primary"
                            >
                                {loading ? "Creating Account..." : "Sign Up Securely"}
                            </button>
                        </form>

                        <p className="text-center text-text-muted font-medium text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>

                {/* Right Side: Marketing illustration */}
                <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-accent/10 relative overflow-hidden text-center order-1 lg:order-2">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.15)_0%,transparent_70%)]" />
                    <div className="relative z-10 space-y-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent/20 blur-[50px] rounded-full" />
                            <img
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800"
                                className="w-80 h-80 object-cover rounded-[2rem] shadow-2xl border-4 border-white/20 relative z-10 hover-lift"
                                alt="Delicious food"
                            />
                            {/* Floating elements */}
                            <div className="absolute -left-8 top-12 glass-card p-3 animate-float flex items-center gap-2 z-20">
                                <div className="bg-success/20 text-success p-1.5 rounded-full"><CheckCircle2 className="w-4 h-4" /></div>
                                <span className="text-xs font-bold">Verified</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl font-black text-accent drop-shadow-sm font-[Outfit]">Premium Delivery.</h2>
                            <p className="text-text-main font-medium max-w-xs mx-auto">Get access to exclusive restaurants and fastest delivery speeds.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}