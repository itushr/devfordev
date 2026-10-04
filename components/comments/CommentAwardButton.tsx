"use client";

import { useState } from "react";
import { Award, Check, Loader2 } from "lucide-react";

export default function CommentAwardButton({
    commentId,
    pointsAwarded,
    points,
    onPointsChange,
}: {
    commentId: string;
    pointsAwarded: boolean;
    points: number;
    onPointsChange?: (awarded: boolean, points: number) => void;
}) {
    const [isAwarded, setIsAwarded] = useState(pointsAwarded);
    const [currentPoints, setCurrentPoints] = useState(points);
    const [loading, setLoading] = useState(false);

    const handleAward = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (loading) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/comments/${commentId}/award-points`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error("Failed to award points:", err.error);
                return;
            }

            const data = await res.json();
            setIsAwarded(data.pointsAwarded);
            setCurrentPoints(data.points);
            onPointsChange?.(data.pointsAwarded, data.points);
        } catch (error) {
            console.error("Error awarding points:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleAward}
            disabled={loading}
            title={
                isAwarded
                    ? "Points awarded! Click to revoke author points approval."
                    : "Approve and award points to this comment"
            }
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono transition-all cursor-pointer ${
                isAwarded
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30"
                    : "text-foreground/50 hover:text-amber-400 border border-border/60 hover:border-amber-500/40"
            }`}
        >
            {loading ? (
                <Loader2 size={12} className="animate-spin text-amber-500" />
            ) : isAwarded ? (
                <>
                    <Check size={12} className="text-amber-400" />
                    <span>Points Approved</span>
                </>
            ) : (
                <>
                    <Award size={12} />
                    <span>Award Points</span>
                </>
            )}
        </button>
    );
}
