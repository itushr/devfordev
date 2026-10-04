"use client";

import { useCallback, useEffect, useState } from "react";
import CommentComposer from "@/components/comments/CommentComposer";
import CommentList from "@/components/comments/CommentList";
import { CommentItemType } from "@/components/comments/types";
import Separator from "@/components/Separator";

export default function CommentSection({
    postId,
    postAuthorId,
    authorUsername,
}: {
    postId: string;
    postAuthorId?: string;
    authorUsername?: string;
}) {
    const [comments, setComments] = useState<CommentItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPostAuthor, setIsPostAuthor] = useState(false);

    const fetchComments = useCallback(async () => {
        if (!postId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/posts/${postId}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data.comments || []);
                setIsPostAuthor(Boolean(data.isPostAuthor));
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();

        const handleCommentCreated = (e: Event) => {
            const customEvent = e as CustomEvent<{
                postId: string;
                comment: CommentItemType;
            }>;
            if (
                customEvent.detail &&
                customEvent.detail.postId === postId &&
                customEvent.detail.comment
            ) {
                setComments((prev) => {
                    const exists = prev.some(
                        (c) => c._id === customEvent.detail.comment._id
                    );
                    if (exists) return prev;
                    return [customEvent.detail.comment, ...prev];
                });
            }
        };

        window.addEventListener("comment-created", handleCommentCreated);
        return () => window.removeEventListener("comment-created", handleCommentCreated);
    }, [postId, fetchComments]);

    const handleCommentCreated = (newComment: CommentItemType) => {
        setComments((prev) => [newComment, ...prev]);
    };

    const handlePointsChange = (
        commentId: string,
        awarded: boolean,
        points: number
    ) => {
        setComments((prev) =>
            prev.map((c) =>
                c._id === commentId
                    ? { ...c, pointsAwarded: awarded, points }
                    : c
            )
        );
    };

    return (
        <div className="w-full">
            {/* Twitter-like inline comment composer (no terminal) */}
            <CommentComposer
                postId={postId}
                replyToUsername={authorUsername}
                onCommentCreated={handleCommentCreated}
            />

            <Separator />

            {/* Comments List */}
            <CommentList
                comments={comments}
                postAuthorId={postAuthorId}
                isPostAuthor={isPostAuthor}
                loading={loading}
                onPointsChange={handlePointsChange}
            />
        </div>
    );
}
