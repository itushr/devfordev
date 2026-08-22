import PitchCard from "@/components/PitchCard"
import Separator from "@/components/Separator"
import { Calendar, Link, Star } from "lucide-react"
import { Elsie, Roboto } from "next/font/google"

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
    display: 'swap'
})

const elsie = Elsie({
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

            <div>
                <div className="flex">
                    <div className="p-5">
                        <div
                            className="size-32 border rounded-full bg-cover flex items-end justify-center"
                            style={{ backgroundImage: "url('/random-pfps/pfp5.jpeg')" }}
                        >
                            <div className="bg-foreground text-background w-fit flex items-center px-3 py-0.5 gap-0.5 rounded-2xl translate-y-2 border">
                                <span className="text-xs font-bold">5</span>
                                <Star size={10} className="fill-background" />
                            </div>
                        </div>
                        <div className="mt-5">
                            <p className="text-center text-lg">Tushar</p>
                            <p className="-mt-1 text-foreground/70 text-center">@iamtushar</p>
                        </div>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between border-l pl-5">
                        <pre className="font-mono whitespace-pre-wrap text-[16px]">
                            I code | break things | reapeat <br />
                            building devfordev...
                        </pre>

                        <div className="flex gap-5 text-foreground/80">
                            <div className="flex gap-2 items-center group">
                                <Link size={15} />
                                <span className="text-blue-500 group-hover:underline cursor-pointer">iamtushar.in</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Calendar size={15} />
                                <span className="text-sm mt-1">21 Aug 2026</span>
                            </div>
                        </div>

                        <div className="flex gap-10">
                            {[...Array(4).keys()].map((_, i) => (
                                <div key={i}>
                                    <div className={`${elsie.className} text-3xl text-center`}>{26 + i * 4}</div>
                                    <div className="text-sm text-foreground/80 text-center">followers</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
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