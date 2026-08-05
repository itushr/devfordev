import Separator from '@/components/Separator'
import { Button } from '@/components/ui/button'
import { Link, Search } from 'lucide-react'

const RightPanel = () => {
    return (
        <div className="w-100 border-x sticky top-0 h-dvh">
            <div className="h-15 flex items-center px-5">
                <div className="flex items-center border px-5 py-2 rounded-full gap-2 w-full">
                    <div>
                        <Search size={15} />
                    </div>
                    <input placeholder="search" className="w-full outline-none" />
                </div>
            </div>

            <div className="border-y px-10 py-5">
                <Button className="w-full rounded-full">Ask for opinions</Button>
            </div>
            <Separator />

            <div className="border-y p-5">
                <p className="text-lg">Trending Today</p>
                <div className="flex flex-wrap gap-2 mt-3">
                    <div className="flex items-center gap-x-2 group cursor-pointer">
                        <div className="text-blue-500 group-hover:underline">#react</div>
                        <div className="text-xs text-foreground/70">(432)</div>
                    </div>
                    <div className="flex items-center gap-x-2 group cursor-pointer">
                        <div className="text-blue-500 group-hover:underline">#nextjs</div>
                        <div className="text-xs text-foreground/70">(432)</div>
                    </div>
                    <div className="flex items-center gap-x-2 group cursor-pointer">
                        <div className="text-blue-500 group-hover:underline">#typescript</div>
                        <div className="text-xs text-foreground/70">(432)</div>
                    </div>
                    <div className="flex items-center gap-x-2 group cursor-pointer">
                        <div className="text-blue-500 group-hover:underline">#programming</div>
                        <div className="text-xs text-foreground/70">(432)</div>
                    </div>
                    <div className="flex items-center gap-x-2 group cursor-pointer">
                        <div className="text-blue-500 group-hover:underline">#epress</div>
                        <div className="text-xs text-foreground/70">(432)</div>
                    </div>
                    <div className="flex items-center gap-x-2 group cursor-pointer">
                        <div className="text-blue-500 group-hover:underline">#gitngithub</div>
                        <div className="text-xs text-foreground/70">(432)</div>
                    </div>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                    <div className="flex items-center gap-x-2 hover:text-muted-foreground cursor-pointer">
                        <Link size={12} />
                        <div className="">devfordev.bytushar.in</div>
                        <div className="text-muted-foreground">by @iamtushar</div>
                    </div>
                    <div className="flex items-center gap-x-2 hover:text-muted-foreground cursor-pointer">
                        <Link size={12} />
                        <div className="">termix.ai</div>
                        <div className="text-muted-foreground">by @chintubadmash</div>
                    </div>
                    <div className="flex items-center gap-x-2 hover:text-muted-foreground cursor-pointer">
                        <Link size={12} />
                        <div className="">iamtushar.in</div>
                        <div className="text-muted-foreground">by @tushar14</div>
                    </div>
                </div>
            </div>
            <Separator />

            <div className="border-y p-5">
                <p className="text-lg">Todays Contributors</p>
                <div className="flex flex-col gap-5 mt-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-x-3 cursor-pointer">
                            <div className="size-12 bg-card rounded-full"></div>
                            <div>
                                <p>Tushar <span className="text-muted-foreground text-sm">@iamtushar</span></p>
                                <p className="text-sm"><span className="text-xs">12</span> contributions</p>
                            </div>
                        </div>
                        <Button className="rounded-full text-sm px-5 py-4">Follow</Button>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-x-3 cursor-pointer">
                            <div className="size-12 bg-card rounded-full"></div>
                            <div>
                                <p>Tushar <span className="text-muted-foreground text-sm">@iamtushar</span></p>
                                <p className="text-sm"><span className="text-xs">12</span> contributions</p>
                            </div>
                        </div>
                        <Button className="rounded-full text-sm px-5 py-4">Follow</Button>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-x-3 cursor-pointer">
                            <div className="size-12 bg-card rounded-full"></div>
                            <div>
                                <p>Tushar <span className="text-muted-foreground text-sm">@iamtushar</span></p>
                                <p className="text-sm"><span className="text-xs">12</span> contributions</p>
                            </div>
                        </div>
                        <Button className="rounded-full text-sm px-5 py-4">Follow</Button>
                    </div>
                </div>
            </div>
            <Separator />
        </div>
    )
}

export default RightPanel