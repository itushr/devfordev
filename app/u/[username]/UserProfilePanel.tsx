"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Star } from "lucide-react";
import { Elsie, Roboto } from "next/font/google";
import PitchCard, { PostItem } from "@/components/pitchCard/PitchCard";
import Separator from "@/components/Separator";
import Avatar from "@/components/Avatar";
import FollowButton from "@/components/FollowButton";
import { useAuthStore } from "@/store/auth";

const roboto = Roboto({ weight: "400", subsets: ["latin"], display: "swap" });
const elsie = Elsie({ weight: "400", subsets: ["latin"], display: "swap" });

type ProfileUser = {
    id: string;
    name: string;
    username: string;
    avatar: string;
    description: string;
    points: number;
    rating: number;
    createdAt: string;
};

const formatJoinDate = (dateString?: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export default function UserProfilePanel() {
    const params = useParams();
    const username = params?.username as string;
    const authUser = useAuthStore((s) => s.authUser);

    const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!username) return;
        let cancelled = false;

        setLoading(true);
        setNotFound(false);

        fetch(`/api/users/by-username/${encodeURIComponent(username)}`, {
            credentials: "include",
        })
            .then((r) => {
                if (r.status === 404) {
                    if (!cancelled) setNotFound(true);
                    return null;
                }
                return r.json();
            })
            .then((data) => {
                if (!data || cancelled) return;
                setProfileUser(data.user);
                setPosts(data.posts ?? []);
                setFollowersCount(data.followersCount ?? 0);
                setFollowingCount(data.followingCount ?? 0);
                setIsFollowing(data.isFollowing ?? false);
            })
            .catch(() => {
                if (!cancelled) setNotFound(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [username]);

    const isSelf = authUser?.id === profileUser?.id;

    if (loading) {
        return (
            <div className="w-150 border-x min-h-dvh p-10 flex flex-col gap-4 animate-pulse">
                <div className="h-6 w-48 bg-muted rounded font-mono" />
                <div className="flex gap-5 mt-6">
                    <div className="size-32 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 flex flex-col gap-3">
                        <div className="h-5 w-40 bg-muted rounded" />
                        <div className="h-4 w-28 bg-muted rounded" />
                        <div className="h-12 w-full bg-muted rounded mt-2" />
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || !profileUser) {
        return (
            <div className="w-150 border-x min-h-dvh flex flex-col items-center justify-center p-10 text-center">
                <p className="font-mono text-lg text-foreground mb-2">User not found</p>
                <p className="text-sm text-foreground/60">
                    No user with username <span className="text-pink-500">@{username}</span>
                </p>
            </div>
        );
    }

    const ratingVal = Math.round(profileUser.rating ?? 0);

    return (
        <div className="w-150 border-x min-h-dvh">
            {/* Terminal-style header */}
            <div className="h-15 border-b font-mono flex px-5 items-center text-foreground/50">
                {profileUser.username}@devfordev ~ %
            </div>

            {/* Profile header */}
            <div>
                <div className="flex">
                    <div className="p-5">
                        <div
                            className="size-32 border rounded-full bg-cover bg-center flex items-end justify-center shrink-0"
                            style={{ backgroundImage: `url('${profileUser.avatar || "/random-pfps/pfp5.jpeg"}')` }}
                        >
                            <div className="bg-foreground text-background w-fit flex items-center px-3 py-0.5 gap-0.5 rounded-2xl translate-y-2 border">
                                <span className="text-xs font-bold">{ratingVal}</span>
                                <Star size={10} className="fill-background" />
                            </div>
                        </div>
                        <div className="mt-5">
                            <p className="text-center text-lg font-semibold">{profileUser.name}</p>
                            <p className="-mt-1 text-foreground/70 text-center text-sm font-mono">
                                @{profileUser.username}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 p-5 flex flex-col justify-between border-l pl-5">
                        <pre className="font-mono whitespace-pre-wrap text-[15px] leading-relaxed">
                            {profileUser.description || "No bio yet."}
                        </pre>

                        <div className="flex gap-5 text-foreground/80 my-3">
                            <div className="flex gap-2 items-center">
                                <Calendar size={14} />
                                <span className="text-xs">{formatJoinDate(profileUser.createdAt)}</span>
                            </div>
                        </div>

                        {/* Counts row */}
                        <div className="flex gap-8">
                            <div>
                                <div className={`${elsie.className} text-3xl text-center`}>
                                    {followersCount}
                                </div>
                                <div className="text-xs text-foreground/80 text-center font-mono">followers</div>
                            </div>
                            <div>
                                <div className={`${elsie.className} text-3xl text-center`}>
                                    {followingCount}
                                </div>
                                <div className="text-xs text-foreground/80 text-center font-mono">following</div>
                            </div>
                            <div>
                                <div className={`${elsie.className} text-3xl text-center`}>
                                    {profileUser.points ?? 0}
                                </div>
                                <div className="text-xs text-foreground/80 text-center font-mono">points</div>
                            </div>
                            <div>
                                <div className={`${elsie.className} text-3xl text-center`}>
                                    {posts.length}
                                </div>
                                <div className="text-xs text-foreground/80 text-center font-mono">pitches</div>
                            </div>
                        </div>

                        {/* Follow button — only shown if not self and logged in */}
                        {!isSelf && (
                            <div className="mt-4">
                                <FollowButton
                                    targetUserId={profileUser.id}
                                    initialIsFollowing={isFollowing}
                                    onFollowChange={(following, count) => {
                                        setIsFollowing(following);
                                        setFollowersCount(count);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Separator />

            {/* Tabs bar */}
            <div
                className={`z-10 h-15 w-149.5 bg-background/20 backdrop-blur-2xl border-b flex items-end px-5 gap-10 tracking-wide ${roboto.className}`}
            >
                <div className="pb-3 relative font-medium">
                    pitches
                    <div className="h-1 w-full bg-pink-500 absolute bottom-0 rounded-full" />
                </div>
            </div>

            {/* Posts */}
            <div>
                {posts.length > 0 ? (
                    posts.map((post) => (
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
}
