import { MoreHorizontal } from 'lucide-react'
import Avatar from '../Avatar'

const Profile = () => {
    return (
        <div className="absolute bottom-0 border-t w-full px-5 py-3 flex gap-3 items-center">
            <Avatar image="/random-pfps/pfp5.jpeg" />
            
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