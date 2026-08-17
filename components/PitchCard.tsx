import { Bookmark, Brain, Code, CodeXml, Heart, MessageCircle, Share, Share2, Verified } from "lucide-react"
import Avatar from "./Avatar"

const Pitch = () => {
    return (
        <>
            <div className="w-full bg-background p-5 flex gap-2">
                <div>
                    <Avatar />
                </div>
                <div className="flex-1">
                    {/* header */}
                    <div className="mt-1">
                        <span>Tushar</span>
                        <span className="ml-2 text-foreground/50">@iamtushar</span>
                    </div>

                    {/* main */}
                    <div className="">
                        <span>
                            I want a brutal honest opinion on ui.
                        </span>
                        <div className="w-full aspect-video bg-card mt-3 rounded-md"></div>
                    </div>

                    {/* social */}
                    <div className="flex w-full mt-2 justify-between">
                        <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                            <CodeXml size={16} />
                            <span className="text-sm">15</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                            <Heart size={16} />
                            <span className="text-sm">46</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                            <MessageCircle size={16} />
                            <span className="text-sm">9</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                                <Bookmark size={16} />
                                <span className="text-sm">51</span>
                            </div>
                            <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                                <Share2 size={15} />
                                <span className="text-sm">51</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Pitch