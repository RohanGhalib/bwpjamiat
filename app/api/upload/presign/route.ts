import { NextResponse } from "next/server";
import { createPresignedUpload } from "@/lib/media-service";

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
    const result = await createPresignedUpload({ fileName, contentType, folder });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating upload URL:", error);
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }
}
