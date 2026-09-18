"use client";

import { useToggleStore } from "@/store/toggle";
import Terminal from "../Ternimal";
import PitchComposer from "./PitchComposer";

export default function PitchComposerModel() {
    const { showPitchComposer, togglePitchComposer } = useToggleStore();

    return (
        <div className={`absolute top-0 left-0 min-h-dvh w-full z-20 bg-background/10 flex items-center justify-center backdrop-blur ${!showPitchComposer && "hidden"}`}>
            <Terminal onClose={() => togglePitchComposer()}>
                <PitchComposer />
            </Terminal>
        </div>
    )
}
