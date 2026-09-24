"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command, CornerDownLeft, Loader2 } from "lucide-react";

import { useComposerCodeStore } from "@/store/composerCode";
import { useComposerPoll } from "@/store/composerPole";
import { useComposerText } from "@/store/composerText";
import { useUploadStore } from "@/store/upload";
import { useToggleStore } from "@/store/toggle";
import { PostData } from "@/validations/post";

export default function Submit() {
    const router = useRouter();

    const { text, clearText } = useComposerText();
    const { images, compare, clearImages } = useUploadStore();
    const { files, clearFiles } = useComposerCodeStore();
    const { pollEnabled, options, resetPoll } = useComposerPoll();
    const { showPitchComposer, togglePitchComposer } = useToggleStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isUploading = images.some((img) => !img.url || img.progress < 100);

    const isEmpty =
        !text.trim() &&
        images.length === 0 &&
        files.length === 0 &&
        (!pollEnabled || options.every((opt) => !opt.trim()));

    const handleSubmit = useCallback(async () => {
        if (isSubmitting || isUploading || isEmpty) return;

        setError(null);

        // Validation for poll
        if (pollEnabled) {
            const validOptions = options.map((opt) => opt.trim()).filter(Boolean);
            if (validOptions.length < 2) {
                setError("Poll must have at least 2 options");
                return;
            }
        }

        // Check if images are still uploading
        if (images.some((img) => !img.url || img.progress < 100)) {
            setError("Please wait for images to finish uploading");
            return;
        }

        const data: PostData[] = [];

        // Text block
        const trimmedText = text.trim();
        if (trimmedText) {
            data.push({
                type: "text",
                text: trimmedText,
            });
        }

        // Images block
        if (images.length > 0) {
            const urls = images.map((img) => img.url.trim()).filter(Boolean);
            if (urls.length > 0) {
                const isComparing = compare && urls.length === 2;
                data.push({
                    type: "images",
                    urls,
                    compare: isComparing,
                });
            }
        }

        // Code block
        if (files.length > 0) {
            const formattedFiles = files.map((f) => ({
                name: f.name.trim() || "untitled.jsx",
                content: f.content ?? "",
            }));

            data.push({
                type: "code",
                files: formattedFiles,
            });
        }

        // Poll block
        if (pollEnabled) {
            const validOptions = options.map((opt) => opt.trim()).filter(Boolean);
            if (validOptions.length >= 2) {
                data.push({
                    type: "poll",
                    options: validOptions,
                });
            }
        }

        if (data.length === 0) {
            setError("Pitch cannot be empty");
            return;
        }

        try {
            setIsSubmitting(true);

            const res = await fetch("/api/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data }),
            });

            if (res.status === 401) {
                throw new Error("Please log in to pitch");
            }

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || "Failed to post pitch");
            }

            // Successfully posted: reset stores
            clearText();
            clearImages();
            clearFiles();
            resetPoll();

            if (showPitchComposer) {
                await togglePitchComposer();
            }

            if (typeof window !== "undefined") {
                window.dispatchEvent(
                    new CustomEvent("pitch-created", { detail: json.post })
                );
            }

            router.refresh();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            console.error("Pitch submit failed:", err);
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    }, [
        text,
        images,
        compare,
        files,
        pollEnabled,
        options,
        isSubmitting,
        isUploading,
        isEmpty,
        showPitchComposer,
        togglePitchComposer,
        clearText,
        clearImages,
        clearFiles,
        resetPoll,
        router,
    ]);

    // Keyboard shortcut: Cmd + Enter / Ctrl + Enter
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [handleSubmit]);

    const isDisabled = isEmpty || isUploading || isSubmitting;

    return (
        <div className="flex items-center gap-2">
            {error && (
                <span className="text-xs text-red-500 max-w-50 truncate" title={error}>
                    {error}
                </span>
            )}

            <button
                type="button"
                onClick={handleSubmit}
                disabled={isDisabled}
                title={
                    isUploading
                        ? "Uploading images..."
                        : isEmpty
                        ? "Pitch cannot be empty"
                        : "Submit pitch (⌘ + Enter)"
                }
                className={`flex gap-1 border rounded-sm px-2 py-1 items-center transition-all ${
                    isDisabled
                        ? "opacity-40 cursor-not-allowed text-foreground/40 border-border"
                        : "opacity-70 hover:opacity-100 hover:text-pink-500 hover:border-pink-500 cursor-pointer text-foreground"
                }`}
            >
                {isSubmitting ? (
                    <Loader2 size={13} className="animate-spin text-pink-500" />
                ) : (
                    <>
                        <Command size={12} />
                        <CornerDownLeft size={13} />
                    </>
                )}
            </button>
        </div>
    );
}