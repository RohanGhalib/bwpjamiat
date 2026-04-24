import { NextResponse } from "next/server";
import { r2Client } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: Request) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Missing file key" }, { status: 400 });
    }

    const bucketName = process.env.NEXT_PUBLIC_R2_BUCKET_NAME;

    if (!bucketName) {
      return NextResponse.json({ error: "Bucket name not configured" }, { status: 500 });
    }

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await r2Client.send(command);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting file from R2:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
