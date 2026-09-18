"use client";

import { Button } from "@/components/ui/button";
import { useToggleStore } from "@/store/toggle";

export default function PostCTA() {
    const { togglePitchComposer } = useToggleStore();

    return (
        <div className="px-10 py-3">
            <Button onClick={() => togglePitchComposer() } className="w-full rounded-full">Pitch your Thought</Button>
        </div>
    )
}
