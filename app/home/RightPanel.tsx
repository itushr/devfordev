import Separator from '@/components/Separator'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

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

            <div className="h-100 border-y p-2">
                <div className="h-full w-full bg-background rounded-2xl"></div>
            </div>
            <Separator />
        </div>
    )
}

export default RightPanel