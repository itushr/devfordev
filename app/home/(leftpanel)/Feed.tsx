"use client";

import { useCallback, useEffect } from "react";
import PitchCard, { PostItem } from "@/components/pitchCard/PitchCard";
import Separator from "@/components/Separator";
import Skeleton from "@/components/pitchCard/Skeleton";
import { useFeedStore } from "@/store/feed";

export default function Feed() {
    const { posts, loading, error, initialized, fetchPosts, prependPost } = useFeedStore();

    // Fetch on first mount — no-op if already cached
    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Listen for new pitches and prepend them
    useEffect(() => {
        const handlePitchCreated = (e: Event) => {
            const customEvent = e as CustomEvent<PostItem>;
            if (customEvent.detail?._id) {
                prependPost(customEvent.detail);
            } else {
                // Full reload only if we have no detail
                useFeedStore.getState().reset();
                useFeedStore.getState().fetchPosts();
            }
        };

        window.addEventListener("pitch-created", handlePitchCreated);
        return () => window.removeEventListener("pitch-created", handlePitchCreated);
    }, [prependPost]);

    if (loading && !initialized) {
        return (
            <div className="w-full">
                {[...Array(4).keys()].map((_, i) => (
                    <div key={i}>
                        <Skeleton />
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
                    onClick={() => {
                        useFeedStore.getState().reset();
                        useFeedStore.getState().fetchPosts();
                    }}
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