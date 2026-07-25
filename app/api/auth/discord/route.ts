import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Authorization code missing." },
        { status: 400 }
      );
    }

    const bodyParams = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: "http://localhost:3000/auth/discord/callback",
    });

    const tokenRes = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: bodyParams.toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      return NextResponse.json(
        { success: false, message: tokenData.error_description || "Invalid Discord code." },
        { status: 400 }
      );
    }

    const userRes = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch Discord profile." },
        { status: 400 }
      );
    }

    const discordUser = await userRes.json();
    const discordId = String(discordUser.id);
    
    const avatar = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordId}/${discordUser.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${Number(discordUser.discriminator || 0) % 5}.png`;

    const email = discordUser.email 
      ? discordUser.email.toLowerCase() 
      : `${discordUser.username}@users.noreply.discord.com`;

    await connectDB();

    let user = await User.findOne({
      $or: [{ discordId }, { email }],
    });

    if (user) {
      if (!user.discordId) {
        user.discordId = discordId;
        if (!user.avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      const baseUsername = discordUser.global_name || discordUser.username;
      const uniqueUsername = `${baseUsername.replace(/\s+/g, "_").toLowerCase()}_${Math.floor(1000 + Math.random() * 9000)}`;

      user = await User.create({
        email,
        username: uniqueUsername,
        discordId,
        avatar,
        role: "user",
      });
    }

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Discord login successful.",
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("Discord Auth Error:", error);
    return NextResponse.json(
      { success: false, message: "Discord authentication failed." },
      { status: 500 }
    );
  }
}