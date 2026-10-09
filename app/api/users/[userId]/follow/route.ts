import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Follow from "@/models/Follow";
import User from "@/models/User";

/** Resolve authenticated user id from headers (set by proxy middleware) or cookie fallback */
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
 * POST /api/users/[userId]/follow
 * Follow the user identified by userId.
 */
export async function POST(
    req: NextRequest,
    props: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId: targetId } = await props.params;
        const actorId = getAuthUserId(req);

        if (!actorId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (actorId === targetId) {
            return NextResponse.json(
                { error: "You cannot follow yourself" },
                { status: 400 }
            );
        }

        await connectDB();

        // Verify target user exists
        const targetUser = await User.findById(targetId)
            .select("_id name username avatar")
            .lean();
        if (!targetUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Create follow (upsert to be idempotent)
        await Follow.findOneAndUpdate(
            { follower_id: actorId, following_id: targetId },
            { follower_id: actorId, following_id: targetId },
            { upsert: true, new: true }
        );

        const [followersCount, followingCount] = await Promise.all([
            Follow.countDocuments({ following_id: targetId }),
            Follow.countDocuments({ follower_id: targetId }),
        ]);

        return NextResponse.json({
            success: true,
            following: true,
            followersCount,
            followingCount,
        });
    } catch (error) {
        console.error("Error: @route POST /api/users/[userId]/follow", error);
        return NextResponse.json(
            { error: "Failed to follow user" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/users/[userId]/follow
 * Unfollow the user identified by userId.
 */
export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId: targetId } = await props.params;
        const actorId = getAuthUserId(req);

        if (!actorId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (actorId === targetId) {
            return NextResponse.json(
                { error: "You cannot unfollow yourself" },
                { status: 400 }
            );
        }

        await connectDB();

        await Follow.findOneAndDelete({
            follower_id: actorId,
            following_id: targetId,
        });

        const [followersCount, followingCount] = await Promise.all([
            Follow.countDocuments({ following_id: targetId }),
            Follow.countDocuments({ follower_id: targetId }),
        ]);

        return NextResponse.json({
            success: true,
            following: false,
            followersCount,
            followingCount,
        });
    } catch (error) {
        console.error("Error: @route DELETE /api/users/[userId]/follow", error);
        return NextResponse.json(
            { error: "Failed to unfollow user" },
            { status: 500 }
        );
    }
}
