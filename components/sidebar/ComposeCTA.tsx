import { useToggleStore } from "@/store/toggle";
import { Feather } from "lucide-react";

export default function ComposeCTA() {
    const { togglePitchComposer } = useToggleStore();

    return (
        <div
            className="border flex gap-2 justify-center items-center cursor-pointer hover:bg-card py-3 rounded-full"
            onClick={() => togglePitchComposer()}
        >
            <Feather size={18} /> Compose
        </div>
    )
}
