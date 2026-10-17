import { cookies } from "next/headers";
import { generateToken, verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET() {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return Response.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const payload = verifyToken(token);

        const user = await User.findOne({
            _id: payload.id
        });

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { getUserContributionMetrics } = await import("@/lib/feed/contributions");
        const metrics = await getUserContributionMetrics(user._id.toString());

        const response = NextResponse.json({
            success: true,
            message: "Auto Login successful.",
            payload: {
                id: user._id.toString(),
                name: user.name,
                avatar: user.avatar,
                username: user.username,
                email: user.email,
                contributions: metrics.totalReceived,
                description: user.description,
                createdAt: user.createdAt,
            }
        });

        const newToken = generateToken({
            id: user._id.toString(),
            role: user.role,
        });

        response.cookies.set({
            name: "token",
            value: newToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        return response;
    } catch {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}