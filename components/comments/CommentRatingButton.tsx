"use client";

import { useState } from "react";
import { ThumbsDown, ThumbsUp, Star, Loader2 } from "lucide-react";
import { CommentRating } from "./types";

const RATING_CONFIG = {
    bad: {
        label: "Bad",
        icon: ThumbsDown,
        active: "bg-red-500/15 text-red-400 border-red-500/40 hover:bg-red-500/25",
        inactive: "text-foreground/50 hover:text-red-400 border-border/60 hover:border-red-500/40",
    },
    good: {
        label: "Good",
        icon: ThumbsUp,
        active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25",
        inactive: "text-foreground/50 hover:text-emerald-400 border-border/60 hover:border-emerald-500/40",
    },
    best: {
        label: "Best",
        icon: Star,
        active: "bg-amber-500/15 text-amber-400 border-amber-500/40 hover:bg-amber-500/25",
        inactive: "text-foreground/50 hover:text-amber-400 border-border/60 hover:border-amber-500/40",
    },
} as const;

type RatingKey = keyof typeof RATING_CONFIG;

export default function CommentRatingButton({
    commentId,
    initialRating,
    onRatingChange,
}: {
    commentId: string;
    initialRating: CommentRating;
    onRatingChange?: (rating: CommentRating) => void;
}) {
    const [currentRating, setCurrentRating] = useState<CommentRating>(initialRating);
    const [loading, setLoading] = useState(false);

    const handleRate = async (e: React.MouseEvent, rating: RatingKey) => {
        e.stopPropagation();
        if (loading) return;

        // Toggle off if clicking the same rating
        const nextRating: CommentRating = currentRating === rating ? null : rating;

        setLoading(true);
        try {
            if (nextRating === null) {
                const res = await fetch(`/api/comments/${commentId}/rate`, {
                    method: "DELETE",
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to remove rating");
            } else {
                const res = await fetch(`/api/comments/${commentId}/rate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ rating: nextRating }),
                });
                if (!res.ok) throw new Error("Failed to rate comment");
            }

            setCurrentRating(nextRating);
            onRatingChange?.(nextRating);
        } catch (error) {
            console.error("Error rating comment:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-1.5">
            {(["bad", "good", "best"] as RatingKey[]).map((rating) => {
                const cfg = RATING_CONFIG[rating];
                const isActive = currentRating === rating;
                const Icon = cfg.icon;

                return (
                    <button
                        key={rating}
                        type="button"
                        onClick={(e) => handleRate(e, rating)}
                        disabled={loading}
                        title={`Rate as ${cfg.label}`}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border transition-all cursor-pointer ${
                            isActive ? cfg.active : cfg.inactive
                        }`}
                    >
                        {loading && currentRating !== rating && currentRating !== null ? null : loading && (isActive || currentRating === null) ? (
                            <Loader2 size={11} className="animate-spin" />
                        ) : (
                            <Icon size={11} className={isActive ? "fill-current" : ""} />
                        )}
                        <span>{cfg.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
