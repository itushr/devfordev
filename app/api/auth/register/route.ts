import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import { generateHash } from "@/lib/bcryptjs";
import { registerSchema } from "@/validations/auth";
import { parseRequestBody } from "@/utils/parseRequestBody";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const body = await parseRequestBody(req);

        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { name, email, password } = result.data;

        await connectDB();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email is already registered.",
                },
                { status: 409 }
            );
        }

        const hashedPassword = await generateHash(password);

        const username = email.split("@")[0];

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            username,
        });

        const token = generateToken({
            id: user._id.toString(),
            role: user.role,
        });

        const response = NextResponse.json({
            success: true,
            message: "Registration successful.",
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