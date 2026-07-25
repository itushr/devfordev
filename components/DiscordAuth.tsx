"use client";

import { ReactNode } from "react";

export default function DiscordAuth({ children }: { children: ReactNode }) {
  const handleDiscordLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent("http://localhost:3000/auth/discord/callback");
    const scope = encodeURIComponent("identify email"); // Read user profile + email

    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

    window.location.href = discordAuthUrl;
  };

  return (
    <div onClick={handleDiscordLogin} className="w-full h-full">
      { children }
    </div>
  );
}