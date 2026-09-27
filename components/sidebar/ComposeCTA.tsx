import { useToggleStore } from "@/store/toggle";
import { Command, CornerDownLeft, Feather, Plus } from "lucide-react";

export default function ComposeCTA() {
    const { togglePitchComposer } = useToggleStore();

    return (
        <div
            className="border flex gap-2 justify-center items-center cursor-pointer hover:bg-card py-3 rounded-full"
            onClick={() => togglePitchComposer()}
        >
            <Plus size={18} /> Compose
            <button className="flex gap-1 border rounded-sm px-2 py-1 items-center">
                <Command size={12} />
                <CornerDownLeft size={13} />
            </button>
        </div>
    )
}
