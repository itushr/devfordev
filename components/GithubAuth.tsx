"use client";

import { ReactNode } from "react";

export default function GitHubAuth({ children }: { children: ReactNode }) {
  const handleGitHubLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

    if (!clientId) {
      console.error("Missing NEXT_PUBLIC_GITHUB_CLIENT_ID environment variable.");
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      scope: "read:user", 
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  };

  return (
    <div
      onClick={handleGitHubLogin}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleGitHubLogin();
      }}
    >
      {children}
    </div>
  );
}