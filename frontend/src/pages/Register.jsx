import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus, AlertCircle, ChevronDown } from "lucide-react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await API.post("/auth/register", { name, email, password, role });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.msg || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 animate-fade-in pt-24">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] overflow-hidden shadow-2xl border border-black/5">

                {/* Left: Illustration Side */}
                <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]" />

                    <div className="relative z-10 space-y-8 text-center animate-slide-up">
                        <img
                            src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800"
                            className="w-[400px] h-[400px] object-cover rounded-3xl shadow-2xl border-4 border-primary/10"
                            alt="Cooking Illustration"
                        />
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-text-main">Join the Elite.</h2>
                            <p className="text-text-muted">Start your gastronomic journey with DeliverX.</p>
                        </div>
                    </div>
                </div>

                {/* Right: Form Side */}
                <div className="p-8 md:p-16 flex flex-col justify-center bg-white">
                    <div className="max-w-md mx-auto w-full space-y-8">
                        <div className="space-y-4 text-center lg:text-left">
                            <h2 className="text-4xl font-black text-text-main tracking-tight uppercase italic">Create Account</h2>
                            <p className="text-text-muted font-medium">Fill your information below or register with your account.</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm animate-shake font-bold">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted tracking-widest uppercase pl-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-all" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-100/80 border border-black/10 rounded-2xl py-4 pl-14 pr-4 text-text-main placeholder:text-text-muted/40 focus:outline-none focus:border-primary transition-all font-medium shadow-sm"
                                        placeholder="Enter Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted tracking-widest uppercase pl-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-all" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-gray-100/80 border border-black/10 rounded-2xl py-4 pl-14 pr-4 text-text-main placeholder:text-text-muted/40 focus:outline-none focus:border-primary transition-all font-medium shadow-sm"
                                        placeholder="Enter Email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted tracking-widest uppercase pl-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-all" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-gray-100/80 border border-black/10 rounded-2xl py-4 pl-14 pr-4 text-text-main placeholder:text-text-muted/40 focus:outline-none focus:border-primary transition-all font-medium shadow-sm"
                                        placeholder="Enter Password"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted tracking-widest uppercase pl-1">Sign up as</label>
                                <div className="relative group">
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full bg-gray-100/80 border border-black/10 rounded-2xl py-4 px-6 text-text-main focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer font-bold relative z-10 shadow-sm"
                                    >
                                        <option value="user" className="bg-white text-text-main uppercase text-xs font-bold">Customer</option>
                                        <option value="admin" className="bg-white text-text-main uppercase text-xs font-bold">Restaurant Admin</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary group-hover:scale-110 transition-transform">
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary !py-5 shadow-2xl shadow-primary/20 uppercase tracking-widest"
                            >
                                {loading ? "Creating Account..." : "Register"}
                            </button>
                        </form>

                        <p className="text-center text-text-muted font-medium">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}