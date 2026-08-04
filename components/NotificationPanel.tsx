"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const NotificationPanel = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div
                className="border-l w-70 bg-background sticky top-0 h-dvh font-mono"
                style={{ display: isOpen ? "block" : "none" }}>
                <div className="h-15 border-b flex items-center px-5">
                    Notifications
                </div>
                <div
                    className="size-10 bg-background rounded-full border absolute top-1/2 -translate-1/2 flex items-center justify-center cursor-pointer group hover:border-muted-foreground"
                    onClick={() => setIsOpen(!isOpen)}>
                    <ChevronRight size={28} className="text-border group-hover:text-muted-foreground" />
                </div>
            </div>
            <div
                className="w-10 border-l h-dvh sticky top-0"
                style={{ display: isOpen ? "none" : "block" }}
            >
                <div
                    className="size-10 bg-background rounded-full border absolute top-1/2 -translate-1/2 flex items-center justify-center cursor-pointer group hover:border-muted-foreground"
                    onClick={() => setIsOpen(!isOpen)}>
                    <ChevronLeft size={28} className="text-border group-hover:text-muted-foreground -ml-1" />
                </div>
            </div>
        </>
    )
}

export default NotificationPanel