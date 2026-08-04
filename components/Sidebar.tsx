import { ChevronRight, MoreHorizontal } from "lucide-react"

const options = [
    {
        text: "Home"
    },
    {
        text: "Explore"
    },
    {
        text: "Notification"
    },
    {
        text: "Bookmarks"
    },
    {
        text: "Profile"
    },
    {
        text: "Setting"
    }
]

const Sidebar = ({ active, setActive }: { active: string, setActive: any }) => {
    return (
        <div className="border-r w-70 bg-background relative">
            <div className="px-5 h-15 flex items-center text-xl font-mono font-semibold border-b">#devfordev</div>
            <div className="px-5 py-5 flex flex-col hover:text-foreground/50">
                {
                    options.map((item, index) => (
                        <div key={index} onClick={() => setActive(item.text)} className="py-2 px-7 flex relative gap-2 font-mono tracking-wide hover:text-foreground cursor-pointer font-semibold">
                            {item.text == active &&
                                <div className="absolute left-0">
                                    <ChevronRight />
                                </div>}
                            {item.text}
                        </div>
                    ))
                }
            </div>
            <div className="absolute bottom-0 border-t w-full px-5 py-3 flex gap-3 items-center">
                <div className="size-15 bg-card rounded-full"></div>
                <div className="flex-1 flex flex-col justify-center">
                    <p>Tushar</p>
                    <p className="text-foreground/70">@iamtushar</p>
                </div>
                <div className="hover:bg-card p-2 rounded-full cursor-pointer">
                    <MoreHorizontal size={15} />
                </div>
            </div>
        </div>
    )
}

export default Sidebar