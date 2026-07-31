"use client"

import Sidebar from "@/components/Sidebar"
import HomeTab from "./(tabs)/HomeTab"
import { ReactNode, useState } from "react"
import ExploreTab from "./(tabs)/ExploreTab"
import NotificationTab from "./(tabs)/NotificationTab"
import ProfileTab from "./(tabs)/ProfileTab"
import SettingTab from "./(tabs)/SettingTab"
import BookmarkTab from "./(tabs)/BookmarksTab"

const tabMap: Record<"Home" | "Explore" | "Notification" | "Bookmarks" | "Profile" | "Setting", ReactNode> = {
  "Home": <HomeTab />,
  "Explore": <ExploreTab />,
  "Notification": <NotificationTab />,
  "Bookmarks": <BookmarkTab />,
  "Profile": <ProfileTab />,
  "Setting": <SettingTab />
}

const Home = () => {
  const [active, setActive] = useState<keyof typeof tabMap>("Home")

  return (
    <div className="w-full min-h-dvh flex">
      <Sidebar active={active} setActive={setActive} />
      <main className="flex-1">
        { tabMap[active] }
      </main>
    </div>
  )
}

export default Home