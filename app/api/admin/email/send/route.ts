import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_auth')?.value === 'authenticated';

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as {
      to?: string | string[];
      cc?: string | string[];
      bcc?: string | string[];
      subject?: string;
      html?: string;
      fromName?: string;
      fromEmail?: string;
    };

    if (!body.to || !body.subject || !body.html) {
      return NextResponse.json({ error: 'Missing required fields (to, subject, html)' }, { status: 400 });
    }

    const result = await sendEmail({
      to: body.to,
      cc: body.cc,
      bcc: body.bcc,
      subject: body.subject,
      html: body.html,
      fromName: body.fromName,
      fromEmail: body.fromEmail,
      requireApiKey: true,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Admin Email API] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send email';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

