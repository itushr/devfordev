import Avatar from "../Avatar"
import { Sora } from "next/font/google"
import Social from "./Social"
import { EllipsisVertical } from "lucide-react"

const sora = Sora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800']
})

const Skeleton = () => {
    return (
        <>
            <div className="w-full bg-background px-5 py-3 flex gap-3">
                <div className="flex flex-col justify-end relative pb-0.5">
                    <div className="size-9 bg-card rounded-full bg-cover bg-center" />
                </div>
                <div className="flex-1">
                    {/* header */}
                    <div className="flex justify-between">
                        <div className="font-mono text-transparent mb-1 bg-card">Author ~ XX/XX/XXXX ~ XX pts</div>
                        <EllipsisVertical size={16} className="text-foreground/50 rounded-full cursor-pointer hover:text-foreground" />
                    </div>
                    {/* main */}
                    <div className={`${sora.className} text-transparent`}>
                        <span className="bg-card pb-1">
                            Please wait while we are personalizing your feed!
                        </span>
                        <div className="w-full h-60 bg-card mt-2 rounded-md"></div>
                    </div>

                    <div className="bg-card h-9 mt-2 rounded-md"></div>
                </div>
            </div>
        </>
    )
}

export default Skeleton