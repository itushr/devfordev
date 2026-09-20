import Avatar from "../Avatar"
import { Sora } from "next/font/google"
import Social from "./Social"
import { EllipsisVertical } from "lucide-react"

const sora = Sora({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800']
})

const PitchCard = () => {
    return (
        <>
            <div className="w-full bg-background px-5 py-3 flex gap-3">
                <div className="flex flex-col justify-end relative pb-0.5">
                    <Avatar size={9} />
                </div>
                <div className="flex-1">
                    {/* header */}
                    <div className="flex justify-between">
                        <div className="font-mono text-foreground/50 mb-1">Tushar ~ 14/07/2026 ~ 25 pts</div>
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

export default PitchCard