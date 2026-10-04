"use client";

import { useToggleStore } from "@/store/toggle";
import Terminal from "../Ternimal";
import PitchComposer from "./PitchComposer";

export default function PitchComposerModel() {
    const { showPitchComposer, togglePitchComposer, replyTarget } = useToggleStore();

    return (
        <div
            className={`fixed inset-0 min-h-dvh w-full z-50 bg-background/40 flex items-center justify-center backdrop-blur-md p-4 ${
                !showPitchComposer ? "hidden" : ""
            }`}
        >
            <Terminal onClose={() => togglePitchComposer()}>
                {replyTarget && (
                    <div className="px-5 py-1.5 text-xs font-mono text-pink-500/90 flex items-center gap-1.5 border-b border-border/40 mb-2">
                        <span className="text-foreground/50">Replying to</span>
                        <span className="font-semibold text-pink-500">@{replyTarget.username}</span>
                    </div>
                )}
                <PitchComposer />
            </Terminal>
        </div>
    );
}
