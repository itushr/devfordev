"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Activity, Bookmark, Flame, Heart, MessageCircle, Send } from "lucide-react";

export default function Social({
    postId,
    username,
    stats,
    likedByMe = false,
}: {
    postId?: string;
    username?: string;
    stats?: {
        flames?: number;
        likes?: number;
        comments?: number;
        impressions?: number;
        bookmarks?: number;
        shares?: number;
    };
    likedByMe?: boolean;
}) {
    const [isLiked, setIsLiked] = useState<boolean>(likedByMe);
    const [likesCount, setLikesCount] = useState<number>(stats?.likes ?? 0);

    const desiredLikedRef = useRef<boolean>(likedByMe);
    const lastSentStateRef = useRef<boolean>(likedByMe);
    const inFlightRef = useRef<boolean>(false);

    useEffect(() => {
        setIsLiked(likedByMe);
        desiredLikedRef.current = likedByMe;
        lastSentStateRef.current = likedByMe;
    }, [likedByMe]);

    useEffect(() => {
        setLikesCount(stats?.likes ?? 0);
    }, [stats?.likes]);

    const syncLikeState = useCallback(async () => {
        if (!postId) return;
        if (inFlightRef.current) return;

        inFlightRef.current = true;

        try {
            while (desiredLikedRef.current !== lastSentStateRef.current) {
                const targetState = desiredLikedRef.current;
                lastSentStateRef.current = targetState;

                const method = targetState ? "PUT" : "DELETE";
                const res = await fetch(`/api/posts/${postId}/like`, {
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
            console.error("Error syncing like state:", error);
        } finally {
            inFlightRef.current = false;
            if (desiredLikedRef.current !== lastSentStateRef.current) {
                syncLikeState();
            }
        }
    }, [postId]);

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!postId) return;

        const newDesired = !desiredLikedRef.current;
        desiredLikedRef.current = newDesired;
        setIsLiked(newDesired);
        setLikesCount((prev) => Math.max(0, prev + (newDesired ? 1 : -1)));

        if (!inFlightRef.current) {
            syncLikeState();
        }
    };

    const interactions = [
        {
            icon: <Flame size={17} />,
            count: stats?.flames ?? 0,
            onClick: undefined,
            active: false,
        },
        {
            icon: (
                <Heart
                    size={16}
                    className={isLiked ? "fill-pink-500 text-pink-500" : ""}
                />
            ),
            count: likesCount,
            onClick: handleLikeClick,
            active: isLiked,
        },
        {
            icon: <MessageCircle size={15} />,
            count: stats?.comments ?? 0,
            onClick: undefined,
            active: false,
        },
        {
            icon: <Activity size={16} />,
            count: stats?.impressions ?? 0,
            onClick: undefined,
            active: false,
        },
        {
            icon: <Bookmark size={16} />,
            count: stats?.bookmarks ?? 0,
            onClick: undefined,
            active: false,
        },
        {
            icon: <Send size={15} />,
            count: stats?.shares ?? 0,
            onClick: undefined,
            active: false,
        },
    ];

    return (
        <div className="flex w-full mt-3 justify-between font-mono text-foreground/50 border rounded-md px-2">
            <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer py-1.5 flex-1">
                {username || "anonymous"}
            </div>
            <div className="flex gap-5 pr-1">
                {interactions.map((interaction, index) => (
                    <div
                        key={index}
                        onClick={interaction.onClick}
                        className={`flex items-center gap-2 cursor-pointer py-2 flex-1 justify-center transition-colors ${
                            interaction.active
                                ? "text-pink-500"
                                : "hover:text-pink-500"
                        }`}
                    >
                        {interaction.icon}
                        <span className="text-xs">{interaction.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}