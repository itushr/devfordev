import Feed from "./Feed"
import { Roboto } from "next/font/google"
import PitchComposer from "@/components/pitchComposer/PitchComposer"
import Separator from "@/components/Separator"
import { ChevronRight } from "lucide-react"

const LeftPanel = () => {
    return (
        <div className="w-150 border pt-15">
            <div className={`z-10 h-15 w-149.5 bg-background/20 backdrop-blur-2xl border-b flex items-end px-5 gap-10 tracking-wide fixed top-0 text-md font-mono`}>
                <div className="pb-3 flex items-center gap-1 relative">
                    <ChevronRight size={15} />
                    For You
                </div>
                <div className="pb-3 text-muted-foreground">
                    Network
                </div>
                <div className="pb-3 text-muted-foreground">
                    Need Attention
                </div>
                <div className="pb-3 text-muted-foreground">
                    Recent
                </div>
            </div>
            {/* <PitchComposer />
            <Separator /> */}
            <Feed />
        </div>
    )
}

export default LeftPanel