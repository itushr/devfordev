import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Comment from "@/models/Comment";
import CommentLike from "@/models/CommentLike";

export async function PUT(
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

        const existingLike = await CommentLike.findOne({
            comment_id: commentId,
            user_id: userId,
        });

        let currentLikes = comment.likes ?? 0;

        if (!existingLike) {
            try {
                await CommentLike.create({
                    comment_id: commentId,
                    user_id: userId,
                });

                const updated = await Comment.findByIdAndUpdate(
                    commentId,
                    { $inc: { likes: 1 } },
                    { new: true }
                );
                currentLikes = updated?.likes ?? currentLikes + 1;
            } catch (err: any) {
                if (err.code === 11000) {
                    // Duplicate key, already liked
                    currentLikes = comment.likes ?? 0;
                } else {
                    throw err;
                }
            }
        }

        return NextResponse.json({
            success: true,
            liked: true,
            likedByMe: true,
            likes: currentLikes,
        });
    } catch (error) {
        console.error("Error: @route PUT /api/comments/[commentId]/like", error);
        return NextResponse.json(
            { error: "Failed to like comment" },
            { status: 500 }
        );
    }
}

export async function DELETE(
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

        const deleteResult = await CommentLike.findOneAndDelete({
            comment_id: commentId,
            user_id: userId,
        });

        let currentLikes = comment.likes ?? 0;

        if (deleteResult) {
            const updated = await Comment.findByIdAndUpdate(
                commentId,
                { $inc: { likes: -1 } },
                { new: true }
            );
            currentLikes = Math.max(0, updated?.likes ?? 0);
        }

        return NextResponse.json({
            success: true,
            liked: false,
            likedByMe: false,
            likes: currentLikes,
        });
    } catch (error) {
        console.error("Error: @route DELETE /api/comments/[commentId]/like", error);
        return NextResponse.json(
            { error: "Failed to unlike comment" },
            { status: 500 }
        );
    }
}
