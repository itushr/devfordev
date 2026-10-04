"use client";

import { useEffect, useRef, useState } from "react";
import Avatar from "@/components/Avatar";
import { uploadFile } from "@/lib/client/uploadFile";
import { CodeBlock } from "@/components/pitchCard/CodeBlock";
import { CodeXml, Image as ImageIcon, Loader2, X } from "lucide-react";
import { Sora } from "next/font/google";
import { CommentItemType } from "./types";

const sora = Sora({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function CommentComposer({
    postId,
    replyToUsername,
    onCommentCreated,
}: {
    postId: string;
    replyToUsername?: string;
    onCommentCreated?: (comment: CommentItemType) => void;
}) {
    const [text, setText] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [files, setFiles] = useState<Array<{ name: string; content: string }>>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            if (text) {
                textareaRef.current.style.height = `${Math.min(
                    textareaRef.current.scrollHeight,
                    240
                )}px`;
            }
        }
    }, [text]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = Array.from(e.target.files || []).filter((f) =>
            f.type.startsWith("image/")
        );
        if (fileList.length === 0) return;

        setUploadingImage(true);
        setError(null);

        try {
            for (const file of fileList) {
                const res = await uploadFile(file, (progress) => {
                    // Progress callback
                });
                if (res?.key) {
                    setImages((prev) => [...prev, res.key]);
                }
            }
        } catch (err) {
            console.error("Image upload failed:", err);
            setError("Failed to upload image");
        } finally {
            setUploadingImage(false);
            e.target.value = "";
        }
    };

    const handleAddCode = () => {
        setFiles((prev) => [
            ...prev,
            { name: `snippet_${prev.length + 1}.ts`, content: "// Write code here\n" },
        ]);
    };

    const handleRemoveFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCodeChange = (index: number, content: string) => {
        setFiles((prev) =>
            prev.map((f, i) => (i === index ? { ...f, content } : f))
        );
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const isEmpty = !text.trim() && images.length === 0 && files.length === 0;

    const handleSubmit = async () => {
        if (isEmpty || isSubmitting || uploadingImage) return;

        setIsSubmitting(true);
        setError(null);

        const data: any[] = [];
        if (images.length > 0) {
            data.push({
                type: "images",
                urls: images,
                compare: false,
            });
        }
        if (files.length > 0) {
            data.push({
                type: "code",
                files,
            });
        }

        try {
            const res = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: text.trim(),
                    data: data.length > 0 ? data : undefined,
                    replyToUsername,
                }),
            });

            if (res.status === 401) {
                throw new Error("Please log in to post a reply");
            }

            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.error || "Failed to post comment");
            }

            // Reset composer
            setText("");
            setImages([]);
            setFiles([]);
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }

            onCommentCreated?.(json.comment);

            if (typeof window !== "undefined") {
                window.dispatchEvent(
                    new CustomEvent("comment-created", {
                        detail: { postId, comment: json.comment },
                    })
                );
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            console.error("Submit comment error:", err);
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="w-full bg-background px-5 py-4 border-b border-border/40">
            {replyToUsername && (
                <div className="text-xs font-mono text-foreground/50 mb-2 pl-12 flex items-center gap-1">
                    <span>Replying to</span>
                    <span className="text-pink-500">@{replyToUsername}</span>
                </div>
            )}

            <div className="flex gap-3">
                <div className="shrink-0 pt-0.5">
                    <Avatar image="/random-pfps/pfp5.jpeg" size={9} />
                </div>

                <div className="flex-1 min-w-0">
                    <textarea
                        ref={textareaRef}
                        rows={2}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Post your reply..."
                        className={`${sora.className} w-full resize-none bg-transparent text-sm text-foreground placeholder:text-foreground/40 outline-none leading-relaxed`}
                    />

                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {images.map((url, idx) => (
                                <div key={idx} className="relative group rounded-md overflow-hidden border">
                                    <img
                                        src={url}
                                        alt="attached"
                                        className="w-full h-36 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Code Snippet Input / Preview */}
                    {files.map((file, idx) => (
                        <div key={idx} className="mt-2 border rounded-md p-2 bg-card/40">
                            <div className="flex justify-between items-center mb-1 text-xs font-mono text-foreground/60">
                                <span>{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(idx)}
                                    className="text-foreground/40 hover:text-red-500 cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                            <textarea
                                rows={4}
                                value={file.content}
                                onChange={(e) => handleCodeChange(idx, e.target.value)}
                                className="w-full bg-background font-mono text-xs p-2 rounded border border-border/50 text-foreground outline-none resize-y"
                            />
                        </div>
                    ))}

                    {error && (
                        <div className="text-xs text-red-500 font-mono mt-1">
                            {error}
                        </div>
                    )}

                    {/* Composer Toolbar (PitchAddons inspired) */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                        <div className="flex items-center gap-3 text-foreground/60">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingImage}
                                title="Attach images"
                                className="hover:text-pink-500 transition-colors cursor-pointer"
                            >
                                {uploadingImage ? (
                                    <Loader2 size={16} className="animate-spin text-pink-500" />
                                ) : (
                                    <ImageIcon size={16} />
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={handleImageUpload}
                            />

                            <button
                                type="button"
                                onClick={handleAddCode}
                                title="Add code snippet"
                                className="hover:text-pink-500 transition-colors cursor-pointer"
                            >
                                <CodeXml size={17} />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isEmpty || isSubmitting || uploadingImage}
                            className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                                isEmpty || isSubmitting || uploadingImage
                                    ? "bg-foreground/10 text-foreground/40 cursor-not-allowed"
                                    : "bg-pink-600 text-white hover:bg-pink-500 cursor-pointer shadow-sm"
                            }`}
                        >
                            {isSubmitting ? (
                                <Loader2 size={14} className="animate-spin" />
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
