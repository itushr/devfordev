import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return Response.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const payload = verifyToken(token);

        return Response.json(payload);
    } catch {
        return Response.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}