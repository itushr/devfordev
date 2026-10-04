import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Post from "@/models/Post";
import PostLike from "@/models/PostLike";

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ postId: string }> }
) {
    try {
        const { postId } = await props.params;

        if (!postId) {
            return NextResponse.json(
                { error: "Post ID or slug required" },
                { status: 400 }
            );
        }

        await connectDB();

        let post = null;
        if (mongoose.Types.ObjectId.isValid(postId)) {
            post = await Post.findById(postId).lean();
        }

        if (!post) {
            post = await Post.findOne({ slug: postId }).lean();
        }

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        let userId = req.headers.get("user_id");
        if (!userId) {
            const token = req.cookies.get("token")?.value;
            if (token) {
                try {
                    const payload = verifyToken(token);
                    userId = payload?.id;
                } catch {
                    // Invalid token
                }
            }
        }

        let likedByMe = false;
        if (userId) {
            const existingLike = await PostLike.findOne({
                post_id: (post as any)._id,
                user_id: userId,
            }).lean();
            likedByMe = !!existingLike;
        }

        return NextResponse.json({
            post: {
                ...post,
                likedByMe,
            },
        });
    } catch (error) {
        console.error("Error: @route GET /api/posts/[postId]", error);
        return NextResponse.json(
            { error: "Failed to fetch post" },
            { status: 500 }
        );
    }
}
