import { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-primary" />,
    };

    const bgColors = {
        success: "bg-green-500/10 border-green-500/20",
        error: "bg-red-500/10 border-red-500/20",
        info: "bg-primary/10 border-primary/20",
    };

    return (
        <div className={`fixed bottom-10 right-10 z-[200] flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl animate-slide-up shadow-2xl ${bgColors[type]}`}>
            <div className="flex items-center gap-3">
                {icons[type]}
                <p className="text-text-main font-bold text-sm tracking-wide">{message}</p>
            </div>
            <button onClick={onClose} className="hover:opacity-70 transition-opacity">
                <X className="w-4 h-4 text-text-muted" />
            </button>
        </div>
    );
}
