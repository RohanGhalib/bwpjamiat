import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/email-service';

type EmailApiRequest = {
  mode?: 'template' | 'custom';
  to?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  fromName?: string;
  fromEmail?: string;
  subject?: string;
  html?: string;
  type?:
    | 'request_received'
    | 'certificate_rejected'
    | 'certificate_approved'
    | 'certificate_generated'
    | 'certificate_regenerated'
    | 'certificate_otp';
  data?: Record<string, string | number | boolean | undefined>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EmailApiRequest;
    // Backward-compatible inference: existing callers that send `type` are treated as template emails.
    const mode = body.mode || (body.type ? 'template' : 'custom');
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get('admin_auth')?.value === 'authenticated';

    if (!body.to) {
      return NextResponse.json({ error: 'Missing required field: to' }, { status: 400 });
    }

    if (mode === 'custom') {
      if (!isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else if (!isAuthenticated) {
      // Template email mode is allowed from admin sessions and trusted internal server routes only.
      const internalToken = request.headers.get('x-internal-email-token');
      if (!internalToken || internalToken !== process.env.INTERNAL_EMAIL_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized template email request' }, { status: 401 });
      }
    }

    const result = await sendEmail({
      to: body.to,
      cc: body.cc,
      bcc: body.bcc,
      fromName: body.fromName || (mode === 'template' ? 'Ember Team' : 'Bahawalpur Jamiat'),
      fromEmail: body.fromEmail || 'no-reply@bwpjamiat.org',
      subject: body.subject,
      html: body.html,
      type: body.type,
      data: body.data,
      requireApiKey: true,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Email API] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send email';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
