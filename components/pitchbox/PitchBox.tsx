"use client"

import { CodeXml, Command, CornerDownLeft, HatGlasses, Image, Link, List, SlidersHorizontal } from "lucide-react"
import Separator from "../Separator"
import TextArea from "./TextArea"
import { useState } from "react"

export default function PitchBox() {
    return (
        <>
            <div className="w-full bg-background p-5 pb-1 flex gap-3">
                <div>
                    <div className="size-14 bg-card rounded-full"></div>
                </div>
                <div className="flex-1">
                    {/* header */}
                    {/* <div className="mt-1">
                        <span>Tushar</span>
                        <span className="ml-2 text-foreground/50">@iamtushar</span>
                    </div> */}

                    {/* main */}
                    <div className="pt-3 font-mono">
                        <TextArea />
                    </div>

                    {/* actions */}
                    <div className="border-t mt-5 py-2 flex justify-between items-center text-foreground/80">
                        <div className="flex gap-3">
                            <Image size={18} className="hover:text-pink-500 cursor-pointer" />
                            <CodeXml size={18} className="hover:text-pink-500 cursor-pointer" />
                            <Link size={15} className="hover:text-pink-500 cursor-pointer" />
                            <List size={18} className="hover:text-pink-500 cursor-pointer" />
                            <HatGlasses size={18} className="hover:text-pink-500 cursor-pointer" />
                            <SlidersHorizontal size={18} className="hover:text-pink-500 cursor-pointer" />
                        </div>
                        <div className="flex gap-1 border rounded-sm px-2 py-1 hover:text-pink-500 cursor-pointer">
                            <Command size={14} />
                            <CornerDownLeft size={14} />
                        </div>
                    </div>
                </div>
            </div>
            <Separator />
        </>
    )
}