import { Award } from "lucide-react";

export default function PointsBadge({ points }: { points: number }) {
    return (
        <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-500 border border-amber-500/30 shadow-xs"
            title={`Author awarded ${points} points to this opinion`}
        >
            <Award size={12} className="text-amber-500" />
            <span>+{points} pts awarded</span>
        </span>
    );
}
