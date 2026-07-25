"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GitHubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasCalledApi = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      alert("No authorization code provided by GitHub.");
      router.push("/login");
      return;
    }

    if (hasCalledApi.current) return;
    hasCalledApi.current = true;

    async function authenticate() {
      try {
        const res = await fetch("/api/auth/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (data.success) {
          router.replace("/");
          router.refresh();
        } else {
          alert(data.message || "GitHub authentication failed.");
          router.push("/login");
        }
      } catch (error) {
        console.error("GitHub Auth Error:", error);
        alert("Something went wrong! Please try again.");
        router.push("/login");
      }
    }

    authenticate();
  }, [searchParams, router]);

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <p>Authenticating with GitHub, please wait...</p>
    </div>
  );
}