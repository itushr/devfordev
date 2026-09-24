import {
    CopyObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import {
    privateBucketName,
    publicBucketName,
    r2,
} from "@/lib/r2";

const publicUrl = process.env.R2_PUBLIC_URL || "";

if (!publicUrl) {
    throw new Error("ERROR: @/.env --> missing R2_PUBLIC_URL");
}

export async function publishMedia(key: string) {
    if (!key || key.startsWith("/")) {
        throw new Error("Invalid media key");
    }

    const publicKey = key;

    await r2.send(
        new CopyObjectCommand({
            Bucket: publicBucketName,
            CopySource: `${privateBucketName}/${key}`,
            Key: publicKey,
        }),
    );

    await r2.send(
        new DeleteObjectCommand({
            Bucket: privateBucketName,
            Key: key,
        }),
    );

    return {
        key: publicKey,
        url: `${publicUrl.replace(/\/$/, "")}/${publicKey}`,
    };
}