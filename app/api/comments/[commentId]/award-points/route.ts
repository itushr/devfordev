import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import User from "@/models/User";

export async function POST(
    req: NextRequest,
    props: { params: Promise<{ commentId: string }> }
) {
    try {
        const { commentId } = await props.params;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return NextResponse.json(
                { error: "Invalid comment ID" },
                { status: 400 }
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

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            );
        }

        // Only direct comments to post can receive points
        if (comment.parent_id) {
            return NextResponse.json(
                { error: "Only direct comments to a post are eligible for points" },
                { status: 400 }
            );
        }

        const post = await Post.findById(comment.post_id);
        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        // Only the post author can decide whether to award points
        if (post.author_id !== userId) {
            return NextResponse.json(
                { error: "Only the post author can award points to comments" },
                { status: 403 }
            );
        }

        let body: any = {};
        try {
            body = await req.json();
        } catch {
            // Optional body
        }

        const pointsToAward = typeof body.points === "number" && body.points > 0
            ? body.points
            : (post.points || 10);

        const currentAwarded = comment.pointsAwarded;
        const newAwardedState = !currentAwarded;

        if (newAwardedState) {
            // Awarding points
            comment.pointsAwarded = true;
            comment.points = pointsToAward;
            await comment.save();

            // Increment the comment author's points
            await User.findByIdAndUpdate(comment.author_id, {
                $inc: { points: pointsToAward },
            });
        } else {
            // Revoking points
            const pointsToDeduct = comment.points || pointsToAward;
            comment.pointsAwarded = false;
            comment.points = 0;
            await comment.save();

            // Decrement the comment author's points
            await User.findByIdAndUpdate(comment.author_id, {
                $inc: { points: -pointsToDeduct },
            });
        }

        return NextResponse.json({
            success: true,
            pointsAwarded: comment.pointsAwarded,
            points: comment.points,
            message: comment.pointsAwarded
                ? `Awarded ${comment.points} points to comment`
                : "Points revoked from comment",
        });
    } catch (error) {
        console.error("Error: @route POST /api/comments/[commentId]/award-points", error);
        return NextResponse.json(
            { error: "Failed to award points" },
            { status: 500 }
        );
    }
}
