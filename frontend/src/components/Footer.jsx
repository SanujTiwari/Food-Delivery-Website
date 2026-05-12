import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-bg-card border-t border-black/5 pt-20 pb-8 mt-24">
            <div className="container-app grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                
                {/* Brand & Newsletter */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-3xl font-black font-[Outfit]">
                        Deliver<span className="text-primary">X</span>
                    </h3>
                    <p className="text-text-muted leading-relaxed max-w-sm font-medium">
                        Elevating your dining experience. The fastest, most reliable way to get premium meals delivered to your door.
                    </p>
                    
                    <div className="space-y-3 pt-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-text-main">Subscribe to newsletter</p>
                        <div className="flex gap-2 max-w-sm">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="input-base !py-2.5 !text-sm flex-1"
                            />
                            <button className="bg-primary hover:bg-primary-hover text-white px-4 rounded-xl transition-colors shadow-sm">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Explore */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-text-main">Explore</h4>
                    <ul className="space-y-4">
                        <li><Link to="/" className="text-text-muted hover:text-primary transition-colors font-medium">Top Restaurants</Link></li>
                        <li><Link to="/service" className="text-text-muted hover:text-primary transition-colors font-medium">Our Services</Link></li>
                        <li><Link to="/about" className="text-text-muted hover:text-primary transition-colors font-medium">About Us</Link></li>
                        <li><Link to="/blog" className="text-text-muted hover:text-primary transition-colors font-medium">Blog & News</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-text-main">Legal</h4>
                    <ul className="space-y-4">
                        <li><Link to="/contact" className="text-text-muted hover:text-primary transition-colors font-medium">Terms of Service</Link></li>
                        <li><Link to="/contact" className="text-text-muted hover:text-primary transition-colors font-medium">Privacy Policy</Link></li>
                        <li><Link to="/contact" className="text-text-muted hover:text-primary transition-colors font-medium">Cookie Policy</Link></li>
                        <li><Link to="/contact" className="text-text-muted hover:text-primary transition-colors font-medium">Help Center</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="space-y-6">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-text-main">Contact</h4>
                    <ul className="space-y-4 text-text-muted font-medium">
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span>123 Foodie Blvd, Culinary District, CA 90210</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-primary shrink-0" />
                            <span>+1 (800) 123-4567</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-primary shrink-0" />
                            <span>hello@deliverx.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="container-app mt-16 pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-text-muted font-medium">
                    &copy; {new Date().getFullYear()} DeliverX Inc. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    <a href="#" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-primary hover:border-primary transition-all">
                        <Facebook className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-primary hover:border-primary transition-all">
                        <Twitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-primary hover:border-primary transition-all">
                        <Instagram className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
