import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import User from "@/models/User";
import { parseRequestBody } from "@/utils/parseRequestBody";

const oauth2Client = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export async function POST(req: Request) {
  try {
    const { code } = await parseRequestBody(req);

    if (!code) {
      return NextResponse.json({ success: false, message: "Code required" }, { status: 400 });
    }

    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: "postmessage"
    });

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const { sub: googleId, email, name, picture } = payload;

    await connectDB();

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

    const token = generateToken({ id: user._id.toString(), role: user.role });
    const response = NextResponse.json({ success: true, message: "Login successful" });

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
    return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 500 });
  }
}