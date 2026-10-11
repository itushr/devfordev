import Sidebar from "@/components/sidebar/Sidebar";
import NotificationPanel from "@/components/ActivitiesPanel";
import UserProfilePanel from "./UserProfilePanel";

export default function UserProfilePage() {
    return (
        <div className="w-full h-dvh flex">
            <Sidebar active={""} />
            <main className="flex-1 flex h-full overflow-auto scrollbar-thumb-border">
                <div className="w-full max-w-260 mx-auto h-fit flex justify-between">
                    <UserProfilePanel />
                </div>
                <NotificationPanel />
            </main>
        </div>
    );
}
