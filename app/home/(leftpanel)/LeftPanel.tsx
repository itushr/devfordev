import Feed from "./Feed"
import { ChevronDown, ChevronRight } from "lucide-react"

const LeftPanel = () => {
    return (
        <div className="w-150 border pt-15">
            <div className={`z-10 h-15 w-149.5 bg-background/20 backdrop-blur-2xl border-b flex justify-between items-center px-5 gap-10 tracking-wide fixed top-0 text-md font-mono`}>
                <div className="h-15 font-mono flex items-center text-foreground/50">
                    iamtushar@devfordev ~ %
                </div>
                <div className="flex items-center gap-1 text-foreground/70">
                    <span>for you</span>
                    <ChevronDown size={15} />
                </div>
            </div>
            <Feed />
        </div>
    )
}

export default LeftPanel