import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

/**
 * GET /api/users/recent
 * Returns the 5 most recently registered users.
 */
export async function GET() {
    try {
        await connectDB();

        const users = await User.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select("_id name username avatar points rating createdAt")
            .lean();

        const result = (users as any[]).map((u) => ({
            id: u._id.toString(),
            name: u.name ?? "",
            username: u.username ?? "",
            avatar: u.avatar ?? "",
            points: u.points ?? 0,
            rating: u.rating ?? 0,
        }));

        return NextResponse.json({ users: result });
    } catch (error) {
        console.error("Error: @route GET /api/users/recent", error);
        return NextResponse.json(
            { error: "Failed to fetch recent users" },
            { status: 500 }
        );
    }
}
