import Sidebar from "@/components/sidebar/Sidebar"
import LeftPanel from "./LeftPanel"
import RightPanel from "./RightPanel"

const Home = () => {
    return (
        <div className="w-full h-dvh flex">
            <Sidebar active={"Home"} />
            <main className="flex-1 h-full overflow-auto scrollbar-thumb-border">
                <div className='w-full max-w-260 mx-auto h-fit flex justify-between'>
                    <LeftPanel />
                    <RightPanel />
                </div>
            </main>
        </div>
    )
}

export default Home