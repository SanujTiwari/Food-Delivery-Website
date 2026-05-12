import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, AlertCircle, Eye, EyeOff, UtensilsCrossed } from "lucide-react";

export default function Login({ showToast }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await API.post("/auth/login", { email, password });
            login(res.data.token);
            if(showToast) showToast("Welcome back!", "success");
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 animate-fade-in pt-24 bg-bg-main">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-bg-card rounded-[2rem] overflow-hidden shadow-2xl border border-black/5 dark:border-white/5">

                {/* Left Side: Marketing illustration */}
                <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-primary-soft relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)]" />
                    <div className="relative z-10 space-y-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full" />
                            <img
                                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800"
                                className="w-80 h-80 object-cover rounded-[2rem] shadow-2xl border-4 border-white/20 relative z-10 hover-lift"
                                alt="Welcome"
                            />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl font-black text-primary drop-shadow-sm font-[Outfit]">Deliciousness awaits.</h2>
                            <p className="text-text-main font-medium">Join the DeliverX community today.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center text-left relative">
                    <div className="max-w-md mx-auto w-full space-y-10">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-primary-soft text-primary rounded-xl flex items-center justify-center mb-6 lg:hidden">
                                <UtensilsCrossed className="w-6 h-6" />
                            </div>
                            <h2 className="text-4xl font-black text-text-main tracking-tight uppercase">
                                Welcome <span className="text-primary italic">Back</span>
                            </h2>
                            <p className="text-text-muted font-medium text-sm">Enter your details below to access your account.</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm animate-shake font-bold">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase pl-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-base !pl-12 !py-3.5"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase">Password</label>
                                    <a href="#" className="text-[10px] text-primary font-bold hover:underline uppercase tracking-widest">Forgot?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-base !pl-12 !pr-12 !py-3.5"
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
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary !py-4 shadow-primary"
                            >
                                {loading ? "Authenticating..." : "Login"}
                            </button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/10 dark:border-white/10"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-bg-card text-text-muted font-medium text-xs">Or continue with</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="btn-outline !py-3 !text-xs gap-2 border-black/10 dark:border-white/10 hover:border-primary">
                                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                Google
                            </button>
                            <button type="button" className="btn-outline !py-3 !text-xs gap-2 border-black/10 dark:border-white/10 hover:border-primary">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                Facebook
                            </button>
                        </div>

                        <p className="text-center text-text-muted font-medium text-sm">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}