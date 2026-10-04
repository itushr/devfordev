"use client";

import { useEffect, useRef, useState } from "react";
import Avatar from "@/components/Avatar";
import { Loader2 } from "lucide-react";
import { Sora } from "next/font/google";
import { CommentItemType } from "./types";

const sora = Sora({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

export default function CommentReplyBox({
    commentId,
    replyToUsername,
    onReplyCreated,
    onCancel,
}: {
    commentId: string;
    replyToUsername: string;
    onReplyCreated: (reply: CommentItemType) => void;
    onCancel: () => void;
}) {
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!text.trim() || submitting) return;

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch(`/api/comments/${commentId}/replies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: text.trim(),
                    replyToUsername,
                }),
            });

            if (res.status === 401) {
                throw new Error("Please log in to reply");
            }

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to post reply");
            }

            setText("");
            onReplyCreated(data.reply);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to reply";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full mt-3 p-3 bg-card/40 rounded-lg border border-border/50">
            <div className="text-xs font-mono text-foreground/50 mb-2">
                Replying to <span className="text-pink-500 font-semibold">@{replyToUsername}</span>
            </div>

            <div className="flex gap-2.5">
                <div className="shrink-0 pt-0.5">
                    <Avatar image="/random-pfps/pfp5.jpeg" size={7} />
                </div>

                <div className="flex-1 min-w-0">
                    <textarea
                        ref={textareaRef}
                        rows={2}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Post your reply..."
                        className={`${sora.className} w-full resize-none bg-transparent text-xs text-foreground placeholder:text-foreground/40 outline-none leading-relaxed`}
                    />

                    {error && (
                        <div className="text-xs text-red-500 font-mono mb-2">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-border/30">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-3 py-1 text-xs font-mono text-foreground/50 hover:text-foreground cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!text.trim() || submitting}
                            className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                                !text.trim() || submitting
                                    ? "bg-foreground/10 text-foreground/40 cursor-not-allowed"
                                    : "bg-pink-600 text-white hover:bg-pink-500 cursor-pointer shadow-xs"
                            }`}
                        >
                            {submitting ? (
                                <Loader2 size={12} className="animate-spin" />
                            ) : (
                                "Reply"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
