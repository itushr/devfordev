"use client";

import { useState } from "react";

import Avatar from "../Avatar";
import TextArea from "./TextArea";
import ImagePreview from "./ImagePreview";
import PitchAddons from "./PitchAddons";
import DropArea from "./DropArea";
import CompareImages from "./CompareImages";

export default function PitchComposer() {
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [isDragging, setIsDragging] = useState(false);

    const handleImageDrop = (file: File) => {
        setImageUrls([...imageUrls, URL.createObjectURL(file)]);
    };

    return (
        <DropArea setIsDragging={setIsDragging} onImageDrop={handleImageDrop}>
            <div className="w-full px-5 py-3 flex gap-3">
                <Avatar image="/random-pfps/pfp5.jpeg" />

                <div className="flex-1">
                    <div className="pt-3 font-mono">
                        <TextArea />

                        {isDragging && (
                            <div className="w-full aspect-video bg-card mt-3 rounded-md flex items-center justify-center font-serif text-foreground/50">
                                drop to attach
                            </div>
                        )}


                        {imageUrls.length == 2 ? (
                            <CompareImages imageUrls={imageUrls} />
                        ) : (imageUrls.length > 0 && imageUrls.map((image, i) => (
                            <ImagePreview key={i} src={image } />
                        )))}



                    </div>

                    <PitchAddons />
                </div>
            </div>
        </DropArea>
    );
}