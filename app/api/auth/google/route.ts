import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { parseRequestBody } from "@/utils/parseRequestBody";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { idToken } = await parseRequestBody(req);

    if (!idToken) {
      return NextResponse.json(
        { success: false, message: "Token is required." },
        { status: 400 }
      );
    }

    // 1. Fetch user info using Google's UserInfo API
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${idToken}` },
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired Google token." },
        { status: 401 }
      );
    }

    const payload = await userRes.json();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email not provided by Google." },
        { status: 400 }
      );
    }

    await connectDB();

    // 2. Find or create user in database
    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase() }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.avatar && picture) user.avatar = picture;
        await user.save();
      }
    } else {
      const baseUsername = name ? name.replace(/\s+/g, "").toLowerCase() : email.split("@")[0];
      const uniqueUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

      user = await User.create({
        email: email.toLowerCase(),
        username: uniqueUsername,
        googleId,
        avatar: picture,
        role: "user",
      });
    }

    // 3. Issue standard app JWT and cookie
    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Google login successful.",
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
    console.error("Google Auth Error:", error);

    return NextResponse.json(
      { success: false, message: "Google authentication failed." },
      { status: 500 }
    );
  }
}