import PitchCard from "@/components/PitchCard"
import Separator from "@/components/Separator"
import { Roboto } from "next/font/google"

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
    display: 'swap'
})

const LeftPanel = () => {
    return (
        <div className="w-150 border-x min-h-dvh">
            <div className="h-15 border-b font-mono flex px-5 items-center text-foreground/50">
                iamtushar@devfordev ~ %
            </div>

            <div className="h-64">
                
            </div>

            <Separator />

            <div className={`z-10 h-15 w-149.5 bg-background/20 backdrop-blur-2xl border-b flex items-end px-5 gap-10 tracking-wide ${roboto.className}`}>
                <div className="pb-3 relative">
                    pitches
                    <div className="h-1 w-full bg-pink-500 absolute bottom-0 rounded-full"></div>
                </div>
                <div className="pb-3 text-muted-foreground">
                    contributions
                </div>
                <div className="pb-3 text-muted-foreground">
                    replies
                </div>
                <div className="pb-3 text-muted-foreground">
                    likes
                </div>
                <div className="pb-3 text-muted-foreground">
                    media
                </div>
                <div className="pb-3 text-muted-foreground">
                    analytics
                </div>
            </div>

            <div>
                {[...Array(7).keys()].map((_, i) => (
                    <div key={i}>
                        <PitchCard />
                        <Separator />
                    </div>
                ))}
                <div className="h-15 flex justify-center items-center text-foreground/50">
                    $end
                </div>
            </div>
        </div >
    )
}

export default LeftPanel