import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { generateFeed } from "@/lib/feed/feed";
import Post from "@/models/Post";
import PostLike from "@/models/PostLike";
import { DEFAULT_FEED_LIMIT, MAX_FEED_LIMIT } from "@/lib/feed/config";

/**
 * GET /api/feed
 *
 * Query params:
 *   mode       "foryou" | "recent"  (default: "foryou")
 *   limit      number               (default: 20, max: 50)
 *   served     comma-separated post IDs already seen this session
 *   cursor     ObjectId string for "recent" cursor pagination
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const mode = searchParams.get("mode") ?? "foryou";
        const limitParam = searchParams.get("limit");
        const limit = limitParam
            ? Math.min(Math.max(parseInt(limitParam, 10) || DEFAULT_FEED_LIMIT, 1), MAX_FEED_LIMIT)
            : DEFAULT_FEED_LIMIT;

        // Resolve viewer identity
        let userId = req.headers.get("user_id");
        if (!userId) {
            const token = req.cookies.get("token")?.value;
            if (token) {
                try {
                    const payload = verifyToken(token);
                    userId = payload?.id;
                } catch {
                    // guest
                }
            }
        }

        await connectDB();

        // ---------------------------------------------------------------
        // "recent" mode — simple reverse-chronological with cursor paging
        // ---------------------------------------------------------------
        if (mode === "recent") {
            const cursor = searchParams.get("cursor");
            const query: Record<string, unknown> = {};
            if (cursor) query._id = { $lt: cursor };

            const posts = await Post.find(query)
                .sort({ createdAt: -1, _id: -1 })
                .limit(limit)
                .lean();

            let likedPostIds = new Set<string>();
            if (userId && posts.length > 0) {
                const postIds = posts.map((p: any) => p._id);
                const userLikes = await PostLike.find({
                    user_id: userId,
                    post_id: { $in: postIds },
                })
                    .select("post_id")
                    .lean();
                likedPostIds = new Set(
                    (userLikes as any[]).map((l) => l.post_id.toString())
                );
            }

            const postsWithLikeStatus = posts.map((post: any) => ({
                ...post,
                _id: post._id.toString(),
                createdAt: post.createdAt?.toISOString?.() ?? "",
                updatedAt: post.updatedAt?.toISOString?.() ?? "",
                likedByMe: likedPostIds.has(post._id.toString()),
            }));

            const nextCursor =
                posts.length === limit
                    ? (posts[posts.length - 1] as any)._id?.toString() ?? null
                    : null;

            return NextResponse.json({
                posts: postsWithLikeStatus,
                nextCursor,
                hasMore: posts.length === limit,
                mode: "recent",
            });
        }

        // ---------------------------------------------------------------
        // "foryou" mode — probabilistic ranked feed
        // ---------------------------------------------------------------
        const servedParam = searchParams.get("served") ?? "";
        const servedPostIds = servedParam
            ? servedParam.split(",").filter(Boolean)
            : [];

        const result = await generateFeed(userId, {
            limit,
            servedPostIds,
        });

        return NextResponse.json({
            posts: result.posts,
            servedIds: result.servedIds,
            hasMore: result.hasMore,
            mode: "foryou",
        });
    } catch (error) {
        console.error("Error: @route GET /api/feed", error);
        return NextResponse.json(
            { error: "Failed to load feed" },
            { status: 500 }
        );
    }
}
