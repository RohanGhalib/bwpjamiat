import { NextResponse } from "next/server";
import { deleteFromStorage } from "@/lib/media-service";

export async function POST(request: Request) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Missing file key" }, { status: 400 });
    }

    await deleteFromStorage(key);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting file from R2:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
