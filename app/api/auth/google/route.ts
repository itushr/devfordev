import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";

import User from "@/models/User";

import { parseRequestBody } from "@/utils/parseRequestBody";
import { generateUsername } from "@/utils/generateUsername";

const oauth2Client = new OAuth2Client(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

export async function POST(req: Request) {
    try {
        const { code } = await parseRequestBody(req);

        if (!code) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authorization code is required.",
                },
                { status: 400 }
            );
        }

        const { tokens } = await oauth2Client.getToken({
            code,
            redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
        });

        if (!tokens.id_token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to retrieve Google ID token.",
                },
                { status: 400 }
            );
        }

        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Google account.",
                },
                { status: 400 }
            );
        }

        const {
            sub: googleId,
            email,
            name,
            picture,
        } = payload;

        if (!googleId || !email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Google account is missing required information.",
                },
                { status: 400 }
            );
        }

        await connectDB();

        let user = await User.findOne({
            $or: [
                { googleId },
                { email: email.toLowerCase() },
            ],
        });

        if (user) {
            let updated = false;

            if (!user.googleId) {
                user.googleId = googleId;
                updated = true;
            }

            if (!user.avatar && picture) {
                user.avatar = picture;
                updated = true;
            }

            if (!user.name && name) {
                user.name = name;
                updated = true;
            }

            if (updated) {
                await user.save();
            }
        } else {
            user = await User.create({
                name,
                email: email.toLowerCase(),
                username: generateUsername({
                    name,
                    email,
                }),
                googleId,
                avatar: picture,
                role: "user",
            });
        }

        const token = generateToken({
            id: user._id.toString(),
            role: user.role,
        });

        const response = NextResponse.json({
            success: true,
            message: "Login successful.",
        });

        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return response;
    } catch (error) {
        console.error("Google Auth Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Google authentication failed.",
            },
            { status: 500 }
        );
    }
}