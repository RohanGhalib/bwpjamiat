import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { cookies } from 'next/headers';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Basic Admin Auth Check
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get("admin_auth")?.value === "authenticated";

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Resend API key is not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { to, cc, bcc, subject, html, fromName, fromEmail } = body;

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields (to, subject, html)' }, { status: 400 });
    }

    // Use custom sender or default
    const finalFromName = fromName || 'Bahawalpur Jamiat';
    const finalFromEmail = fromEmail || 'info@bwpjamiat.org';
    const fromAddress = `${finalFromName} <${finalFromEmail}>`;

    const emailResponse = await resend.emails.send({
      from: fromAddress,
      to: typeof to === 'string' ? to.split(',').map(e => e.trim()) : to,
      cc: cc ? (typeof cc === 'string' ? cc.split(',').map(e => e.trim()) : cc) : undefined,
      bcc: bcc ? (typeof bcc === 'string' ? bcc.split(',').map(e => e.trim()) : bcc) : undefined,
      subject,
      html,
    });

    if (emailResponse.error) {
      console.error('[Admin Email API] Resend error:', emailResponse.error);
      return NextResponse.json({ error: emailResponse.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: emailResponse.data });
  } catch (error: any) {
    console.error('[Admin Email API] Server error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
