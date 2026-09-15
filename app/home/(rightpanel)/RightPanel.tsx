import Separator from '@/components/Separator'
import Searchbar from './Searchbar'
import AskForOpinions from './AskForOpinions'
import Trending from './Trending'
import Contributors from './Contributors'
import PostCTA from './PostCTA'

const RightPanel = () => {
    return (
        <div className="w-100 border-x sticky top-0 h-dvh">
            <Searchbar />
            <PostCTA />
            <Separator />
            <AskForOpinions />
            <Separator />
            <Trending />
            <Separator />
            <Contributors />
            <Separator />
        </div>
    )
}

export default RightPanel