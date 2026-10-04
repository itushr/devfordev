"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import CommentAwardButton from "./CommentAwardButton";
import PointsBadge from "./PointsBadge";

export default function CommentSocial({
    commentId,
    initialLikes = 0,
    likedByMe = false,
    repliesCount = 0,
    pointsAwarded = false,
    points = 0,
    isDirectComment = true,
    isPostAuthor = false,
    onReplyClick,
    onPointsChange,
}: {
    commentId: string;
    initialLikes?: number;
    likedByMe?: boolean;
    repliesCount?: number;
    pointsAwarded?: boolean;
    points?: number;
    isDirectComment?: boolean;
    isPostAuthor?: boolean;
    onReplyClick?: () => void;
    onPointsChange?: (awarded: boolean, points: number) => void;
}) {
    const [isLiked, setIsLiked] = useState<boolean>(likedByMe);
    const [likesCount, setLikesCount] = useState<number>(initialLikes);
    const [hasPoints, setHasPoints] = useState<boolean>(pointsAwarded);
    const [ptsAmount, setPtsAmount] = useState<number>(points);

    const desiredLikedRef = useRef<boolean>(likedByMe);
    const lastSentStateRef = useRef<boolean>(likedByMe);
    const inFlightRef = useRef<boolean>(false);

    useEffect(() => {
        setIsLiked(likedByMe);
        desiredLikedRef.current = likedByMe;
        lastSentStateRef.current = likedByMe;
    }, [likedByMe]);

    useEffect(() => {
        setLikesCount(initialLikes);
    }, [initialLikes]);

    useEffect(() => {
        setHasPoints(pointsAwarded);
        setPtsAmount(points);
    }, [pointsAwarded, points]);

    const syncLikeState = useCallback(async () => {
        if (!commentId) return;
        if (inFlightRef.current) return;

        inFlightRef.current = true;

        try {
            while (desiredLikedRef.current !== lastSentStateRef.current) {
                const targetState = desiredLikedRef.current;
                lastSentStateRef.current = targetState;

                const method = targetState ? "PUT" : "DELETE";
                const res = await fetch(`/api/comments/${commentId}/like`, {
                    method,
                    credentials: "include",
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        desiredLikedRef.current = !targetState;
                        lastSentStateRef.current = !targetState;
                        setIsLiked(!targetState);
                        setLikesCount((prev) => Math.max(0, prev + (!targetState ? 1 : -1)));
                        break;
                    }
                } else {
                    const data = await res.json();
                    if (typeof data.likes === "number" && desiredLikedRef.current === targetState) {
                        setLikesCount(data.likes);
                    }
                }
            }
        } catch (error) {
            console.error("Error syncing comment like state:", error);
        } finally {
            inFlightRef.current = false;
            if (desiredLikedRef.current !== lastSentStateRef.current) {
                syncLikeState();
            }
        }
    }, [commentId]);

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!commentId) return;

        const newDesired = !desiredLikedRef.current;
        desiredLikedRef.current = newDesired;
        setIsLiked(newDesired);
        setLikesCount((prev) => Math.max(0, prev + (newDesired ? 1 : -1)));

        if (!inFlightRef.current) {
            syncLikeState();
        }
    };

    const handlePointsChangeInternal = (awarded: boolean, newPts: number) => {
        setHasPoints(awarded);
        setPtsAmount(newPts);
        onPointsChange?.(awarded, newPts);
    };

    return (
        <div className="flex items-center justify-between text-xs font-mono text-foreground/50 mt-2 pt-1 border-t border-border/30">
            <div className="flex items-center gap-6">
                {/* Like Button */}
                <button
                    type="button"
                    onClick={handleLikeClick}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isLiked ? "text-pink-500 font-semibold" : "hover:text-pink-500"
                    }`}
                >
                    <Heart
                        size={14}
                        className={isLiked ? "fill-pink-500 text-pink-500" : ""}
                    />
                    <span>{likesCount}</span>
                </button>

                {/* Reply Button */}
                <button
                    type="button"
                    onClick={onReplyClick}
                    className="flex items-center gap-1.5 transition-colors hover:text-pink-500 cursor-pointer"
                >
                    <MessageCircle size={14} />
                    <span>{repliesCount}</span>
                </button>
            </div>

            <div className="flex items-center gap-2">
                {/* Author Points Decision (Only for direct comments, only visible to post author) */}
                {isDirectComment && isPostAuthor && (
                    <CommentAwardButton
                        commentId={commentId}
                        pointsAwarded={hasPoints}
                        points={ptsAmount}
                        onPointsChange={handlePointsChangeInternal}
                    />
                )}

                {/* Points Badge (Shown to everyone if points are awarded) */}
                {hasPoints && !isPostAuthor && (
                    <PointsBadge points={ptsAmount} />
                )}
            </div>
        </div>
    );
}
