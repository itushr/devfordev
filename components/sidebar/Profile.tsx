import { MoreHorizontal } from 'lucide-react'

const Profile = () => {
    return (
        <div className="absolute bottom-0 border-t w-full px-5 py-3 flex gap-3 items-center">
            <div className="size-15 bg-card rounded-full"></div>
            <div className="flex-1 flex flex-col justify-center">
                <p>Tushar</p>
                <p className="text-foreground/70">@iamtushar</p>
            </div>
            <div className="hover:bg-card p-2 rounded-full cursor-pointer">
                <MoreHorizontal size={15} />
            </div>
        </div>
    )
}

export default Profile