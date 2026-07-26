"use client";

import { ReactNode } from "react";

export default function DiscordAuth({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className: string
}) {
  const login = () => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!);
    const scope = encodeURIComponent("identify email");

    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

    window.location.href = discordAuthUrl;
  };

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