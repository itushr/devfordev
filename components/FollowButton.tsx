"use client";

import { useState, useEffect, useCallback } from "react";

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing?: boolean;
    className?: string;
    size?: "sm" | "md";
    onFollowChange?: (isFollowing: boolean, followersCount: number) => void;
}

/**
 * FollowButton — minimal follow/unfollow button.
 * Fetches initial follow status if not provided.
 * Optimistic UI with rollback on error.
 */
export default function FollowButton({
    targetUserId,
    initialIsFollowing,
    className = "",
    size = "md",
    onFollowChange,
}: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState<boolean>(
        initialIsFollowing ?? false
    );
    const [isLoading, setIsLoading] = useState(initialIsFollowing === undefined);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (initialIsFollowing !== undefined) {
            setIsFollowing(initialIsFollowing);
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        setIsLoading(true);

        fetch(`/api/users/${targetUserId}/follow-status`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
                if (!cancelled) {
                    setIsFollowing(data.isFollowing ?? false);
                    setIsLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [targetUserId, initialIsFollowing]);

    const handleClick = useCallback(async () => {
        if (isPending) return;

        const prevState = isFollowing;
        const nextState = !isFollowing;

        // Optimistic update
        setIsFollowing(nextState);
        setIsPending(true);

        try {
            const method = nextState ? "POST" : "DELETE";
            const res = await fetch(`/api/users/${targetUserId}/follow`, {
                method,
                credentials: "include",
            });

            if (!res.ok) {
                // Rollback
                setIsFollowing(prevState);
                return;
            }

            const data = await res.json();
            onFollowChange?.(nextState, data.followersCount ?? 0);
        } catch {
            // Rollback
            setIsFollowing(prevState);
        } finally {
            setIsPending(false);
        }
    }, [isPending, isFollowing, targetUserId, onFollowChange]);

    if (isLoading) {
        return (
            <div
                className={`animate-pulse rounded-full bg-muted ${
                    size === "sm" ? "h-7 w-16" : "h-9 w-24"
                } ${className}`}
            />
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`
                rounded-full font-semibold transition-all duration-200
                disabled:opacity-70 disabled:cursor-not-allowed
                ${size === "sm" ? "px-3 py-1 text-xs" : "px-5 py-2 text-sm"}
                ${
                    isFollowing
                        ? "border border-border text-foreground hover:border-destructive hover:text-destructive hover:bg-destructive/5"
                        : "bg-foreground text-background hover:opacity-90"
                }
                ${className}
            `}
        >
            {isPending ? "..." : isFollowing ? "Following" : "Follow"}
        </button>
    );
}
