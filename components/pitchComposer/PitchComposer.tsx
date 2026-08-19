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
    const [imageCount, setImageCount] = useState<number>(0);
    const [hasPole, setHasPole] = useState<boolean>(false);
    const [hasCode, setHasCode] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState(false);

    const data = useRef({
        imagepreviews: [],
        poleoptions: [],
        codefiles: [],
    })

    return (
        <DropArea setIsDragging={setIsDragging} imagepreviews={data.current.imagepreviews} setImageCount={setImageCount}>
            <div className="w-full px-5 py-3 flex gap-3">
                <Avatar image="/random-pfps/pfp5.jpeg" />

                <div className="flex-1">
                    <div className="font-mono flex flex-col gap-3 pt-3">
                        <TextArea />

                        {isDragging && (
                            <div className="w-full aspect-video bg-card mt-3 rounded-md flex items-center justify-center font-serif text-foreground/50">
                                drop to attach
                            </div>
                        )}

                        {imageCount > 0 && <Image imagepreviews={data.current.imagepreviews} />}

                        {hasCode && <Code />}

                        {hasPole && <Pole />}
                    </div>

                    <PitchAddons data={data} setHasCode={setHasCode} setHasPole={setHasPole} setImageCount={setImageCount} />
                </div>
            </div>
        </DropArea>
    );
}