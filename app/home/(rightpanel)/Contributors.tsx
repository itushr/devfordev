import { Button } from '@/components/ui/button'

const Contributors = () => {
    return (
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
    )
}

export default Contributors