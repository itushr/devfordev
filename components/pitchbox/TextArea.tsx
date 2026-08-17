"use client";

import { useState } from "react";

const DOMAIN =
    String.raw`(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}`;

const HTTP_URL_REGEX = new RegExp(
    String.raw`https?:\/\/(?:${DOMAIN})(?::\d{2,5})?(?:[/?#][^\s<>)\]]*)?`,
    "gi"
);

const BARE_DOMAIN_REGEX = new RegExp(
    String.raw`(?<![@\w.-])(?:www\.)?${DOMAIN}(?::\d{2,5})?(?:[/?#][^\s<>)\]]*)?`,
    "gi"
);

const MARKDOWN_URL_REGEX =
    /\[[^\]]*\]\(\s*(https?:\/\/[^\s)]+)\s*\)/gi;


// Extract URLs from Markdown links
const extractMarkdownUrls = (text: string): string[] => {
    return [...text.matchAll(MARKDOWN_URL_REGEX)].map(
        (match) => match[1]
    );
};


// Extract http/https URLs
const extractHttpUrls = (text: string): string[] => {
    return text.match(HTTP_URL_REGEX) ?? [];
};


// Extract bare domains
const extractBareDomains = (text: string): string[] => {
    return text.match(BARE_DOMAIN_REGEX) ?? [];
};


// Remove duplicates
const removeDuplicates = (urls: string[]): string[] => {
    return [...new Set(urls)];
};


// Extract all URLs
const extractUrls = (text: string): string[] => {
    return removeDuplicates([
        ...extractMarkdownUrls(text),
        ...extractHttpUrls(text),
        ...extractBareDomains(text),
    ]);
};


// Escape HTML special characters
const escapeHtml = (text: string): string => {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};


// Highlight URLs
const highlightUrls = (text: string): string => {
    const urls = extractUrls(text);

    if (urls.length === 0) {
        return escapeHtml(text);
    }

    const urlPattern = new RegExp(
        urls
            .sort((a, b) => b.length - a.length)
            .map((url) => url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join("|"),
        "gi"
    );

    return escapeHtml(text).replace(urlPattern, (url) => {
        return `<span class="text-blue-500">${url}</span>`;
    });
};


const TextArea = () => {
    const [text, setText] = useState("");

    const handleInput = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const value = e.target.value;

        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;

        setText(value);

        const urls = extractUrls(value);
    };

    return (
        <div className="relative w-full">
            {/* Highlight layer */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute inset-0
                    whitespace-pre-wrap
                    wrap-break-word
                    border-none
                    px-0 py-0
                    text-foreground
                    z-0
                "
                dangerouslySetInnerHTML={{
                    __html: highlightUrls(text),
                }}
            />

            <textarea
                rows={1}
                value={text}
                spellCheck={false}
                onChange={handleInput}
                placeholder="pitch your idea"
                className="
                    relative
                    w-full
                    resize-none
                    overflow-y-auto
                    border-none
                    outline-none
                    bg-transparent
                    text-transparent
                    placeholder:text-foreground/50
                    caret-foreground
                "
            />
        </div>
    );
};

export default TextArea;