import { ChevronRight } from "lucide-react"

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
        <div className="border-r w-70 bg-background">
            <div className="px-5 py-5 text-xl font-mono font-semibold border-b">#devfordev</div>
            <div className="px-5 py-5 flex flex-col hover:text-foreground/50">
                {
                    options.map((item, index) => (
                        <div key={index} onClick={() => setActive(item.text)} className="py-2 flex gap-2 font-mono tracking-wide hover:text-foreground cursor-pointer font-semibold">
                            <div className="text-transparent" style={{ color: item.text === active ? "var(--foreground)" : "" }}>
                                <ChevronRight />
                            </div>
                            {item.text}
                        </div>
                    ))
                }
            </div>
            <div>
                <div></div>
            </div>
        </div>
    )
}

export default Sidebar