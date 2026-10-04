"use client";

import { CommentItemType } from "./types";
import CommentItem from "./CommentItem";
import { MessageSquare } from "lucide-react";

export default function CommentList({
    comments,
    postAuthorId,
    isPostAuthor,
    loading,
    onPointsChange,
}: {
    comments: CommentItemType[];
    postAuthorId?: string;
    isPostAuthor?: boolean;
    loading?: boolean;
    onPointsChange?: (commentId: string, awarded: boolean, points: number) => void;
}) {
    if (loading) {
        return (
            <div className="w-full divide-y divide-border/30">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="px-5 py-4 flex gap-3 animate-pulse">
                        <div className="w-9 h-9 rounded-full bg-card" />
                        <div className="flex-1 space-y-2">
                            <div className="w-32 h-3 bg-card rounded" />
                            <div className="w-full h-4 bg-card rounded" />
                            <div className="w-2/3 h-4 bg-card rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <div className="py-12 text-center text-foreground/50 font-mono text-sm space-y-2">
                <MessageSquare className="mx-auto size-6 text-foreground/30" />
                <p>No comments yet.</p>
                <p className="text-xs text-foreground/40">
                    Be the first to share your thoughts or code opinion!
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {comments.map((comment) => (
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    postAuthorId={postAuthorId}
                    isPostAuthor={isPostAuthor}
                    onPointsChange={onPointsChange}
                />
            ))}
        </div>
    );
}
