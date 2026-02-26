import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-bg-card border-t border-black/5 pt-16 pb-8 px-6 md:px-12 mt-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold gradient-text">DeliverX</h3>
                    <p className="text-text-muted leading-relaxed">
                        The fastest and easiest way to order your favorite food from top-rated restaurants near you.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 glass-card hover:bg-primary transition-colors inline-block">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 glass-card hover:bg-primary transition-colors inline-block">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 glass-card hover:bg-primary transition-colors inline-block">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-text-main mb-6">Quick Links</h4>
                    <ul className="space-y-4 text-text-muted">
                        <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                        <li><a href="/login" className="hover:text-primary transition-colors">Login</a></li>
                        <li><a href="/register" className="hover:text-primary transition-colors">Sign Up</a></li>
                        <li><a href="/orders" className="hover:text-primary transition-colors">My Orders</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-text-main mb-6">Support</h4>
                    <ul className="space-y-4 text-text-muted">
                        <li><a href="/contact" className="hover:text-primary transition-colors">Help Center</a></li>
                        <li><a href="/contact" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        <li><a href="/contact" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        <li><a href="/contact" className="hover:text-primary transition-colors">Contact Us</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-text-main mb-6">Contact</h4>
                    <ul className="space-y-4 text-text-muted">
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-primary" />
                            <span>+91 7366891704</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-primary" />
                            <span>support@deliverx.com</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span>Last Gali Nanak Nagri Punjab</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-black/5 mt-16 pt-8 text-center text-text-muted">
                <p>&copy; {new Date().getFullYear()}.  Made with ❤️ By DeliverX Team. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
