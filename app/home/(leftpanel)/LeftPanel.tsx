"use client";

import { useState, useRef, useEffect } from "react";
import Feed from "./Feed";
import { ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useFeedStore, FeedMode } from "@/store/feed";

const MODES: { value: FeedMode; label: string }[] = [
    { value: "foryou", label: "for you" },
    { value: "recent", label: "recent" },
];

const LeftPanel = () => {
    const { authUser } = useAuthStore();
    const promptUsername = authUser?.username || "guest";

    const { mode, setMode } = useFeedStore();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = (value: FeedMode) => {
        setOpen(false);
        setMode(value);
    };

    const currentLabel = MODES.find((m) => m.value === mode)?.label ?? "for you";

    return (
        <div className="w-150 border pt-15">
            <div
                className={`z-10 h-15 w-149.5 bg-background/20 backdrop-blur-2xl border-b flex justify-between items-center px-5 gap-10 tracking-wide fixed top-0 text-md font-mono`}
            >
                <div className="h-15 font-mono flex items-center text-foreground/50">
                    {promptUsername}@devfordev ~ %
                </div>

                {/* Mode selector */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors cursor-pointer select-none"
                    >
                        <span>{currentLabel}</span>
                        <ChevronDown
                            size={15}
                            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        />
                    </button>

                    {open && (
                        <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-md shadow-lg overflow-hidden z-50 min-w-[110px]">
                            {MODES.map((m) => (
                                <button
                                    key={m.value}
                                    type="button"
                                    onClick={() => handleSelect(m.value)}
                                    className={`w-full text-left px-4 py-2 font-mono text-sm transition-colors cursor-pointer ${
                                        mode === m.value
                                            ? "text-foreground bg-card/50"
                                            : "text-foreground/60 hover:text-foreground hover:bg-card/30"
                                    }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Feed mode={mode} />
        </div>
    );
};

export default LeftPanel;