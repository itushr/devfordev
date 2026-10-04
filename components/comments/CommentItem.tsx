"use client";

import { useState } from "react";
import Avatar from "@/components/Avatar";
import { Sora } from "next/font/google";
import { CommentItemType } from "./types";
import CommentSocial from "./CommentSocial";
import CommentReplyBox from "./CommentReplyBox";
import CommentReplies from "./CommentReplies";
import { CodeBlock } from "@/components/pitchCard/CodeBlock";

const sora = Sora({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
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

export default function CommentItem({
    comment,
    postAuthorId,
    isPostAuthor,
    onPointsChange,
}: {
    comment: CommentItemType;
    postAuthorId?: string;
    isPostAuthor?: boolean;
    onPointsChange?: (commentId: string, awarded: boolean, points: number) => void;
}) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyToUser, setReplyToUser] = useState(comment.author_username);
    const [repliesCount, setRepliesCount] = useState(comment.repliesCount || 0);
    const [newReplies, setNewReplies] = useState<CommentItemType[]>([]);

    const handleReplyCreated = (newReply: CommentItemType) => {
        setNewReplies((prev) => [...prev, newReply]);
        setRepliesCount((prev) => prev + 1);
        setIsReplying(false);
    };

    return (
        <div className="w-full px-5 py-3.5 hover:bg-card/10 transition-colors border-b border-border/30">
            <div className="flex gap-3">
                {/* Left: Avatar with thread connector */}
                <div className="flex flex-col items-center shrink-0">
                    <Avatar
                        image={comment.author_avatar || "/random-pfps/pfp5.jpeg"}
                        size={9}
                    />
                    {(repliesCount > 0 || isReplying) && (
                        <div className="w-0.5 grow bg-border/40 my-1 rounded-full min-h-6" />
                    )}
                </div>

                {/* Right: Comment Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-foreground/50 truncate">
                            <span className="font-semibold text-foreground/90 truncate">
                                {comment.author_name}
                            </span>
                            <span>@{comment.author_username}</span>
                            <span>·</span>
                            <span>{formatDate(comment.createdAt)}</span>

                            {postAuthorId && comment.author_id === postAuthorId && (
                                <span className="ml-1 px-1.5 py-0.2 bg-foreground/10 text-foreground/70 rounded text-[10px] font-mono">
                                    Author
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className={`${sora.className} text-foreground/90 text-sm mt-1.5 whitespace-pre-wrap wrap-break-word leading-relaxed`}
                    >
                        {comment.content}
                    </div>

                    {/* Optional Code & Media Blocks */}
                    {comment.data && comment.data.length > 0 && (
                        <div className="mt-2 space-y-2">
                            {comment.data.map((block, idx) => {
                                if (block.type === "code" && block.files) {
                                    return <CodeBlock key={idx} files={block.files} />;
                                }
                                if (block.type === "images" && block.urls) {
                                    return (
                                        <div
                                            key={idx}
                                            className={`grid gap-2 ${
                                                block.urls.length > 1
                                                    ? "grid-cols-2"
                                                    : "grid-cols-1"
                                            }`}
                                        >
                                            {block.urls.map((url, imgIdx) => (
                                                <img
                                                    key={imgIdx}
                                                    src={url}
                                                    alt="comment media"
                                                    className="w-full rounded-md object-cover max-h-72"
                                                />
                                            ))}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}

                    {/* Action Bar */}
                    <CommentSocial
                        commentId={comment._id}
                        initialLikes={comment.likes}
                        likedByMe={comment.likedByMe}
                        repliesCount={repliesCount}
                        pointsAwarded={comment.pointsAwarded}
                        points={comment.points}
                        isDirectComment={true}
                        isPostAuthor={isPostAuthor}
                        onReplyClick={() => {
                            setReplyToUser(comment.author_username);
                            setIsReplying((prev) => !prev);
                        }}
                        onPointsChange={(awarded, pts) =>
                            onPointsChange?.(comment._id, awarded, pts)
                        }
                    />

                    {/* Inline Reply Composer */}
                    {isReplying && (
                        <CommentReplyBox
                            commentId={comment._id}
                            replyToUsername={replyToUser}
                            onReplyCreated={handleReplyCreated}
                            onCancel={() => setIsReplying(false)}
                        />
                    )}

                    {/* Threaded Replies */}
                    <CommentReplies
                        commentId={comment._id}
                        repliesCount={repliesCount}
                        postAuthorId={postAuthorId}
                        initialReplies={newReplies}
                        onReplyToUser={(u) => {
                            setReplyToUser(u);
                            setIsReplying(true);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
