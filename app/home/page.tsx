"use client";

import Sidebar from "@/components/sidebar/Sidebar"
import LeftPanel from "./(leftpanel)/LeftPanel"
import RightPanel from "./(rightpanel)/RightPanel"
import NotificationPanel from "@/components/ActivitiesPanel"
import { useState } from "react"
import PitchComposer from "@/components/pitchComposer/PitchComposer";
import Terminal from "@/components/Ternimal";

const Home = () => {
    const [showComposer, setShowComposer] = useState<boolean>(true);

    return (
        <div className="w-full h-dvh flex">
            <Sidebar active={"Home"} />
            <main className="flex-1 flex h-full overflow-auto scrollbar-thumb-border">
                <div className='w-full max-w-260 mx-auto h-fit flex justify-between'>
                    <LeftPanel />
                    <RightPanel />
                </div>
                <NotificationPanel />
            </main>
            {showComposer && <div className="absolute top-0 left-0 min-h-dvh w-full z-20 bg-background/10 flex items-center justify-center backdrop-blur ">
                <Terminal onClose={() => setShowComposer((prev) => !prev)}>
                    <PitchComposer />
                </Terminal>
            </div>}
        </div>
    )
}

export default Home