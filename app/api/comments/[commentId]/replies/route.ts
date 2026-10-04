import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Comment from "@/models/Comment";
import CommentLike from "@/models/CommentLike";
import Post from "@/models/Post";
import { createCommentSchema } from "@/validations/comment";

export async function GET(
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

        await connectDB();

        const parentComment = await Comment.findById(commentId).lean();
        if (!parentComment) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            );
        }

        const replies = await Comment.find({
            parent_id: commentId,
        })
            .sort({ createdAt: 1 })
            .lean();

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

        let likedReplyIds = new Set<string>();
        if (userId && replies.length > 0) {
            const replyIds = replies.map((r: any) => r._id);
            const userLikes = await CommentLike.find({
                user_id: userId,
                comment_id: { $in: replyIds },
            })
                .select("comment_id")
                .lean();

            likedReplyIds = new Set(
                userLikes.map((l: any) => l.comment_id.toString())
            );
        }

        const repliesWithLikeStatus = replies.map((reply: any) => ({
            ...reply,
            likedByMe: likedReplyIds.has(reply._id.toString()),
        }));

        return NextResponse.json({
            replies: repliesWithLikeStatus,
        });
    } catch (error) {
        console.error("Error: @route GET /api/comments/[commentId]/replies", error);
        return NextResponse.json(
            { error: "Failed to fetch replies" },
            { status: 500 }
        );
    }
}

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
        let userName = req.headers.get("user_name");
        let userUsername = req.headers.get("user_username");
        let userAvatar = req.headers.get("user_avatar_url") ?? "";

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
                { error: "Unauthorized. Please log in to reply." },
                { status: 401 }
            );
        }

        await connectDB();

        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            return NextResponse.json(
                { error: "Parent comment not found" },
                { status: 404 }
            );
        }

        const body = await req.json();
        const validation = createCommentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Invalid reply data",
                    details: validation.error.issues,
                },
                { status: 400 }
            );
        }

        const { content, data, replyToUsername } = validation.data;

        // If author info wasn't in headers, fetch from user model
        if (!userName || !userUsername) {
            const User = (await import("@/models/User")).default;
            const dbUser = await User.findById(userId).lean();
            if (dbUser) {
                userName = dbUser.name || "Anonymous";
                userUsername = dbUser.username || "anonymous";
                userAvatar = dbUser.avatar || "";
            }
        }

        // Replies are always points free
        const newReply = await Comment.create({
            post_id: parentComment.post_id,
            parent_id: parentComment._id,
            author_id: userId,
            author_name: userName || "Anonymous",
            author_username: userUsername || "anonymous",
            author_avatar: userAvatar || "/random-pfps/pfp5.jpeg",
            content: content || "",
            data: data || [],
            replyToUsername: replyToUsername || parentComment.author_username,
            points: 0,
            pointsAwarded: false,
            likes: 0,
            repliesCount: 0,
        });

        // Increment parent comment replies count
        await Comment.findByIdAndUpdate(parentComment._id, {
            $inc: { repliesCount: 1 },
        });

        // Increment post comments count
        await Post.findByIdAndUpdate(parentComment.post_id, {
            $inc: { "stats.comments": 1 },
        });

        return NextResponse.json(
            {
                success: true,
                reply: {
                    ...newReply.toObject(),
                    likedByMe: false,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error: @route POST /api/comments/[commentId]/replies", error);
        return NextResponse.json(
            { error: "Failed to create reply" },
            { status: 500 }
        );
    }
}
