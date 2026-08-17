"use client";

import { useState } from "react";

import Avatar from "../Avatar";
import TextArea from "./TextArea";
import ImagePreview from "./ImagePreview";
import PitchAddons from "./PitchAddons";
import DropArea from "./DropArea";

export default function PitchComposer() {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);


    const handleImageDrop = (file: File) => {
        setImageUrl(URL.createObjectURL(file));
    };

    return (
        <DropArea setIsDragging={setIsDragging} onImageDrop={handleImageDrop}>
            <div className="w-full p-5 pb-2 flex gap-3">
                <Avatar />

                <div className="flex-1">
                    <div className="pt-3 font-mono">
                        <TextArea />

                        {isDragging && (
                            <div className="w-full aspect-video bg-card mt-3 rounded-md flex items-center justify-center font-serif text-foreground/50">
                                drop to attach
                            </div>
                        )}

                        {imageUrl && (
                            <ImagePreview src={imageUrl} />
                        )}
                    </div>

                    <PitchAddons />
                </div>
            </div>
        </DropArea>
    );
}