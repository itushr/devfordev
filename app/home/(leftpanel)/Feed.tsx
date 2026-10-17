"use client";

import { useCallback, useEffect, useRef } from "react";
import PitchCard, { PostItem } from "@/components/pitchCard/PitchCard";
import Separator from "@/components/Separator";
import Skeleton from "@/components/pitchCard/Skeleton";
import { useFeedStore, FeedMode } from "@/store/feed";

export default function Feed({ mode }: { mode: FeedMode }) {
    const { posts, loading, error, initialized, hasMore, fetchPosts, fetchMore, prependPost } =
        useFeedStore();

    const sentinelRef = useRef<HTMLDivElement>(null);

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
                useFeedStore.getState().reset();
                useFeedStore.getState().fetchPosts();
            }
        };

        window.addEventListener("pitch-created", handlePitchCreated);
        return () => window.removeEventListener("pitch-created", handlePitchCreated);
    }, [prependPost]);

    // Infinite scroll — observe sentinel element
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMore && !loading) {
                fetchMore();
            }
        },
        [fetchMore, hasMore, loading]
    );

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
        });
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [handleObserver]);

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

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-4" />

            {loading && initialized && (
                <div className="w-full">
                    {[...Array(2).keys()].map((_, i) => (
                        <div key={i}>
                            <Skeleton />
                            <Separator />
                        </div>
                    ))}
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <p className="py-8 text-center font-mono text-xs text-foreground/30">
                    {mode === "recent" ? "You've reached the beginning." : "You're all caught up."}
                </p>
            )}
        </div>
    );
}