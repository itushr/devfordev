"use client";

import { useEffect, useState } from "react";

export default function Avatar({
    image,
    size = 12,
}: {
    image?: string;
    size?: number;
}) {
    const [avatar, setAvatar] = useState<string | null>(image ?? null);

    useEffect(() => {
        if (image) {
            setAvatar(image);
        } else {
            const randomPfp = Math.floor(Math.random() * 4) + 1;
            setAvatar(`/random-pfps/pfp${randomPfp}.jpeg`);
        }
    }, [image]);

    return (
        <div
            className="rounded-full bg-card bg-cover bg-center shrink-0 border"
            style={{
                width: `${size * 4}px`,
                height: `${size * 4}px`,
                backgroundImage: avatar ? `url("${avatar}")` : undefined,
            }}
        />
    );
}