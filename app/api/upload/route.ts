import { NextResponse } from "next/server";
import { getR2Config, getR2PublicUrl, r2Client } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";

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
    const { bucketName } = getR2Config();

    if (!bucketName) {
      console.warn("Upload: R2_BUCKET_NAME not configured. Falling back to local public directory.");
      
      const publicDir = path.join(process.cwd(), "public", "uploads", targetFolder);
      await fs.mkdir(publicDir, { recursive: true });
      
      const filePath = path.join(publicDir, path.basename(uniqueFilename));
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);
      
      return NextResponse.json({
        fileUrl: `/uploads/${targetFolder}/${path.basename(uniqueFilename)}`,
        imageStoragePath: `uploads/${targetFolder}/${path.basename(uniqueFilename)}`
      });
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

    return NextResponse.json({
      fileUrl: getR2PublicUrl(uniqueFilename),
      imageStoragePath: uniqueFilename
    });

  } catch (error) {
    console.error("Error uploading to R2:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
