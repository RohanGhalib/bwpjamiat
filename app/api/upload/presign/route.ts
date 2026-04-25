import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

import { getR2Config, getR2PublicUrl, r2Client } from "@/lib/r2";

type PresignRequestBody = {
  fileName?: string;
  contentType?: string;
  folder?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PresignRequestBody;
    const fileName = body.fileName?.trim();
    const contentType = body.contentType?.trim() || "application/octet-stream";
    const folder = body.folder?.trim() || "events";

    if (!fileName) {
      return NextResponse.json({ error: "Missing file name" }, { status: 400 });
    }

    const { bucketName } = getR2Config();

    if (!bucketName) {
      return NextResponse.json({ error: "Bucket name not configured" }, { status: 500 });
    }

    const lastDot = fileName.lastIndexOf(".");
    const extension = lastDot >= 0 ? fileName.slice(lastDot + 1) : "";
    const storagePath = extension
      ? `${folder}/${uuidv4()}.${extension}`
      : `${folder}/${uuidv4()}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: storagePath,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 60 });

    return NextResponse.json({
      uploadUrl,
      fileUrl: getR2PublicUrl(storagePath),
      storagePath,
    });
  } catch (error) {
    console.error("Error creating upload URL:", error);
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }
}
