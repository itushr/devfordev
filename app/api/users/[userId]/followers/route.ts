import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Follow from "@/models/Follow";
import User from "@/models/User";

/**
 * GET /api/users/[userId]/followers?cursor=<id>&limit=20
 * Returns paginated list of users who follow [userId].
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

        const query: Record<string, unknown> = { following_id: userId };
        if (cursor) {
            query._id = { $lt: cursor };
        }

        const follows = await Follow.find(query)
            .sort({ _id: -1 })
            .limit(limit)
            .lean();

        const followerIds = follows.map((f: any) => f.follower_id);

        const users = await User.find({ _id: { $in: followerIds } })
            .select("_id name username avatar")
            .lean();

        const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));
        const followers = follows.map((f: any) => userMap.get(f.follower_id)).filter(Boolean);

        const nextCursor =
            follows.length === limit
                ? (follows[follows.length - 1] as any)._id?.toString() ?? null
                : null;

        return NextResponse.json({
            followers,
            nextCursor,
            hasMore: follows.length === limit,
        });
    } catch (error) {
        console.error("Error: @route GET /api/users/[userId]/followers", error);
        return NextResponse.json(
            { error: "Failed to fetch followers" },
            { status: 500 }
        );
    }
}
