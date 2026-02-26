import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook } from "lucide-react";

export default function Contact() {
    return (
        <div className="max-w-7xl mx-auto space-y-20 animate-fade-in pb-24 px-4 md:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                {/* Left Side: Contact Info */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-12">
                    <div className="space-y-6">
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-sm">Get in Touch</span>
                        <h1 className="text-6xl md:text-8xl font-black text-text-main tracking-tighter leading-none">
                            Let's Talk <br /> <span className="gradient-text">Flavors</span>
                        </h1>
                        <p className="text-text-muted text-lg font-medium leading-relaxed max-w-md">
                            Have a question about our elite kitchen partners or your delivery? Our team of food connoisseurs is here to help you 24/7.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-6 group">
                            <div className="bg-black/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-black/5 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40">Email Us</p>
                                <p className="text-xl font-black text-text-main">Sanujvirat@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group">
                            <div className="bg-black/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-black/5 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                                <Phone className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40">Call Us</p>
                                <p className="text-xl font-black text-text-main">+91 7366891704</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group">
                            <div className="bg-black/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-black/5 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-40">Main Office</p>
                                <p className="text-xl font-black text-text-main">Last Gali Nanak Nagri , Punjab - India</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-8 border-t border-black/5">
                        <Facebook className="w-6 h-6 text-text-muted/40 hover:text-primary cursor-pointer transition-colors" />
                        <Twitter className="w-6 h-6 text-text-muted/40 hover:text-primary cursor-pointer transition-colors" />
                        <Instagram className="w-6 h-6 text-text-muted/40 hover:text-primary cursor-pointer transition-colors" />
                    </div>
                </div>

                {/* Right Side: Contact Form */}
                <div className="lg:col-span-12 xl:col-span-7">
                    <div className="glass-card !bg-white p-12 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-32 translate-x-32" />

                        <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1 opacity-70 ml-1">Your Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Wick"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-text-main focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/40 font-bold shadow-sm"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1 opacity-70 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-text-main focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/40 font-bold shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1 opacity-70 ml-1">Subject</label>
                                <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-text-main focus:outline-none focus:border-primary/50 transition-all font-bold appearance-none cursor-pointer">
                                    <option className="bg-white">General Inquiry</option>
                                    <option className="bg-white">Delivery Feedback</option>
                                    <option className="bg-white">Partner with us</option>
                                    <option className="bg-white">Technical Support</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1 opacity-70 ml-1">Message</label>
                                <textarea
                                    rows="5"
                                    placeholder="Tell us everything..."
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-text-main focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/40 font-bold resize-none"
                                ></textarea>
                            </div>

                            <button className="w-full btn-primary py-6 text-2xl font-black tracking-widest flex items-center justify-center gap-4 hover:shadow-[0_0_50px_rgba(255,184,0,0.15)] group/btn">
                                <span>SEND MESSAGE</span>
                                <Send className="w-7 h-7 group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
