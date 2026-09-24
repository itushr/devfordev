"use client";

import { useCallback, useEffect, useState } from "react";
import PitchCard, { PostItem } from "@/components/pitchCard/PitchCard";
import Separator from "@/components/Separator";
import { Loader2 } from "lucide-react";

export default function Feed() {
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        try {
            setError(null);
            const res = await fetch("/api/post?limit=25");

            if (!res.ok) {
                throw new Error("Failed to load recent posts");
            }

            const data = await res.json();
            const items: PostItem[] = Array.isArray(data) ? data : data.posts ?? [];
            setPosts(items);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to load posts";
            console.error("Error fetching posts:", err);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();

        const handlePitchCreated = (e: Event) => {
            const customEvent = e as CustomEvent<PostItem>;
            if (customEvent.detail && customEvent.detail._id) {
                setPosts((prev) => {
                    const filtered = prev.filter((p) => p._id !== customEvent.detail._id);
                    return [customEvent.detail, ...filtered];
                });
            } else {
                fetchPosts();
            }
        };

        window.addEventListener("pitch-created", handlePitchCreated);
        return () => {
            window.removeEventListener("pitch-created", handlePitchCreated);
        };
    }, [fetchPosts]);

    if (loading) {
        return (
            <div className="w-full">
                {[...Array(4).keys()].map((_, i) => (
                    <div key={i}>
                        <div className="w-full px-5 py-4 flex gap-3 animate-pulse">
                            <div className="size-9 bg-card rounded-full shrink-0" />
                            <div className="flex-1 space-y-3">
                                <div className="h-3 w-40 bg-card rounded" />
                                <div className="h-4 w-3/4 bg-card rounded" />
                                <div className="h-24 w-full bg-card rounded" />
                            </div>
                        </div>
                        <Separator />
                    </div>
                ))}
            </div>
        );
    }

    if (error && posts.length === 0) {
        return (
            <div className="py-16 text-center font-mono text-sm text-red-500">
                <p>{error}</p>
                <button
                    type="button"
                    onClick={fetchPosts}
                    className="mt-3 text-xs text-foreground/70 underline hover:text-foreground cursor-pointer"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="py-16 text-center text-foreground/50 font-mono text-sm space-y-1">
                <p>No posts yet.</p>
                <p className="text-xs text-foreground/40">Be the first to post your thought!</p>
            </div>
        );
    }

    return (
        <div>
            {posts.map((post) => (
                <div key={post._id}>
                    <PitchCard post={post} />
                    <Separator />
                </div>
            ))}
        </div>
    );
}