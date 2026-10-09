import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Follow from "@/models/Follow";
import User from "@/models/User";

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
 * GET /api/users/[userId]/follow-status
 * Check if the authenticated user follows [userId].
 * Also returns follower/following counts for [userId].
 */
export async function GET(
    req: NextRequest,
    props: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId: targetId } = await props.params;
        const actorId = getAuthUserId(req);

        await connectDB();

        // Verify target user exists
        const targetUser = await User.findById(targetId)
            .select("_id name username avatar")
            .lean();
        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const [followersCount, followingCount, isFollowing] = await Promise.all([
            Follow.countDocuments({ following_id: targetId }),
            Follow.countDocuments({ follower_id: targetId }),
            actorId && actorId !== targetId
                ? Follow.exists({ follower_id: actorId, following_id: targetId })
                : Promise.resolve(null),
        ]);

        return NextResponse.json({
            isFollowing: Boolean(isFollowing),
            followersCount,
            followingCount,
        });
    } catch (error) {
        console.error("Error: @route GET /api/users/[userId]/follow-status", error);
        return NextResponse.json(
            { error: "Failed to fetch follow status" },
            { status: 500 }
        );
    }
}
