import { Verified } from "lucide-react"
import Separator from "./Separator"

const Pitch = () => {
    return (
        <>
            <div className="w-full border-y bg-background p-5 flex gap-2">
                <div>
                    <div className="size-14 bg-card rounded-full"></div>
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
                    <div className="flex"></div>
                </div>
            </div>
            <Separator />
        </>
    )
}

export default Pitch