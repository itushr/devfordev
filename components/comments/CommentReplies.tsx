"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import Avatar from "@/components/Avatar";
import CommentSocial from "./CommentSocial";
import { CommentItemType } from "./types";
import { Sora } from "next/font/google";

const sora = Sora({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

const formatDate = (dateString?: string) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
};

export default function CommentReplies({
    commentId,
    repliesCount,
    postAuthorId,
    initialReplies = [],
    onReplyToUser,
}: {
    commentId: string;
    repliesCount: number;
    postAuthorId?: string;
    initialReplies?: CommentItemType[];
    onReplyToUser?: (username: string) => void;
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

    if (repliesCount === 0 && replies.length === 0) {
        return null;
    }

    return (
        <div className="w-full mt-2">
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
                        : `Show ${Math.max(repliesCount, replies.length)} ${
                              Math.max(repliesCount, replies.length) === 1
                                  ? "reply"
                                  : "replies"
                          }`}
                </span>
            </button>

            {isOpen && (
                <div className="mt-2 space-y-3 pl-4 border-l-2 border-border/40 ml-4">
                    {replies.map((reply) => (
                        <div key={reply._id} className="pt-2">
                            <div className="flex gap-2.5">
                                <div className="shrink-0 pt-0.5">
                                    <Avatar
                                        image={reply.author_avatar || "/random-pfps/pfp5.jpeg"}
                                        size={7}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 text-xs font-mono text-foreground/50">
                                        <span className="font-semibold text-foreground/80 truncate">
                                            {reply.author_name}
                                        </span>
                                        <span>@{reply.author_username}</span>
                                        <span>·</span>
                                        <span>{formatDate(reply.createdAt)}</span>
                                        {postAuthorId && reply.author_id === postAuthorId && (
                                            <span className="ml-1 px-1.5 py-0.2 bg-foreground/10 text-foreground/70 rounded text-[10px] font-mono">
                                                Author
                                            </span>
                                        )}
                                    </div>

                                    {reply.replyToUsername && (
                                        <div className="text-[11px] font-mono text-foreground/40 mt-0.5">
                                            Replying to <span className="text-pink-500/80">@{reply.replyToUsername}</span>
                                        </div>
                                    )}

                                    <div
                                        className={`${sora.className} text-xs text-foreground/90 mt-1 whitespace-pre-wrap wrap-break-word leading-relaxed`}
                                    >
                                        {reply.content}
                                    </div>

                                    {/* Replies are points-free; can be liked */}
                                    <CommentSocial
                                        commentId={reply._id}
                                        initialLikes={reply.likes}
                                        likedByMe={reply.likedByMe}
                                        repliesCount={reply.repliesCount}
                                        isDirectComment={false}
                                        onReplyClick={() => onReplyToUser?.(reply.author_username)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
