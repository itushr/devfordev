import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.next();
    }

    try {
        const payload = verifyToken(token);

        const user = await User.findOne({
            _id: payload.id,
        }).lean();

        if (!user) {
            return NextResponse.next();
        }

        const requestHeaders = new Headers(request.headers);

        requestHeaders.set("user_id", user._id.toString());
        requestHeaders.set("user_name", user.name);
        requestHeaders.set("user_username", user.username);
        requestHeaders.set("user_avatar_url", user.avatar ?? "");
        requestHeaders.set("user_role", user.role);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch {
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/api/post"],
};