import PitchCard from '@/components/PitchCard'
import Separator from '@/components/Separator'

const Feed = () => {
    return (
        <div>
            {[...Array(7).keys()].map((_, i) => (
                <div key={i}>
                    <PitchCard />
                    <Separator />
                </div>
            ))}
        </div>
    )
}

export default Feed