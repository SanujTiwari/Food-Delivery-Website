import React from "react";

export default function SkeletonCard() {
    return (
        <div className="surface-card overflow-hidden">
            <div className="w-full h-48 sm:h-56 skeleton rounded-none border-b border-black/5 dark:border-white/5" />
            <div className="p-5 space-y-4">
                <div className="h-6 w-3/4 skeleton" />
                <div className="space-y-2">
                    <div className="h-4 w-full skeleton" />
                    <div className="h-4 w-5/6 skeleton" />
                </div>
                <div className="pt-4 flex justify-between">
                    <div className="h-4 w-1/4 skeleton" />
                    <div className="h-4 w-1/4 skeleton" />
                </div>
            </div>
        </div>
    );
}
