"use client";

import { useState } from "react";
import Avatar from "@/components/Avatar";
import { Sora } from "next/font/google";
import { CommentItemType } from "./types";
import { CodeBlock } from "@/components/pitchCard/CodeBlock";
import {
    ImageSlider,
    ImageLayer,
    Divider,
} from "@/components/ui/image-comparison";
import { EllipsisVertical, Heart, MessageCircle } from "lucide-react";
import CommentAwardButton from "./CommentAwardButton";
import PitchComposer from "@/components/pitchComposer/PitchComposer";
import CommentReplies from "./CommentReplies";

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

export default function CommentItem({
    comment,
    postAuthorId,
    isPostAuthor = false,
    isDirectComment = true,
    onPointsChange,
}: {
    comment: CommentItemType;
    postAuthorId?: string;
    isPostAuthor?: boolean;
    isDirectComment?: boolean;
    onPointsChange?: (commentId: string, awarded: boolean, points: number) => void;
}) {
    const [isLiked, setIsLiked] = useState<boolean>(comment.likedByMe ?? false);
    const [likesCount, setLikesCount] = useState<number>(comment.likes ?? 0);
    const [repliesCount, setRepliesCount] = useState<number>(comment.repliesCount ?? 0);
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [newReplies, setNewReplies] = useState<CommentItemType[]>([]);

    const handleLikeClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!comment._id) return;

        const nextLiked = !isLiked;
        setIsLiked(nextLiked);
        setLikesCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));

        try {
            const method = nextLiked ? "PUT" : "DELETE";
            const res = await fetch(`/api/comments/${comment._id}/like`, {
                method,
                credentials: "include",
            });

            if (!res.ok) {
                // Revert on error
                setIsLiked(!nextLiked);
                setLikesCount((prev) => Math.max(0, prev + (nextLiked ? -1 : 1)));
            } else {
                const data = await res.json();
                if (typeof data.likes === "number") {
                    setLikesCount(data.likes);
                }
            }
        } catch (error) {
            console.error("Error toggling comment like:", error);
            setIsLiked(!nextLiked);
            setLikesCount((prev) => Math.max(0, prev + (nextLiked ? -1 : 1)));
        }
    };

    const handleReplyCreated = (reply: CommentItemType) => {
        setNewReplies((prev) => [...prev, reply]);
        setRepliesCount((prev) => prev + 1);
        setIsReplying(false);
    };

    return (
        <div className="w-full bg-background px-5 py-3 flex gap-3">
            {/* Avatar matching PitchCard */}
            <div className="flex flex-col justify-end relative pb-0.5">
                <Avatar image={comment.author_avatar || "/random-pfps/pfp5.jpeg"} size={9} />
            </div>

            <div className="flex-1 min-w-0">
                {/* Header matching PitchCard */}
                <div className="flex justify-between items-center">
                    <div className="font-mono text-foreground/50 mb-1 flex items-center gap-1.5 flex-wrap">
                        <span>{comment.author_name || "Author"}</span>
                        <span>~</span>
                        <span>{formatDate(comment.createdAt)}</span>
                        <span>~</span>
                        <span>{comment.points ?? 0} pts</span>

                        {postAuthorId && comment.author_id === postAuthorId && (
                            <span className="ml-1 px-1.5 py-0.2 bg-foreground/10 text-foreground/70 rounded text-xs font-mono">
                                Author
                            </span>
                        )}

                        {comment.pointsAwarded && (
                            <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-500 border border-amber-500/30">
                                ★ Points Approved
                            </span>
                        )}
                    </div>
                    <EllipsisVertical
                        size={16}
                        className="text-foreground/50 rounded-full cursor-pointer hover:text-foreground"
                    />
                </div>

                {/* Main Content matching PitchCard font-size & styling */}
                <div className={`${sora.className} text-foreground/90 flex flex-col gap-2 mt-1`}>
                    {comment.content && (
                        <div className="whitespace-pre-wrap wrap-break-word leading-relaxed">
                            {comment.content}
                        </div>
                    )}

                    {/* Rich data blocks (images, code, poll) */}
                    {comment.data && comment.data.length > 0 && (
                        comment.data.map((block, idx) => {
                            if (block.type === "text" && block.text && block.text !== comment.content) {
                                return (
                                    <div key={idx} className="whitespace-pre-wrap wrap-break-word leading-relaxed">
                                        {block.text}
                                    </div>
                                );
                            }

                            if (block.type === "images" && block.urls && block.urls.length > 0) {
                                if (block.compare && block.urls.length === 2) {
                                    return (
                                        <ImageSlider key={idx} className="h-80 w-full overflow-hidden rounded-xl bg-card mt-2">
                                            <ImageLayer src={block.urls[0]} alt="Before" layer="first" />
                                            <ImageLayer src={block.urls[1]} alt="After" layer="second" />
                                            <Divider />
                                        </ImageSlider>
                                    );
                                }

                                return (
                                    <div
                                        key={idx}
                                        className={`mt-2 grid gap-2 ${
                                            block.urls.length > 1 ? "grid-cols-2" : "grid-cols-1"
                                        }`}
                                    >
                                        {block.urls.map((url, imgIdx) => (
                                            <img
                                                key={imgIdx}
                                                src={url}
                                                alt="attached media"
                                                className="w-full rounded-md object-cover max-h-96"
                                            />
                                        ))}
                                    </div>
                                );
                            }

                            if (block.type === "code" && block.files && block.files.length > 0) {
                                return <CodeBlock key={idx} files={block.files} />;
                            }

                            return null;
                        })
                    )}
                </div>

                {/* Social Bar matching PitchCard Social styling */}
                <div className="flex w-full mt-3 justify-between font-mono text-foreground/50 border rounded-md px-2">
                    <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer py-1.5 flex-1">
                        <span>{comment.author_username || "anonymous"}</span>
                    </div>

                    <div className="flex gap-5 pr-1 items-center">
                        {/* Author Points Award Button (Only for direct comments, only visible to post author) */}
                        {isDirectComment && isPostAuthor && (
                            <CommentAwardButton
                                commentId={comment._id}
                                pointsAwarded={comment.pointsAwarded}
                                points={comment.points}
                                onPointsChange={(awarded, pts) =>
                                    onPointsChange?.(comment._id, awarded, pts)
                                }
                            />
                        )}

                        {/* Like button */}
                        <div
                            onClick={handleLikeClick}
                            className={`flex items-center gap-2 cursor-pointer py-2 flex-1 justify-center transition-colors ${
                                isLiked ? "text-pink-500" : "hover:text-pink-500"
                            }`}
                        >
                            <Heart
                                size={16}
                                className={isLiked ? "fill-pink-500 text-pink-500" : ""}
                            />
                            <span className="text-xs">{likesCount}</span>
                        </div>

                        {/* Reply button */}
                        <div
                            onClick={() => setIsReplying((prev) => !prev)}
                            className={`flex items-center gap-2 cursor-pointer py-2 flex-1 justify-center transition-colors ${
                                isReplying ? "text-pink-500" : "hover:text-pink-500"
                            }`}
                        >
                            <MessageCircle size={15} />
                            <span className="text-xs">{repliesCount}</span>
                        </div>
                    </div>
                </div>

                {/* Inline PitchComposer for replying (no terminal!) */}
                {isReplying && (
                    <div className="mt-3 border rounded-xl overflow-hidden bg-card/10">
                        <PitchComposer
                            postId={comment.post_id}
                            parentCommentId={comment._id}
                            replyToUsername={comment.author_username}
                            placeholder="Pitch your reply..."
                            onCommentCreated={handleReplyCreated}
                        />
                    </div>
                )}

                {/* Threaded nested replies */}
                <CommentReplies
                    commentId={comment._id}
                    repliesCount={repliesCount}
                    postAuthorId={postAuthorId}
                    initialReplies={newReplies}
                />
            </div>
        </div>
    );
}
