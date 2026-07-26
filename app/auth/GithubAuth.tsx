"use client"

import { ReactNode } from "react";

export default function GitHubAuth({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className: string
}) {
  const login = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

    if (!clientId) {
      console.error("Auth Error: Github client ID missing!");
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
      onClick={login}
      role="button"
      className={className}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") login();
      }}
    >
      {children}
    </div>
  );
}