"use client";

import { useToggleStore } from "@/store/toggle";
import { Plus } from "lucide-react";

export default function ComposeCTA() {
    const { togglePitchComposer } = useToggleStore();

    return (
        <div
            className="p-2.5 border rounded-full cursor-pointer hover:bg-card"
            onClick={() => togglePitchComposer()}
        >
            <Plus size={18} className="text-foreground/80" />
        </div>
    )
}
