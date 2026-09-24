"use client";

import { useState } from "react";
import Avatar from "../Avatar";
import { Sora } from "next/font/google";
import Social from "./Social";
import { EllipsisVertical } from "lucide-react";
import {
    ImageSlider,
    ImageLayer,
    Divider,
} from "@/components/ui/image-comparison";
import { CodeBlockEditable } from "../ui/code-block-editable";

const sora = Sora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800']
});

export type PostDataBlock = {
    type: "text" | "images" | "code" | "poll";
    text?: string;
    urls?: string[];
    compare?: boolean;
    files?: Array<{ name: string; content: string }>;
    options?: string[];
};

export type PostItem = {
    _id: string;
    author_id: string;
    author_name: string;
    author_username: string;
    author_avatar?: string;
    points: number;
    data: PostDataBlock[];
    stats?: {
        flames?: number;
        likes?: number;
        comments?: number;
        impressions?: number;
        bookmarks?: number;
        shares?: number;
    };
    createdAt?: string;
    updatedAt?: string;
};

const formatDate = (dateString?: string) => {
    if (!dateString) return "14/07/2026";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

function PitchCodeBlock({ files }: { files: Array<{ name: string; content: string }> }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const activeFile = files[activeIdx] ?? files[0];
    if (!files || files.length === 0) return null;

    return (
        <div className="overflow-hidden rounded-md border mt-2">
            {files.length > 1 ? (
                <div className="flex w-full overflow-x-auto scrollbar-hide bg-card text-xs text-foreground/50 border-b">
                    {files.map((file, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveIdx(idx)}
                            className={`px-3 py-2 cursor-pointer font-mono ${
                                activeIdx === idx
                                    ? "text-foreground border-b-2 border-pink-500 font-semibold"
                                    : "hover:text-foreground"
                            }`}
                        >
                            {file.name}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="bg-card text-xs text-foreground/60 border-b px-3 py-1.5 font-mono">
                    {activeFile.name}
                </div>
            )}
            <CodeBlockEditable
                code={activeFile.content}
                language="js"
                readOnly={true}
            />
        </div>
    );
}

const PitchCard = ({ post }: { post?: PostItem }) => {
    return (
        <div className="w-full bg-background px-5 py-3 flex gap-3">
            <div className="flex flex-col justify-start relative pt-1">
                <Avatar image={post?.author_avatar || "/random-pfps/pfp5.jpeg"} size={9} />
            </div>
            <div className="flex-1 min-w-0">
                {/* header */}
                <div className="flex justify-between items-center">
                    <div className="font-mono text-foreground/50 mb-1 text-xs">
                        {post?.author_name || "Tushar"} ~ {formatDate(post?.createdAt)} ~ {post?.points ?? 25} pts
                    </div>
                    <EllipsisVertical size={16} className="text-foreground/50 rounded-full cursor-pointer hover:text-foreground" />
                </div>

                {/* main content */}
                <div className={`${sora.className} text-foreground/90 flex flex-col gap-2 mt-1`}>
                    {post?.data && post.data.length > 0 ? (
                        post.data.map((block, idx) => {
                            if (block.type === "text" && block.text) {
                                return (
                                    <div key={idx} className="whitespace-pre-wrap wrap-break-word leading-relaxed text-sm">
                                        {block.text}
                                    </div>
                                );
                            }

                            if (block.type === "images" && block.urls && block.urls.length > 0) {
                                if (block.compare && block.urls.length === 2) {
                                    return (
                                        <ImageSlider key={idx} className="h-80 w-full overflow-hidden rounded-xl bg-card mt-2">
                                            <ImageLayer src={block.urls[0]} alt="Before" layer="first" />
                                            <ImageLayer src={block.urls[1]} alt="After" layer="second" />
                                            <Divider />
                                        </ImageSlider>
                                    );
                                }

                                return (
                                    <div
                                        key={idx}
                                        className={`mt-2 grid gap-2 ${
                                            block.urls.length > 1 ? "grid-cols-2" : "grid-cols-1"
                                        }`}
                                    >
                                        {block.urls.map((url, imgIdx) => (
                                            <img
                                                key={imgIdx}
                                                src={url}
                                                alt="attached media"
                                                className="w-full rounded-md object-cover max-h-96"
                                            />
                                        ))}
                                    </div>
                                );
                            }

                            if (block.type === "code" && block.files && block.files.length > 0) {
                                return <PitchCodeBlock key={idx} files={block.files} />;
                            }

                            if (block.type === "poll" && block.options && block.options.length > 0) {
                                return (
                                    <div key={idx} className="w-full space-y-2 mt-2">
                                        {block.options.map((option, optIdx) => (
                                            <div
                                                key={optIdx}
                                                className="flex items-center gap-3 border rounded-md px-4 py-2 text-sm hover:border-pink-500/50 cursor-pointer bg-card/30"
                                            >
                                                <span className="text-foreground/50 font-mono text-xs">#{optIdx + 1}</span>
                                                <span className="text-foreground/90">{option}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }

                            return null;
                        })
                    ) : (
                        <div>
                            <span>Hii there! I am using whatsapp</span>
                            <div className="w-full aspect-video bg-card mt-2 rounded-md"></div>
                        </div>
                    )}
                </div>

                <Social username={post?.author_username} stats={post?.stats} />
            </div>
        </div>
    );
};

export default PitchCard;