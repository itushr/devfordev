import { Activity, Bookmark, Flame, Heart, MessageCircle, Send } from "lucide-react"

export default function Social() {
    const interactions = [
        { icon: <Flame size={17} />, count: 9 },
        { icon: <Heart size={16} />, count: 46 },
        { icon: <MessageCircle size={15} />, count: 15 },
        { icon: <Activity size={16} />, count: 9 },
        { icon: <Bookmark size={16} />, count: 10 },
        { icon: <Send size={15} />, count: 12 },
    ];

    return (
        <div className="flex w-full mt-2 justify-between font-mono text-foreground/50 border rounded-md px-2">
            <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer py-1.5 flex-1">iamtushar</div>
            <div className="flex gap-5 pr-1">
                {interactions.map((interaction, index) => (
                    <div key={index} className={`flex items-center gap-2 hover:text-pink-500 cursor-pointer py-2 flex-1 justify-center`}>
                        {interaction.icon}
                        <span className="text-xs">{interaction.count}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}