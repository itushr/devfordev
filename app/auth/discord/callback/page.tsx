"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DiscordCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasCalledApi = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      alert("No authorization code returned from Discord.");
      router.push("/login");
      return;
    }

    if (hasCalledApi.current) return;
    hasCalledApi.current = true;

    async function authenticate() {
      try {
        const res = await fetch("/api/auth/discord", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (data.success) {
          router.replace("/");
          router.refresh();
        } else {
          alert(data.message || "Discord authentication failed.");
          router.push("/login");
        }
      } catch (error) {
        console.error("Discord Auth Error:", error);
        alert("Something went wrong during Discord authentication.");
        router.push("/login");
      }
    }

    authenticate();
  }, [searchParams, router]);

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <p>Authenticating with Discord, please wait...</p>
    </div>
  );
}