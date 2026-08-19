"use client";

import { useRef, useState } from "react";

import Avatar from "../Avatar";
import TextArea from "./TextArea";
import PitchAddons from "./PitchAddons";
import DropArea from "./DropArea";
import Code from "./Code";
import Pole from "./Pole";
import Image from "./Image";

export default function PitchComposer() {
    const [hasImage, setHasImage] = useState<boolean>(false);
    const [hasPole, setHasPole] = useState<boolean>(false);
    const [hasCode, setHasCode] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState(false);

    //to be fixed
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

                        {hasImage && <Image />}

                        {hasCode && <Code />}

                        {hasPole && <Pole />}
                    </div>

                    <PitchAddons setHasCode={setHasCode} setHasPole={setHasPole} />
                </div>
            </div>
        </DropArea>
    );
}