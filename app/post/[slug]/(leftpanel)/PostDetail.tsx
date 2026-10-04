"use client";

import { useEffect, useState } from "react";
import PitchCard, { PostItem } from "@/components/pitchCard/PitchCard";
import Skeleton from "@/components/pitchCard/Skeleton";

export default function PostDetail({
    slug,
    onPostLoaded,
}: {
    slug: string;
    onPostLoaded?: (post: PostItem) => void;
}) {
    const [post, setPost] = useState<PostItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchPost() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/posts/${slug}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("Post not found");
                    }
                    throw new Error("Failed to load post");
                }
                const data = await res.json();
                if (isMounted) {
                    setPost(data.post);
                    onPostLoaded?.(data.post);
                }
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Error loading post";
                if (isMounted) setError(message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        if (slug) {
            fetchPost();
        }

        return () => {
            isMounted = false;
        };
    }, [slug, onPostLoaded]);

    if (loading) {
        return (
            <div className="w-full">
                <Skeleton />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="py-16 text-center font-mono text-sm text-red-500">
                <p>{error || "Post not found"}</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <PitchCard
                post={post}
                disableCommentClick={true}
                disableNavigation={true}
            />
        </div>
    );
}
