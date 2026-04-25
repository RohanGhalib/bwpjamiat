import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

function readEnv(primary: string, fallback?: string) {
  return process.env[primary] || (fallback ? process.env[fallback] : undefined);
}

export function getR2Config() {
  const accountId = readEnv("R2_ACCOUNT_ID", "NEXT_PUBLIC_R2_ACCOUNT_ID");
  const accessKeyId = readEnv("R2_ACCESS_KEY_ID", "NEXT_PUBLIC_R2_ACCESS_KEY_ID");
  const secretAccessKey = readEnv("R2_SECRET_ACCESS_KEY", "NEXT_PUBLIC_R2_SECRET_ACCESS_KEY");
  const bucketName = readEnv("R2_BUCKET_NAME", "NEXT_PUBLIC_R2_BUCKET_NAME");
  const publicUrlBase = readEnv("R2_PUBLIC_URL", "NEXT_PUBLIC_R2_PUBLIC_URL")?.replace(/\/$/, "");

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrlBase,
  };
}

const { accountId, accessKeyId, secretAccessKey } = getR2Config();

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

export function getR2PublicUrl(key: string) {
  const { publicUrlBase } = getR2Config();
  return publicUrlBase ? `${publicUrlBase}/${key}` : "";
}
