import { NextResponse } from 'next/server';
import { createPresignedUpload, deleteFromStorage } from '@/lib/media-service';

type MediaRequest =
  | { action: 'presign'; fileName?: string; contentType?: string; folder?: string }
  | { action: 'delete'; key?: string };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MediaRequest;

    if (body.action === 'presign') {
      if (!body.fileName) {
        return NextResponse.json({ error: 'Missing file name' }, { status: 400 });
      }

      const result = await createPresignedUpload({
        fileName: body.fileName,
        contentType: body.contentType,
        folder: body.folder,
      });

      return NextResponse.json(result);
    }

    if (body.action === 'delete') {
      if (!body.key) {
        return NextResponse.json({ error: 'Missing file key' }, { status: 400 });
      }
      await deleteFromStorage(body.key);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Media API error:', error);
    return NextResponse.json({ error: 'Media operation failed' }, { status: 500 });
  }
}

