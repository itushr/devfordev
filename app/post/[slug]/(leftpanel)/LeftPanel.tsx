"use client";

import { useState } from "react";
import BackButton from "@/components/BackButton";
import Separator from "@/components/Separator";
import PostDetail from "./PostDetail";
import CommentSection from "./CommentSection";
import { PostItem } from "@/components/pitchCard/PitchCard";

export default function LeftPanel({ slug }: { slug: string }) {
    const [post, setPost] = useState<PostItem | null>(null);

    return (
        <div className="w-150 border-x min-h-dvh pt-15">
            {/* Header */}
            <div className="z-10 h-15 w-149.5 bg-background/20 backdrop-blur-2xl border-b flex items-center px-4 gap-3 tracking-wide fixed top-0 text-sm font-mono">
                <BackButton />
                <div className="text-foreground/50 truncate">
                    post / <span className="text-foreground/80">{slug}</span>
                </div>
            </div>

            {/* Post Detail */}
            <PostDetail slug={slug} onPostLoaded={setPost} />

            <Separator />

            {/* Comments Section */}
            {post && (
                <CommentSection
                    postId={post._id}
                    postAuthorId={post.author_id}
                    authorUsername={post.author_username}
                />
            )}
        </div>
    );
}