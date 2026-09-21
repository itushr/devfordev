"use client";

import { useRef, useState } from "react";

import Avatar from "../Avatar";
import TextArea from "./TextArea";
import PitchAddons from "./PitchAddons";
import DropArea from "./DropArea";
import Code from "./Code";
import Pole from "./Pole";
import Image from "./Image";
import { Sora } from "next/font/google"

const sora = Sora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800']
})

export default function PitchComposer() {
    const [isDragging, setIsDragging] = useState(false);

    return (
        <DropArea setIsDragging={setIsDragging}>
            <div className="w-full px-5 pt-3 flex gap-3">
                <Avatar image="/random-pfps/pfp5.jpeg" size={9} />

                <div className="flex-1">
                    <div className={`${sora.className} flex flex-col gap-3 pt-1 min-h-50 text-base`}>
                        <TextArea />

                        {isDragging && (
                            <div className="w-full aspect-video bg-card mt-3 rounded-md flex items-center justify-center font-serif text-foreground/50">
                                drop to attach
                            </div>
                        )}

                        <Image />
                        <Code />
                        <Pole />
                    </div>

                    <PitchAddons />
                </div>
            </div>
        </DropArea>
    );
}