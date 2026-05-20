import { NextResponse } from "next/server";
import { getR2Config, getR2PublicUrl, r2Client } from "@/lib/r2";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export async function POST(request: Request) {
  let inputPath = "";
  let outputPath = "";
  let shouldDeleteSource = false;
  let sourceKey = "";

  try {
    const body = await request.json();
    sourceKey = typeof body.sourceKey === "string" ? body.sourceKey : "";
    shouldDeleteSource = body.cleanupSource !== false;

    if (!sourceKey) {
      return NextResponse.json({ error: "Missing source key" }, { status: 400 });
    }

    const { bucketName } = getR2Config();

    if (!bucketName) {
      throw new Error("R2 bucket is not configured");
    }

    const uniqueId = uuidv4();
    inputPath = path.join(os.tmpdir(), `${uniqueId}_input.mp4`);
    outputPath = path.join(os.tmpdir(), `${uniqueId}_output.mp3`);

    // 1. Download the previously uploaded video from R2 to local temporary disk
    const sourceObject = await r2Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: sourceKey,
      })
    );

    if (!sourceObject.Body) {
      throw new Error("Uploaded video could not be read from storage");
    }

    const sourceBytes = await sourceObject.Body.transformToByteArray();
    await fs.writeFile(inputPath, Buffer.from(sourceBytes));

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

    if (shouldDeleteSource) {
      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: sourceKey,
        })
      );
    }

    return NextResponse.json({
      message: "Audio extracted and uploaded successfully",
      fileUrl: getR2PublicUrl(r2Key),
      storagePath: r2Key,
    });
  } catch (error) {
    console.error("Extraction error:", error);

    // Cleanup on error if files exist
    try {
      if (inputPath) await fs.unlink(inputPath).catch(() => {});
      if (outputPath) await fs.unlink(outputPath).catch(() => {});
    } catch {}

    if (shouldDeleteSource && sourceKey) {
      const { bucketName } = getR2Config();

      if (bucketName) {
        await r2Client
          .send(
            new DeleteObjectCommand({
              Bucket: bucketName,
              Key: sourceKey,
            })
          )
          .catch(() => {});
      }
    }

    return NextResponse.json(
      { error: `Failed to extract audio: ${getErrorMessage(error)}` },
      { status: 500 }
    );
  }
}
