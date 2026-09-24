import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const privateBucketName = process.env.R2_PRIVATE_BUCKET_NAME;
const publicBucketName = process.env.R2_PUBLIC_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !privateBucketName || !publicBucketName) {
  throw new Error("ERROR: @/.env --> missing r2 credentials");
}

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export { privateBucketName, publicBucketName, r2 }