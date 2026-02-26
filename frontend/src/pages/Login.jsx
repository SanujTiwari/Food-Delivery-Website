import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await API.post("/auth/login", { email, password });
            login(res.data.token);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 animate-fade-in pt-24">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] overflow-hidden shadow-2xl border border-black/5">
                {/* Left: Illustration Side */}
                <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-primary/5 relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]" />

                    <div className="relative z-10 space-y-8">
                        <img
                            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800"
                            className="w-[400px] h-[400px] object-cover rounded-3xl shadow-2xl border-4 border-primary/10"
                            alt="Chef Illustration"
                        />
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-text-main">Deliciousness awaits.</h2>
                            <p className="text-text-muted">Join the DeliverX community today.</p>
                        </div>
                    </div>
                </div>

                {/* Right: Form Side */}
                <div className="p-8 md:p-16 flex flex-col justify-center bg-white text-left">
                    <div className="max-w-md mx-auto w-full space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-text-main tracking-tight uppercase italic">Login</h2>
                            <p className="text-text-muted font-medium">Enter your details below to access your account.</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm animate-shake font-bold">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-text-muted tracking-widest uppercase pl-1">Email Address</label>
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

                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-bold text-text-muted tracking-widest uppercase">Password</label>
                                    <a href="#" className="text-xs text-primary font-bold hover:underline">Forgot?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-all" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-gray-100/80 border border-black/10 rounded-2xl py-4 pl-14 pr-4 text-text-main placeholder:text-text-muted/40 focus:outline-none focus:border-primary transition-all font-medium shadow-sm"
                                        placeholder="Enter Password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary !py-5 shadow-2xl shadow-primary/20"
                            >
                                {loading ? "Authenticating..." : "Login"}
                            </button>
                        </form>

                        <p className="text-center text-text-muted font-medium">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}