import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import Post from "@/models/Post";
import { createPostSchema } from "@/validations/post";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const user = {
            user_id: req.headers.get("user_id"),
            user_name: req.headers.get("user_name"),
            user_username:  req.headers.get("user_username"),
            user_avatar_url: req.headers.get("user_avatar_url") ?? "",
            user_role: req.headers.get("user_role"),
        };

        if (
            !user.user_id ||
            !user.user_name ||
            !user.user_username ||
            user.user_role !== "user"
        ) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const text = await req.text();

        if (!text) {
            return NextResponse.json(
                { error: "Empty request body" },
                { status: 400 }
            );
        }

        let body: unknown;

        try {
            body = JSON.parse(text);
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        const result = createPostSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Invalid post data",
                    details: result.error.issues,
                },
                { status: 400 }
            );
        }

        await connectDB();

        const post = await Post.create({
            author_id: user.user_id,
            author_name: user.user_name,
            author_username: user.user_username,
            author_avatar: user.user_avatar_url,

            points: 10,

            data: result.data.data,

            stats: {
                flames: 0,
                likes: 0,
                comments: 0,
                impressions: 0,
                bookmarks: 0,
                shares: 0,
            },
        });

        return NextResponse.json(
            {
                message: "Post created successfully",
                post,
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: "Invalid post data",
                    details: error.issues,
                },
                { status: 400 }
            );
        }

        console.error("Error: @route /api/posts", error);

        return NextResponse.json(
            { error: "Something went wrong!" },
            { status: 500 }
        );
    }
}