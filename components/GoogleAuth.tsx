"use client";

import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

function GoogleAuthTrigger({ children }: { children: ReactNode }) {
    const router = useRouter();
    const loginWithGoogle = useGoogleLogin({
        flow: "implicit",
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch("/api/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken: tokenResponse.access_token }),
                });

                const data = await res.json();

                if (data.success) {
                    router.push("/");
                    router.refresh();
                } else {
                    alert(data.message || "Google Authentication failed");
                }
            } catch (error) {
                console.error("Authentication Request Failed:", error);
                alert("Something went wrong! Please try again!");
            }
        },
        onError: (errorResponse) => {
            console.error("Google Login Failed:", errorResponse);
        },
    });

    return (
        <div
            onClick={() => loginWithGoogle()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") loginWithGoogle();
            }}
        >
            {children}
        </div>
    );
}

export default function GoogleAuth({ children }: { children: ReactNode }) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
        console.error("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID in environment variables.");
        return null;
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleAuthTrigger>{children}</GoogleAuthTrigger>
        </GoogleOAuthProvider>
    );
}