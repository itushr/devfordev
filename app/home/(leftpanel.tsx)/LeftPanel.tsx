import Feed from "./Feed"
import { Roboto } from "next/font/google"

const roboto = Roboto({
    weight: '500',
    subsets: ['latin'],
    display: 'swap'
})

const LeftPanel = () => {
    return (
        <div className="w-150 border pt-15">
            <div className={`h-15 w-150 bg-background/20 backdrop-blur-2xl border-b flex items-end px-5 gap-10 tracking-wide fixed top-0 text-md ${roboto.className}`}>
                <div className="pb-3 relative">
                    For You
                    <div className="h-1 w-full bg-pink-500 absolute bottom-0 rounded-full"></div>
                </div>
                <div className="pb-3 text-muted-foreground">
                    Network
                </div>
                <div className="pb-3 text-muted-foreground">
                    Needs You
                </div>
                <div className="pb-3 text-muted-foreground">
                    Recent
                </div>
            </div>
            <Feed />
        </div>
    )
}

export default LeftPanel