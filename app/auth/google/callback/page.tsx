"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasCalledApi = useRef(false);

    useEffect(() => {
        const code = searchParams.get("code");

        if (!code) {
            alert("Something went wrong!");
            router.replace("/login");
            return;
        }

        if (hasCalledApi.current) return;
        hasCalledApi.current = true;

        async function authenticate() {
            try {
                const res = await fetch("/api/auth/google", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code }),
                });

                const data = await res.json();

                if (data.success) {
                    router.replace("/");
                    router.refresh();
                } else {
                    alert(data.message || "Google authentication failed.");
                    router.replace("/login");
                }
            } catch (err) {
                console.error(err);
                router.replace("/login");
            }
        }

        authenticate();
    }, [router, searchParams]);

    return (
        <div className="flex h-full w-full items-center justify-center">
            Authenticating with Google...
        </div>
    );
}