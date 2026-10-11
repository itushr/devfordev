"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import FollowButton from "@/components/FollowButton";
import { useAuthStore } from "@/store/auth";

type RecentUser = {
    id: string;
    name: string;
    username: string;
    avatar: string;
    points: number;
    rating: number;
};

const Contributors = () => {
    const [users, setUsers] = useState<RecentUser[]>([]);
    const [loading, setLoading] = useState(true);
    const authUser = useAuthStore((s) => s.authUser);
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        fetch("/api/users/recent")
            .then((r) => r.json())
            .then((data) => {
                if (!cancelled) setUsers(data.users ?? []);
            })
            .catch(() => {
                if (!cancelled) setUsers([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="p-5">
            <p className="text-lg font-mono">Please Welcome</p>

            <div className="flex flex-col gap-5 mt-5">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex justify-between items-center animate-pulse">
                            <div className="flex items-center gap-x-3">
                                <div className="size-9 rounded-full bg-muted" />
                                <div className="flex flex-col gap-1.5">
                                    <div className="h-3.5 w-28 bg-muted rounded" />
                                    <div className="h-3 w-20 bg-muted rounded" />
                                </div>
                            </div>
                            <div className="h-7 w-16 bg-muted rounded-full" />
                        </div>
                    ))
                ) : users.length === 0 ? (
                    <p className="text-sm text-foreground/50 font-mono">No users yet.</p>
                ) : (
                    users.map((user) => (
                        <div
                            key={user.id}
                            className="flex justify-between items-center"
                        >
                            <div
                                className="flex items-center gap-x-3 cursor-pointer group"
                                onClick={() => router.push(`/u/${user.username}`)}
                            >
                                <Avatar image={user.avatar} size={9} />
                                <div>
                                    <p className="text-sm font-medium group-hover:text-pink-500 transition-colors">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-foreground/50 font-mono">
                                        @{user.username}
                                    </p>
                                </div>
                            </div>

                            {authUser?.id !== user.id && (
                                <FollowButton targetUserId={user.id} size="sm" />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Contributors;