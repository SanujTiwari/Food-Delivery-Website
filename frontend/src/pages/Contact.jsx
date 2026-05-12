import { useState } from "react";
import { Mail, Phone, MapPin, Send, Plus, Minus, MessageSquare } from "lucide-react";

export default function Contact({ showToast }) {
    const [openFaq, setOpenFaq] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            if(showToast) showToast("Message sent successfully! We'll get back to you soon.", "success");
            e.target.reset();
        }, 1500);
    };

    const faqs = [
        {
            q: "What are your delivery hours?",
            a: "We deliver 24/7 in select major cities. For other locations, our standard delivery hours are from 8:00 AM to 11:30 PM."
        },
        {
            q: "How can I track my order?",
            a: "Once your order is confirmed, you can track its live status in the 'Orders' section of your profile. We provide a 5-step live tracker."
        },
        {
            q: "Do you offer contact-less delivery?",
            a: "Yes! You can select the 'Leave at door' option during checkout for a completely contact-less delivery experience."
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept all major Credit/Debit cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery."
        },
        {
            q: "How do I cancel my order?",
            a: "Orders can only be cancelled within 60 seconds of placement. After that, the restaurant begins preparation and cancellation is not possible."
        }
    ];

    return (
        <div className="container-app pt-24 pb-24 space-y-24 animate-fade-in">
            
            {/* Header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <span className="section-tag mx-auto">Get In Touch</span>
                <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight uppercase">
                    Contact <span className="text-primary italic">Us</span>
                </h1>
                <p className="text-text-muted font-medium">Have a question or feedback? We'd love to hear from you. Fill out the form below or use our contact details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Contact Info & Form */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="surface-card p-8 md:p-10 relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                        
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-text-main mb-6">Send a Message</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase pl-1">Name</label>
                                        <input type="text" required className="input-base !py-3" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase pl-1">Email</label>
                                        <input type="email" required className="input-base !py-3" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase pl-1">Subject</label>
                                    <input type="text" required className="input-base !py-3" placeholder="How can we help?" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-text-muted tracking-widest uppercase pl-1">Message</label>
                                    <textarea required className="input-base !py-3 min-h-[150px] resize-y" placeholder="Your message here..." />
                                </div>
                                
                                <button type="submit" disabled={loading} className="btn-primary !py-4 px-8 shadow-primary w-full sm:w-auto flex items-center justify-center gap-2">
                                    {loading ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="surface-card p-8 space-y-8 h-full">
                        <h3 className="text-xl font-black text-text-main uppercase tracking-widest">Contact Details</h3>
                        
                        <div className="space-y-6">
                            {[
                                { icon: MapPin, title: "Our Headquarters", detail: "123 Foodie Blvd, Culinary District\nSan Francisco, CA 90210" },
                                { icon: Phone, title: "Phone Support", detail: "+1 (800) 123-4567\nMon-Sun, 8am-11pm" },
                                { icon: Mail, title: "Email Address", detail: "support@deliverx.com\npress@deliverx.com" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5 items-start group">
                                    <div className="w-12 h-12 bg-bg-subtle text-text-main rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1 pt-1">
                                        <h4 className="font-bold text-text-main">{item.title}</h4>
                                        <p className="text-sm text-text-muted whitespace-pre-line">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="divider" />

                        <div className="bg-primary-soft p-6 rounded-2xl flex items-center gap-4 border border-primary/20">
                            <MessageSquare className="w-8 h-8 text-primary shrink-0" />
                            <div>
                                <h4 className="font-bold text-primary">Live Chat Support</h4>
                                <p className="text-xs text-primary/80 font-medium">Average response time: 2 mins</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* FAQs Section */}
            <div className="max-w-3xl mx-auto space-y-8 pt-12">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-text-main">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => {
                        const isOpen = openFaq === i;
                        return (
                            <div 
                                key={i} 
                                className={`surface-card overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary shadow-sm ring-1 ring-primary-soft' : ''}`}
                            >
                                <button 
                                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                                    className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-text-main hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                >
                                    <span className="pr-4">{faq.q}</span>
                                    <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-bg-subtle text-text-muted'}`}>
                                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </div>
                                </button>
                                
                                <div 
                                    className={`overflow-hidden transition-all duration-300 ease-in-out`}
                                    style={{ maxHeight: isOpen ? '200px' : '0px', opacity: isOpen ? 1 : 0 }}
                                >
                                    <div className="p-6 pt-0 text-text-muted font-medium text-sm leading-relaxed border-t border-black/5 dark:border-white/5 mx-6 mt-2">
                                        {faq.a}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
