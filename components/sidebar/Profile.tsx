"use client";

import { MoreHorizontal, LogIn, LogOut } from 'lucide-react';
import Avatar from '../Avatar';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Profile = () => {
    const { authUser, checkingAuth, logout } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    if (checkingAuth) {
        return (
            <div className="border-t w-full px-5 py-3 flex gap-3 items-center animate-pulse">
                <div className="size-10 rounded-full bg-muted" />
                <div className="flex-1 flex flex-col gap-1.5">
                    <div className="h-3.5 w-24 bg-muted rounded" />
                    <div className="h-3 w-16 bg-muted rounded" />
                </div>
            </div>
        );
    }

    if (!authUser) {
        return (
            <div className="border-t w-full px-5 py-3 flex items-center justify-between">
                <Link
                    href="/auth/login"
                    className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground font-mono"
                >
                    <LogIn size={16} />
                    <span>~/login</span>
                </Link>
                <Link
                    href="/auth/register"
                    className="text-xs bg-foreground text-background px-3 py-1.5 rounded-full font-mono hover:opacity-90"
                >
                    sign up
                </Link>
            </div>
        );
    }

    const handleLogout = async () => {
        setMenuOpen(false);
        await logout();
        router.refresh();
    };

    return (
        <div className="border-t w-full px-5 py-3 flex gap-3 items-center relative" ref={menuRef}>
            <Link href="/profile" className="flex gap-3 items-center flex-1 min-w-0 group">
                <Avatar image={authUser.avatar || "/random-pfps/pfp5.jpeg"} size={10} />

                <div className="flex-1 flex flex-col justify-center min-w-0">
                    <p className="font-semibold text-sm truncate group-hover:underline">
                        {authUser.name}
                    </p>
                    <p className="text-foreground/70 text-xs truncate">
                        @{authUser.username}
                    </p>
                </div>
            </Link>

            <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="hover:bg-card p-2 rounded-full cursor-pointer text-foreground/70 hover:text-foreground transition-colors"
                aria-label="User menu"
            >
                <MoreHorizontal size={16} />
            </button>

            {menuOpen && (
                <div className="absolute bottom-full mb-2 right-4 bg-background border rounded-xl shadow-lg p-1.5 min-w-44 z-50">
                    <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-card font-mono transition-colors"
                    >
                        <span>~/profile</span>
                    </Link>
                    <Link
                        href="/setting"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-card font-mono transition-colors"
                    >
                        <span>~/setting</span>
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive font-mono transition-colors text-left cursor-pointer"
                    >
                        <LogOut size={14} />
                        <span>Log out</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;