import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkEndpointAvailability } from '@/lib/url-management';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_auth')?.value === 'authenticated';
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as {
      path?: string;
      excludePageId?: string;
      excludeRedirectId?: string;
      excludeEventId?: string;
    };

    if (!body.path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const result = await checkEndpointAvailability(body.path, {
      excludePageId: body.excludePageId,
      excludeRedirectId: body.excludeRedirectId,
      excludeEventId: body.excludeEventId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('URL check API error:', error);
    const message = error instanceof Error ? error.message : 'Failed to validate endpoint';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

