import { Activity, Bookmark, EllipsisVertical, Flame, Heart, MessageCircle, Share2 } from "lucide-react"
import Avatar from "./Avatar"

const PitchCard = () => {
    return (
        <>
            <div className="w-full bg-background px-5 py-3 flex gap-3">
                <div>
                    <Avatar />
                </div>
                <div className="flex-1">
                    {/* header */}
                    <div className="mt-1 flex justify-between items-center">
                        <div className="flex-1">
                            <span>Tushar</span>
                            <span className="ml-2 text-foreground/50">@iamtushar</span>
                        </div>
                        <EllipsisVertical size={16} className="text-foreground/50 rounded-full cursor-pointer hover:text-foreground" />
                    </div>

                    {/* main */}
                    <div className="font-mono text-foreground/80">
                        <span>
                            hii there! i am using whatsapp
                        </span>
                        <div className="w-full aspect-video bg-card mt-3 rounded-md"></div>
                    </div>

                    {/* social */}
                    <div className="flex w-full mt-2 justify-between font-mono text-foreground/50 px-1">
                        <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer">
                            <MessageCircle size={15} />
                            <span className="text-xs">9</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer">
                            <Heart size={16} />
                            <span className="text-xs">46</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer">
                            <Flame size={17} />
                            <span className="text-xs">15</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer">
                            <Activity size={16} />
                            <span className="text-xs">9</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer">
                                <Bookmark size={16} />
                                {/* <span className="text-xs">51</span> */}
                            </div>
                            <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer">
                                <Share2 size={15} />
                                {/* <span className="text-xs">51</span> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PitchCard