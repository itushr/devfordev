"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import Avatar from "@/components/Avatar";
import { CommentItemType } from "./types";
import { Sora } from "next/font/google";
import { Heart } from "lucide-react";

const sora = Sora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800']
});

const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

function ReplyItem({
    reply,
    postAuthorId,
}: {
    reply: CommentItemType;
    postAuthorId?: string;
}) {
    const [isLiked, setIsLiked] = useState<boolean>(reply.likedByMe ?? false);
    const [likesCount, setLikesCount] = useState<number>(reply.likes ?? 0);

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!reply._id) return;

        const nextLiked = !isLiked;
        setIsLiked(nextLiked);
        setLikesCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));

        try {
            const method = nextLiked ? "PUT" : "DELETE";
            const res = await fetch(`/api/comments/${reply._id}/like`, {
                method,
                credentials: "include",
            });

            if (!res.ok) {
                setIsLiked(!nextLiked);
                setLikesCount((prev) => Math.max(0, prev + (nextLiked ? -1 : 1)));
            } else {
                const data = await res.json();
                if (typeof data.likes === "number") {
                    setLikesCount(data.likes);
                }
            }
        } catch (error) {
            console.error("Error toggling reply like:", error);
            setIsLiked(!nextLiked);
            setLikesCount((prev) => Math.max(0, prev + (nextLiked ? -1 : 1)));
        }
    };

    return (
        <div className="w-full bg-background px-4 py-3 flex gap-3 border rounded-lg">
            <div className="flex flex-col justify-end relative pb-0.5">
                <Avatar image={reply.author_avatar || "/random-pfps/pfp5.jpeg"} size={8} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <div className="font-mono text-foreground/50 mb-1 flex items-center gap-1.5 flex-wrap">
                        <span>{reply.author_name || "Author"}</span>
                        <span>~</span>
                        <span>{formatDate(reply.createdAt)}</span>
                        {postAuthorId && reply.author_id === postAuthorId && (
                            <span className="ml-1 px-1.5 py-0.2 bg-foreground/10 text-foreground/70 rounded text-xs font-mono">
                                Author
                            </span>
                        )}
                    </div>
                </div>

                {reply.replyToUsername && (
                    <div className="font-mono text-xs text-foreground/50 mb-1">
                        Replying to <span className="text-pink-500 font-semibold">@{reply.replyToUsername}</span>
                    </div>
                )}

                <div className={`${sora.className} text-foreground/90 flex flex-col gap-2 mt-1`}>
                    <div className="whitespace-pre-wrap wrap-break-word leading-relaxed">
                        {reply.content}
                    </div>
                </div>

                <div className="flex w-full mt-3 justify-between font-mono text-foreground/50 border rounded-md px-2">
                    <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer py-1.5 flex-1">
                        <span>{reply.author_username || "anonymous"}</span>
                    </div>

                    <div className="flex gap-5 pr-1 items-center">
                        <div
                            onClick={handleLikeClick}
                            className={`flex items-center gap-2 cursor-pointer py-2 flex-1 justify-center transition-colors ${
                                isLiked ? "text-pink-500" : "hover:text-pink-500"
                            }`}
                        >
                            <Heart size={16} className={isLiked ? "fill-pink-500 text-pink-500" : ""} />
                            <span className="text-xs">{likesCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CommentReplies({
    commentId,
    repliesCount,
    postAuthorId,
    initialReplies = [],
}: {
    commentId: string;
    repliesCount: number;
    postAuthorId?: string;
    initialReplies?: CommentItemType[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [replies, setReplies] = useState<CommentItemType[]>(initialReplies);
    const [loading, setLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(initialReplies.length > 0);

    const toggleOpen = async () => {
        if (!isOpen && !hasLoaded) {
            setLoading(true);
            try {
                const res = await fetch(`/api/comments/${commentId}/replies`);
                if (res.ok) {
                    const data = await res.json();
                    setReplies(data.replies || []);
                    setHasLoaded(true);
                }
            } catch (err) {
                console.error("Failed to load replies:", err);
            } finally {
                setLoading(false);
            }
        }
        setIsOpen(!isOpen);
    };

    const totalCount = Math.max(repliesCount, replies.length);

    if (totalCount === 0) {
        return null;
    }

    return (
        <div className="w-full mt-3">
            <button
                type="button"
                onClick={toggleOpen}
                className="flex items-center gap-1.5 text-xs font-mono text-pink-500/80 hover:text-pink-500 cursor-pointer py-1"
            >
                {loading ? (
                    <Loader2 size={12} className="animate-spin" />
                ) : isOpen ? (
                    <ChevronUp size={14} />
                ) : (
                    <ChevronDown size={14} />
                )}
                <span>
                    {isOpen
                        ? "Hide replies"
                        : `Show ${totalCount} ${totalCount === 1 ? "reply" : "replies"}`}
                </span>
            </button>

            {isOpen && (
                <div className="mt-3 space-y-3 pl-4 border-l-2 border-border/40 ml-2">
                    {replies.map((reply) => (
                        <ReplyItem key={reply._id} reply={reply} postAuthorId={postAuthorId} />
                    ))}
                </div>
            )}
        </div>
    );
}
