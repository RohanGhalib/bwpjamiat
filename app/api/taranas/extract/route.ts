import { NextResponse } from "next/server";
import { r2Client } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import os from "os";
import fs from "fs/promises";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

// ffmpeg-static is excluded from Turbopack bundling via serverExternalPackages in next.config.ts
// so this import resolves to the real OS path of the ffmpeg binary
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

// Next.js config to allow slightly larger video files
export const maxDuration = 60; // 60 seconds timeout (if on Vercel Pro/Hobby, will be capped by plan)

export async function POST(request: Request) {
  let inputPath = "";
  let outputPath = "";

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Missing video file" }, { status: 400 });
    }

    const uniqueId = uuidv4();
    inputPath = path.join(os.tmpdir(), `${uniqueId}_input.mp4`);
    outputPath = path.join(os.tmpdir(), `${uniqueId}_output.mp3`);

    // 1. Write the uploaded video file to local temporary disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(inputPath, buffer);

    // 2. Extract audio using FFmpeg
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .noVideo() // Remove video track
        .audioCodec("libmp3lame") // Encode to MP3
        .audioBitrate(128)
        .format("mp3")
        .save(outputPath)
        .on("end", () => resolve())
        .on("error", (err) => reject(new Error(`FFmpeg processing failed: ${err.message}`)));
    });

    // 3. Read the extracted MP3 file
    const audioBuffer = await fs.readFile(outputPath);

    // 4. Upload to Cloudflare R2
    const bucketName = process.env.NEXT_PUBLIC_R2_BUCKET_NAME;
    const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

    if (!bucketName || !publicUrl) {
      throw new Error("R2 configuration is missing");
    }

    const r2Key = `taranas/${uniqueId}.mp3`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: r2Key,
      ContentType: "audio/mp3",
      Body: audioBuffer,
    });

    await r2Client.send(command);

    // 5. Cleanup temporary files
    try {
      await fs.unlink(inputPath);
      await fs.unlink(outputPath);
    } catch (cleanupError) {
      console.warn("Failed to cleanup temporary files:", cleanupError);
    }

    return NextResponse.json({
      message: "Audio extracted and uploaded successfully",
      fileUrl: `${publicUrl}/${r2Key}`,
    });
  } catch (error: any) {
    console.error("Extraction error:", error);

    // Cleanup on error if files exist
    try {
      if (inputPath) await fs.unlink(inputPath).catch(() => {});
      if (outputPath) await fs.unlink(outputPath).catch(() => {});
    } catch (e) {}

    return NextResponse.json(
      { error: `Failed to extract audio: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
