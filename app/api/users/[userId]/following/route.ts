import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Follow from "@/models/Follow";
import User from "@/models/User";

/**
 * GET /api/users/[userId]/following?cursor=<id>&limit=20
 * Returns paginated list of users that [userId] follows.
 */
export async function GET(
    req: NextRequest,
    props: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await props.params;
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const limitParam = searchParams.get("limit");
        const limit = Math.min(Math.max(parseInt(limitParam ?? "20", 10) || 20, 1), 50);

        await connectDB();

        const query: Record<string, unknown> = { follower_id: userId };
        if (cursor) {
            query._id = { $lt: cursor };
        }

        const follows = await Follow.find(query)
            .sort({ _id: -1 })
            .limit(limit)
            .lean();

        const followingIds = follows.map((f: any) => f.following_id);

        const users = await User.find({ _id: { $in: followingIds } })
            .select("_id name username avatar")
            .lean();

        const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));
        const following = follows.map((f: any) => userMap.get(f.following_id)).filter(Boolean);

        const nextCursor =
            follows.length === limit
                ? (follows[follows.length - 1] as any)._id?.toString() ?? null
                : null;

        return NextResponse.json({
            following,
            nextCursor,
            hasMore: follows.length === limit,
        });
    } catch (error) {
        console.error("Error: @route GET /api/users/[userId]/following", error);
        return NextResponse.json(
            { error: "Failed to fetch following" },
            { status: 500 }
        );
    }
}
