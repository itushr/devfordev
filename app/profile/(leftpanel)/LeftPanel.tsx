"use client";

import PitchCard, { PostItem } from "@/components/pitchCard/PitchCard";
import Separator from "@/components/Separator";
import { Calendar, Link as LinkIcon, Star } from "lucide-react";
import { Elsie, Roboto } from "next/font/google";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
    display: 'swap'
});

const elsie = Elsie({
    weight: '400',
    subsets: ['latin'],
    display: 'swap'
});

const LeftPanel = () => {
    const { authUser, checkingAuth } = useAuthStore();
    const [counts, setCounts] = useState<{ followersCount: number; followingCount: number }>({
        followersCount: 0,
        followingCount: 0,
    });
    const [userPosts, setUserPosts] = useState<PostItem[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);

    useEffect(() => {
        if (!authUser?.id) return;

        // Fetch follow counts
        fetch(`/api/users/${authUser.id}/follow-status`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
                if (data.followersCount !== undefined && data.followingCount !== undefined) {
                    setCounts({
                        followersCount: data.followersCount,
                        followingCount: data.followingCount,
                    });
                }
            })
            .catch(() => {});

        // Fetch author's posts
        setLoadingPosts(true);
        fetch(`/api/post?limit=25`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
                const items: PostItem[] = Array.isArray(data) ? data : data.posts ?? [];
                // Filter posts by this user if available
                const myPosts = items.filter((p) => p.author_id === authUser.id);
                setUserPosts(myPosts.length > 0 ? myPosts : items);
            })
            .catch(() => {})
            .finally(() => setLoadingPosts(false));
    }, [authUser?.id]);

    const formattedJoinDate = useMemo(() => {
        if (!authUser?.createdAt) return "Joined Recently";
        const date = new Date(authUser.createdAt);
        if (isNaN(date.getTime())) return "Joined Recently";
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }, [authUser?.createdAt]);

    if (checkingAuth) {
        return (
            <div className="w-150 border-x min-h-dvh p-10 flex flex-col gap-4 animate-pulse">
                <div className="h-6 w-48 bg-muted rounded font-mono" />
                <div className="flex gap-5 mt-6">
                    <div className="size-32 rounded-full bg-muted" />
                    <div className="flex-1 flex flex-col gap-3">
                        <div className="h-5 w-40 bg-muted rounded" />
                        <div className="h-4 w-28 bg-muted rounded" />
                        <div className="h-12 w-full bg-muted rounded mt-2" />
                    </div>
                </div>
            </div>
        );
    }

    if (!authUser) {
        return (
            <div className="w-150 border-x min-h-dvh flex flex-col items-center justify-center p-10 text-center">
                <p className="font-mono text-lg text-foreground mb-2">You are not logged in</p>
                <p className="text-sm text-foreground/60 mb-6">
                    Sign in to view your profile details, pitches, and network stats.
                </p>
                <div className="flex gap-4">
                    <Link
                        href="/auth/login"
                        className="px-6 py-2 rounded-full border border-border hover:bg-card font-mono text-sm"
                    >
                        ~/login
                    </Link>
                    <Link
                        href="/auth/register"
                        className="px-6 py-2 rounded-full bg-foreground text-background font-mono text-sm hover:opacity-90"
                    >
                        sign up
                    </Link>
                </div>
            </div>
        );
    }

    const ratingVal = typeof authUser.rating === "number" ? Math.round(authUser.rating) : 5;
    const pointsVal = authUser.points ?? 0;

    return (
        <div className="w-150 border-x min-h-dvh">
            <div className="h-15 border-b font-mono flex px-5 items-center text-foreground/50">
                {authUser.username}@devfordev ~ %
            </div>

            <div>
                <div className="flex">
                    <div className="p-5">
                        <div
                            className="size-32 border rounded-full bg-cover bg-center flex items-end justify-center shrink-0"
                            style={{ backgroundImage: `url('${authUser.avatar || "/random-pfps/pfp5.jpeg"}')` }}
                        >
                            <div className="bg-foreground text-background w-fit flex items-center px-3 py-0.5 gap-0.5 rounded-2xl translate-y-2 border">
                                <span className="text-xs font-bold">{ratingVal}</span>
                                <Star size={10} className="fill-background" />
                            </div>
                        </div>
                        <div className="mt-5">
                            <p className="text-center text-lg font-semibold">{authUser.name}</p>
                            <p className="-mt-1 text-foreground/70 text-center text-sm font-mono">
                                @{authUser.username}
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between border-l pl-5">
                        <pre className="font-mono whitespace-pre-wrap text-[15px] leading-relaxed">
                            {authUser.description || "I code | break things | repeat\nbuilding devfordev..."}
                        </pre>

                        <div className="flex gap-5 text-foreground/80 my-3">
                            {authUser.email && (
                                <div className="flex gap-2 items-center group">
                                    <LinkIcon size={14} />
                                    <span className="text-blue-500 text-xs font-mono">{authUser.email}</span>
                                </div>
                            )}
                            <div className="flex gap-2 items-center">
                                <Calendar size={14} />
                                <span className="text-xs">{formattedJoinDate}</span>
                            </div>
                        </div>

                        <div className="flex gap-8">
                            <div>
                                <div className={`${elsie.className} text-3xl text-center`}>
                                    {counts.followersCount}
                                </div>
                                <div className="text-xs text-foreground/80 text-center font-mono">followers</div>
                            </div>
                            <div>
                                <div className={`${elsie.className} text-3xl text-center`}>
                                    {counts.followingCount}
                                </div>
                                <div className="text-xs text-foreground/80 text-center font-mono">following</div>
                            </div>
                            <div>
                                <div className={`${elsie.className} text-3xl text-center`}>
                                    {pointsVal}
                                </div>
                                <div className="text-xs text-foreground/80 text-center font-mono">points</div>
                            </div>
                            <div>
                                <div className={`${elsie.className} text-3xl text-center`}>
                                    {userPosts.length}
                                </div>
                                <div className="text-xs text-foreground/80 text-center font-mono">pitches</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            <div className={`z-10 h-15 w-149.5 bg-background/20 backdrop-blur-2xl border-b flex items-end px-5 gap-10 tracking-wide ${roboto.className}`}>
                <div className="pb-3 relative font-medium">
                    pitches
                    <div className="h-1 w-full bg-pink-500 absolute bottom-0 rounded-full"></div>
                </div>
                <div className="pb-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    contributions
                </div>
                <div className="pb-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    replies
                </div>
                <div className="pb-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    likes
                </div>
                <div className="pb-3 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    media
                </div>
            </div>

            <div>
                {loadingPosts ? (
                    <div className="py-12 text-center font-mono text-sm text-foreground/50">
                        Loading pitches...
                    </div>
                ) : userPosts.length > 0 ? (
                    userPosts.map((post) => (
                        <div key={post._id}>
                            <PitchCard post={post} />
                            <Separator />
                        </div>
                    ))
                ) : (
                    <div className="py-16 text-center font-mono text-sm text-foreground/50">
                        No pitches yet.
                    </div>
                )}
                <div className="h-15 flex justify-center items-center text-foreground/50 font-mono text-xs">
                    $end
                </div>
            </div>
        </div>
    );
};

export default LeftPanel;