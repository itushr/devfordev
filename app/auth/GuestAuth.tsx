"use client";

import { ReactNode } from "react";

export default function GuestAuth({
    children,
    className = ""
}: {
    children: React.ReactNode;
    className: string
}) {
    const login = () => { };

    return (
        <div
            onClick={login}
            role="button"
            className={className}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                    login();
            }}>
            {children}
        </div>
    );
}