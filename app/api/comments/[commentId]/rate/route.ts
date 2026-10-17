import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import Contribution from "@/models/Contribution";
import { RATING_VALUES, Rating } from "@/lib/feed/config";
import { invalidateContributionCache } from "@/lib/feed/contributions";

/**
 * POST /api/comments/[commentId]/rate
 *
 * Body: { rating: "bad" | "good" | "best" }
 *
 * Only the post author can rate comments.
 * Only top-level (direct) comments can be rated.
 * One rating per comment — updated in-place if called again.
 */
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
                    // invalid token
                }
            }
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let body: { rating?: string } = {};
        try {
            body = await req.json();
        } catch {
            // body is optional — default to "good"
        }

        const rating = body.rating as Rating | undefined;
        if (!rating || !["bad", "good", "best"].includes(rating)) {
            return NextResponse.json(
                { error: 'rating must be "bad", "good", or "best"' },
                { status: 400 }
            );
        }

        await connectDB();

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        // Only direct comments (no parent) can be rated
        if (comment.parent_id) {
            return NextResponse.json(
                { error: "Only direct comments can be rated" },
                { status: 400 }
            );
        }

        const post = await Post.findById(comment.post_id);
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Only post author can rate
        if (post.author_id?.toString() !== userId) {
            return NextResponse.json(
                { error: "Only the post author can rate comments" },
                { status: 403 }
            );
        }

        const value = RATING_VALUES[rating];

        // Upsert contribution record (unique on comment_id)
        const contribution = await Contribution.findOneAndUpdate(
            { comment_id: new mongoose.Types.ObjectId(commentId) },
            {
                $set: {
                    contributor_id: new mongoose.Types.ObjectId(comment.author_id),
                    recipient_id: new mongoose.Types.ObjectId(userId),
                    post_id: new mongoose.Types.ObjectId(comment.post_id.toString()),
                    rating,
                    value,
                },
            },
            { upsert: true, new: true }
        );

        // Also update comment doc directly so comment listing reflects rating without joins
        comment.rating = rating;
        await comment.save();

        // Invalidate in-memory feed metrics cache
        invalidateContributionCache(comment.author_id, userId);

        return NextResponse.json({
            success: true,
            rating: contribution.rating,
            value: contribution.value,
        });
    } catch (error) {
        console.error("Error: @route POST /api/comments/[commentId]/rate", error);
        return NextResponse.json(
            { error: "Failed to rate comment" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/comments/[commentId]/rate
 * Removes a rating (contribution record) from a comment.
 */
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
                } catch {}
            }
        }

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        const post = await Post.findById(comment.post_id).select("author_id");
        if (!post || post.author_id?.toString() !== userId) {
            return NextResponse.json(
                { error: "Only the post author can remove ratings" },
                { status: 403 }
            );
        }

        await Contribution.deleteOne({
            comment_id: new mongoose.Types.ObjectId(commentId),
        });

        comment.rating = null;
        await comment.save();

        invalidateContributionCache(comment.author_id, userId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error: @route DELETE /api/comments/[commentId]/rate", error);
        return NextResponse.json(
            { error: "Failed to remove rating" },
            { status: 500 }
        );
    }
}
