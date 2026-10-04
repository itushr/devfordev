import Sidebar from "@/components/sidebar/Sidebar";
import LeftPanel from "./(leftpanel)/LeftPanel";
import RightPanel from "./(rightpanel)/RightPanel";
import NotificationPanel from "@/components/ActivitiesPanel";
import PitchComposerModel from "@/components/pitchComposer/PitchComposerModel";

export default async function PostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <div className="w-full h-dvh flex">
            <Sidebar active={"Home"} />
            <main className="flex-1 flex h-full overflow-auto scrollbar-thumb-border">
                <div className="w-full max-w-260 mx-auto h-fit flex justify-between">
                    <LeftPanel slug={slug} />
                    <RightPanel />
                </div>
                <NotificationPanel />
            </main>
            <PitchComposerModel />
        </div>
    );
}