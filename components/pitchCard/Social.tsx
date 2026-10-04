"use client";

import { useEffect, useState } from "react";
import { Activity, Bookmark, Heart, MessageCircle, Send } from "lucide-react";
import { useToggleStore } from "@/store/toggle";

export default function Social({
    postId,
    username,
    stats,
    likedByMe = false,
    disableCommentClick = false,
}: {
    postId?: string;
    username?: string;
    stats?: {
        likes?: number;
        comments?: number;
        impressions?: number;
        bookmarks?: number;
        shares?: number;
    };
    likedByMe?: boolean;
    disableCommentClick?: boolean;
}) {
    const [isLiked, setIsLiked] = useState<boolean>(likedByMe);
    const [likesCount, setLikesCount] = useState<number>(stats?.likes ?? 0);
    const [commentsCount, setCommentsCount] = useState<number>(stats?.comments ?? 0);

    const { openComposerWithReply } = useToggleStore();

    useEffect(() => {
        setIsLiked(likedByMe);
    }, [likedByMe]);

    useEffect(() => {
        setLikesCount(stats?.likes ?? 0);
    }, [stats?.likes]);

    useEffect(() => {
        setCommentsCount(stats?.comments ?? 0);
    }, [stats?.comments]);

    useEffect(() => {
        const handleCommentCreated = (e: Event) => {
            const customEvent = e as CustomEvent<{ postId: string }>;
            if (customEvent.detail && customEvent.detail.postId === postId) {
                setCommentsCount((prev) => prev + 1);
            }
        };

        window.addEventListener("comment-created", handleCommentCreated);
        return () => window.removeEventListener("comment-created", handleCommentCreated);
    }, [postId]);

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!postId) return;

        const nextLiked = !isLiked;
        setIsLiked(nextLiked);
        setLikesCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));

        try {
            const method = nextLiked ? "PUT" : "DELETE";
            const res = await fetch(`/api/posts/${postId}/like`, {
                method,
                credentials: "include",
            });

            if (!res.ok) {
                // Revert on failure
                setIsLiked(!nextLiked);
                setLikesCount((prev) => Math.max(0, prev + (nextLiked ? -1 : 1)));
            } else {
                const data = await res.json();
                if (typeof data.likes === "number") {
                    setLikesCount(data.likes);
                }
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            setIsLiked(!nextLiked);
            setLikesCount((prev) => Math.max(0, prev + (nextLiked ? -1 : 1)));
        }
    };

    const handleCommentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disableCommentClick) {
            // on clicking comment icon in post/[slug] page nothing happens
            return;
        }

        if (postId && username) {
            openComposerWithReply({ postId, username });
        }
    };

    const interactions = [
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
            count: commentsCount,
            onClick: handleCommentClick,
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