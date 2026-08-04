"use client"

import Profile from "./Profile"
import Logo from "./Logo"
import Menu from "./Menu"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Sidebar = ({ active }: { active: string }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div
                className="border-r w-70 bg-background relative"
                style={{ display: isOpen ? "block" : "none" }}
            >
                <Logo />
                <Menu active={active} />
                <Profile />
                <div
                    className="size-10 bg-background rounded-full border absolute top-1/2 left-full -translate-1/2 flex items-center justify-center cursor-pointer group hover:border-muted-foreground"
                    onClick={() => setIsOpen(!isOpen)}>
                    <ChevronLeft size={28} className="text-border group-hover:text-muted-foreground -ml-1" />
                </div>
            </div>
            <div
                className="w-13 border-r h-dvh sticky top-0"
                style={{ display: isOpen ? "none" : "block" }}
            >
                <div
                    className="size-10 bg-background rounded-full border absolute top-1/2 left-full -translate-1/2 flex items-center justify-center cursor-pointer group hover:border-muted-foreground"
                    onClick={() => setIsOpen(!isOpen)}>
                    <ChevronRight size={28} className="text-border group-hover:text-muted-foreground" />
                </div>
            </div>
        </>
    )
}

export default Sidebar