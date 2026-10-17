import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";
import Post from "@/models/Post";
import PostLike from "@/models/PostLike";
import Follow from "@/models/Follow";
import { getUserContributionMetrics } from "@/lib/feed/contributions";

function getAuthUserId(req: NextRequest): string | null {
    const fromHeader = req.headers.get("user_id");
    if (fromHeader) return fromHeader;
    const token = req.cookies.get("token")?.value;
    if (token) {
        try {
            const payload = verifyToken(token);
            return payload?.id ?? null;
        } catch {
            return null;
        }
    }
    return null;
}

/**
 * GET /api/users/by-username/[username]
 * Returns public profile for a given username.
 * Includes follower/following counts, isFollowing, and their posts with likedByMe.
 */
export async function GET(
    req: NextRequest,
    props: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await props.params;
        const actorId = getAuthUserId(req);

        await connectDB();

        const user = await User.findOne({ username: username.toLowerCase() })
            .select("_id name username avatar description createdAt")
            .lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const u = user as any;
        const targetId = u._id.toString();

        const [followersCount, followingCount, isFollowingDoc, rawPosts, contributionMetrics] = await Promise.all([
            Follow.countDocuments({ following_id: targetId }),
            Follow.countDocuments({ follower_id: targetId }),
            actorId && actorId !== targetId
                ? Follow.exists({ follower_id: actorId, following_id: targetId })
                : Promise.resolve(null),
            Post.find({ author_id: targetId })
                .sort({ createdAt: -1 })
                .lean(),
            getUserContributionMetrics(targetId),
        ]);

        // Compute likedByMe for each post
        let likedPostIds = new Set<string>();
        if (actorId && rawPosts.length > 0) {
            const postIds = rawPosts.map((p: any) => p._id);
            const likes = await PostLike.find({
                post_id: { $in: postIds },
                user_id: actorId,
            }).select("post_id").lean();
            likedPostIds = new Set(
                (likes as any[]).map((l) => l.post_id.toString())
            );
        }

        const posts = (rawPosts as any[]).map((p) => ({
            _id: p._id.toString(),
            author_id: p.author_id,
            author_name: p.author_name,
            author_username: p.author_username,
            author_avatar: p.author_avatar,
            slug: p.slug,
            data: p.data,
            stats: p.stats,
            likedByMe: likedPostIds.has(p._id.toString()),
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));

        return NextResponse.json({
            user: {
                id: targetId,
                name: u.name ?? "",
                username: u.username ?? "",
                avatar: u.avatar ?? "",
                description: u.description ?? "",
                contributions: contributionMetrics.totalReceived,
                contributionMetrics,
                createdAt: u.createdAt,
            },
            followersCount,
            followingCount,
            isFollowing: Boolean(isFollowingDoc),
            posts,
        });
    } catch (error) {
        console.error("Error: @route GET /api/users/by-username/[username]", error);
        return NextResponse.json(
            { error: "Failed to fetch user profile" },
            { status: 500 }
        );
    }
}
