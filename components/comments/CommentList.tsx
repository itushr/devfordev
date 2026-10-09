"use client";

import { CommentItemType } from "./types";
import CommentItem from "./CommentItem";
import Separator from "@/components/Separator";
import Skeleton from "@/components/pitchCard/Skeleton";
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
            <div className="w-full">
                {[...Array(3).keys()].map((_, i) => (
                    <div key={i}>
                        <Skeleton />
                        <Separator />
                    </div>
                ))}
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <div className="py-16 text-center text-foreground/50 font-mono text-sm space-y-2">
                <MessageSquare className="mx-auto size-7 text-foreground/30" />
                <p>No comments yet.</p>
                <p className="text-xs text-foreground/40">
                    Be the first to pitch your opinion!
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {comments.map((comment) => (
                <div key={comment._id}>
                    <CommentItem
                        comment={comment}
                        postAuthorId={postAuthorId}
                        isPostAuthor={isPostAuthor}
                        onPointsChange={onPointsChange}
                    />
                    <Separator />
                </div>
            ))}
        </div>
    );
}
