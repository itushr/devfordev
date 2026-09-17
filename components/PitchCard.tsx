import { Activity, Bookmark, EllipsisVertical, Flame, Heart, MessageCircle, Send, Share2 } from "lucide-react"
import Avatar from "./Avatar"
import { Sora } from "next/font/google"

const sora = Sora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800']
})

const PitchCard = () => {
    return (
        <>
            <div className="w-full bg-background px-5 py-3 flex gap-3">
                <div className="flex flex-col justify-end relative">
                    <Avatar size={9} />
                </div>
                <div className="flex-1">
                    {/* header */}
                    <div className="flex justify-between">
                        {/* <div className="flex gap-2 font-mono">
                            <span className="text-foreground/90">by Tushar</span>
                            <span className="text-foreground/50">@iamtushar</span>
                        </div> */}
                        <div className="font-mono text-foreground/50 mb-1">@iamtushar Tushar ~ 25 pts</div>
                        <EllipsisVertical size={16} className="text-foreground/50 rounded-full cursor-pointer hover:text-foreground" />
                    </div>
                    {/* main */}
                    <div className={`${sora.className} text-foreground/90`}>
                        <span>
                            Hii there! I am using whatsapp
                        </span>
                        <div className="w-full aspect-video bg-card mt-2 rounded-md"></div>
                    </div>

                    <Social />
                </div>
            </div>
        </>
    )
}

const Social = () => {
    const interactions = [
        { icon: <Flame size={17} />, count: 9 },
        { icon: <Heart size={16} />, count: 46 },
        { icon: <MessageCircle size={15} />, count: 15 },
        { icon: <Activity size={16} />, count: 9 },
        { icon: <Send size={15} />, count: 12 },
        { icon: <Bookmark size={16} />, count: 12 },

    ];

    return (
        <div className="flex w-full mt-2 justify-between font-mono text-foreground/50 rounded-md border">
            {interactions.map((interaction, index) => (
                <div key={index} className={`flex items-center gap-2 hover:text-pink-500 cursor-pointer ${index !== interactions.length-1 && "border-r"} py-2 flex-1 justify-center`}>
                    {interaction.icon}
                    <span className="text-xs">{interaction.count}</span>
                </div>
            ))}
        </div>
    )
}

export default PitchCard