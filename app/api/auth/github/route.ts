import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Authorization code is required." },
        { status: 400 }
      );
    }

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      return NextResponse.json(
        { success: false, message: tokenData.error_description || "Invalid code." },
        { status: 400 }
      );
    }

    const profileRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": "Your-NextJS-App",
      },
    });

    if (!profileRes.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch GitHub profile." },
        { status: 400 }
      );
    }

    const profile = await profileRes.json();
    const githubId = String(profile.id);

    const email = profile.email || `${profile.login}@users.noreply.github.com`;

    await connectDB();

    let user = await User.findOne({
      $or: [{ githubId }, { email: email.toLowerCase() }],
    });

    if (user) {
      if (!user.githubId) {
        user.githubId = githubId;
        if (!user.avatar && profile.avatar_url) user.avatar = profile.avatar_url;
        await user.save();
      }
    } else {
      const baseUsername = profile.login || email.split("@")[0];
      const uniqueUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

      user = await User.create({
        email: email.toLowerCase(),
        username: uniqueUsername,
        githubId,
        avatar: profile.avatar_url,
        role: "user",
      });
    }

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "GitHub login successful.",
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
    console.error("GitHub Auth Error:", error);

    return NextResponse.json(
      { success: false, message: "GitHub authentication failed." },
      { status: 500 }
    );
  }
}