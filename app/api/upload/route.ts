import { NextResponse } from "next/server";
import { r2Client } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const fileExtension = file.name.split(".").pop();
    const targetFolder = folder || "events";
    const uniqueFilename = `${targetFolder}/${uuidv4()}.${fileExtension}`;
    const bucketName = process.env.NEXT_PUBLIC_R2_BUCKET_NAME;

    if (!bucketName) {
      return NextResponse.json({ error: "Bucket name not configured" }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFilename,
      ContentType: file.type,
      Body: buffer,
    });

    await r2Client.send(command);
    
    // Construct the public URL where the file will be accessible after upload
    const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
    const fileUrl = publicUrlBase ? `${publicUrlBase}/${uniqueFilename}` : "";

    return NextResponse.json({
      fileUrl: fileUrl,
      imageStoragePath: uniqueFilename
    });

  } catch (error) {
    console.error("Error uploading to R2:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
