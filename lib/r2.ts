import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.NEXT_PUBLIC_R2_ACCOUNT_ID;

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY || "",
  },
});
