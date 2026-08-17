"use client";

import { useEffect, useState } from "react";

export default function Avatar({
    image,
}: {
    image?: string;
}) {
    const [avatar, setAvatar] = useState<string | null>(image ?? null);

    useEffect(() => {
        if (!image) {
            const randomPfp = Math.floor(Math.random() * 4) + 1;
            setAvatar(`/random-pfps/pfp${randomPfp}.jpeg`);
        }
    }, [image]);

    return (
        <div
            className="size-12 bg-card rounded-full bg-cover bg-center"
            style={{
                backgroundImage: avatar
                    ? `url("${avatar}")`
                    : undefined,
            }}
        />
    );
}