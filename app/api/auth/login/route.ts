import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { compareHash } from "@/lib/bcryptjs";
import { loginSchema } from "@/validations/auth";
import { parseRequestBody } from "@/utils/parseRequestBody";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const body = await parseRequestBody(req);

        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { login, password } = result.data;

        await connectDB();

        const user = await User.findOne({
            $or: [
                { email: login.toLowerCase() },
                { username: login.toLowerCase() },
            ],
        });

        if (!user || !user.password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid credentials.",
                },
                { status: 401 }
            );
        }

        const passwordMatched = await compareHash(
            password,
            user.password
        );

        if (!passwordMatched) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid credentials.",
                },
                { status: 401 }
            );
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
            maxAge: 60 * 60 * 24 * 30,
        });

        return response;
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error.",
            },
            { status: 500 }
        );
    }
}