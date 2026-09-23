import Separator from '@/components/Separator'
import Searchbar from './Searchbar'
import NetworkGraph from './NetworkGraph'
import Trending from './Trending'
import Contributors from './Contributors'

const RightPanel = () => {
    return (
        <div className="w-100 border-x sticky top-0 h-dvh">
            <Searchbar />
            <NetworkGraph />
            <Separator />
            <Trending />
            <Separator />
            <Contributors />
            <Separator />
        </div>
    )
}

export default RightPanel