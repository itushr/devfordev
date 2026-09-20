"use client";

import { useToggleStore } from "@/store/toggle";
import { Feather } from "lucide-react";

export default function ComposeCTA() {
    const { togglePitchComposer } = useToggleStore();

    return (
        <div
            className="p-3 border rounded-full cursor-pointer hover:bg-card"
            onClick={() => togglePitchComposer()}
        >
            <Feather size={15} />
        </div>
    )
}
