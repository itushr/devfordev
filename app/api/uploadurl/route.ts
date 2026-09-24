import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { privateBucketName, r2 } from "@/lib/r2";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

const EXTENSIONS: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
};

export async function POST(req: Request) {
    try {
        const text = await req.text();
        if (!text) {
            return Response.json(
                { error: "Empty request body" }, 
                { status: 400 }
            );
        }

        const body = JSON.parse(text);
        const { fileName, contentType, size } = body;

        //input validation
        if (
            typeof fileName !== "string" ||
            typeof contentType !== "string" ||
            typeof size !== "number"
        ) {
            return NextResponse.json(
                { error: "Invalid upload data" },
                { status: 400 }
            );
        }

        if (!ALLOWED_TYPES.has(contentType)) {
            return NextResponse.json(
                { error: "File type not allowed" },
                { status: 400 }
            );
        }

        if (size <= 0 || size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File must be smaller that 5MB" },
                { status: 400 }
            );
        }

        //file storage
        const key = `${crypto.randomUUID()}.${EXTENSIONS[contentType]}`;

        const command = new PutObjectCommand({
            Bucket: privateBucketName,
            Key: key,
            ContentType: contentType,
            ContentLength: size,
        });

        const uploadUrl = await getSignedUrl(r2, command, {
            expiresIn: 120,
        });

        return NextResponse.json({
            uploadUrl,
            key,
        });
    } catch (error) {
        console.error("Error: @route /api/upload", error);

        return NextResponse.json(
            { error: "Could not generate upload url" },
            { status: 500 }
        );
    }
}