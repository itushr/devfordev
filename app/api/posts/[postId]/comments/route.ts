import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import CommentLike from "@/models/CommentLike";
import UserInteraction from "@/models/UserInteraction";
import { createCommentSchema } from "@/validations/comment";

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ postId: string }> }
) {
    try {
        const { postId } = await props.params;

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

        const { searchParams } = new URL(req.url);
        const limitParam = searchParams.get("limit");
        const cursor = searchParams.get("cursor");
        const limit = limitParam
            ? Math.min(Math.max(parseInt(limitParam, 10) || 20, 1), 50)
            : 20;

        const query: Record<string, unknown> = {
            post_id: (post as any)._id,
            parent_id: null,
        };

        if (cursor) {
            query._id = { $lt: cursor };
        }

        const comments = await Comment.find(query)
            .sort({ pointsAwarded: -1, createdAt: -1, _id: -1 })
            .limit(limit)
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

        let likedCommentIds = new Set<string>();
        if (userId && comments.length > 0) {
            const commentIds = comments.map((c: any) => c._id);
            const userLikes = await CommentLike.find({
                user_id: userId,
                comment_id: { $in: commentIds },
            })
                .select("comment_id")
                .lean();

            likedCommentIds = new Set(
                userLikes.map((l: any) => l.comment_id.toString())
            );
        }

        const commentsWithLikeStatus = comments.map((comment: any) => ({
            ...comment,
            likedByMe: likedCommentIds.has(comment._id.toString()),
        }));

        const isPostAuthor = Boolean(userId && userId === (post as any).author_id);

        const nextCursor =
            comments.length === limit
                ? (comments[comments.length - 1] as { _id?: unknown })._id?.toString() ?? null
                : null;

        return NextResponse.json({
            comments: commentsWithLikeStatus,
            postAuthorId: (post as any).author_id,
            isPostAuthor,
            nextCursor,
            hasMore: comments.length === limit,
        });
    } catch (error) {
        console.error("Error: @route GET /api/posts/[postId]/comments", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    props: { params: Promise<{ postId: string }> }
) {
    try {
        const { postId } = await props.params;

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
                { error: "Unauthorized. Please log in to comment." },
                { status: 401 }
            );
        }

        await connectDB();

        let post = null;
        if (mongoose.Types.ObjectId.isValid(postId)) {
            post = await Post.findById(postId);
        }
        if (!post) {
            post = await Post.findOne({ slug: postId });
        }

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        const body = await req.json();
        const validation = createCommentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Invalid comment data",
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

        const newComment = await Comment.create({
            post_id: post._id,
            parent_id: null,
            author_id: userId,
            author_name: userName || "Anonymous",
            author_username: userUsername || "anonymous",
            author_avatar: userAvatar || "/random-pfps/pfp5.jpeg",
            content: content || "",
            data: data || [],
            replyToUsername: replyToUsername || post.author_username,
            points: 0,
            pointsAwarded: false,
            likes: 0,
            repliesCount: 0,
        });

        // Increment post comments count
        await Post.findByIdAndUpdate(post._id, {
            $inc: { "stats.comments": 1 },
        });

        // Update interaction aggregate for top-level comments (actor != post author)
        const postAuthorId = post.author_id?.toString();
        if (postAuthorId && postAuthorId !== userId) {
            await UserInteraction.findOneAndUpdate(
                { actor_id: userId, target_id: postAuthorId },
                {
                    $inc: { comments_count: 1 },
                    $set: { last_interacted_at: new Date() },
                },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json(
            {
                success: true,
                comment: {
                    ...newComment.toObject(),
                    likedByMe: false,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error: @route POST /api/posts/[postId]/comments", error);
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
}
