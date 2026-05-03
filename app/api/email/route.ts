import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY is not set. Email will not be sent.');
      return NextResponse.json({ success: true, warning: 'API key missing, email skipped.' });
    }

    const body = await request.json();
    const { to, type, data } = body;

    console.log(`[Email API] Sending ${type} to ${to}`);

    if (!to || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let subject = '';
    let html = '';
    let attachments: any[] = [];

    // The 'from' address must be verified in Resend.
    // Using a generic domain or Resend's testing domain if not specified.
    const fromAddress = 'Ember Team <no-reply@bwpjamiat.org>';

    if (type === 'request_received') {
      subject = "Certificate Request Received - Ember'26";
      html = `
        <div style="font-family: sans-serif; color: #123962; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
          <h2 style="color: #1C7F93;">Hello ${data.name},</h2>
          <p>We have successfully received your request for the Ember'26 certificate.</p>
          <p>Our team will verify your details and generate your official credential shortly. You will receive another email with your certificate attached once it is approved.</p>
          <br/>
          <p style="font-size: 12px; color: #666;">This is an automated message from the Ember'26 Organizing Committee.</p>
        </div>
      `;
    } else if (type === 'certificate_rejected') {
      subject = "Certificate Request Update - Ember'26";
      html = `
        <div style="font-family: sans-serif; color: #123962; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
          <h2 style="color: #dc2626;">Certificate Request Denied</h2>
          <p>Hello ${data.name},</p>
          <p>We regret to inform you that your request for an Ember'26 certificate could not be fulfilled at this time.</p>
          <div style="background-color: #fee2e2; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
            <p style="margin: 0; color: #991b1b;"><strong>Reason provided by administration:</strong><br/>${data.note}</p>
          </div>
          <p>If you believe this is an error, please contact the organizing committee.</p>
          <br/>
          <p style="font-size: 12px; color: #666;">This is an automated message from the Ember'26 Organizing Committee.</p>
        </div>
      `;
    } else if (type === 'certificate_approved') {
      subject = "Your Official Ember'26 Certificate";
      html = `
        <div style="font-family: sans-serif; color: #123962; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
          <h2 style="color: #1C7F93;">Congratulations ${data.name}!</h2>
          <p>Your official Ember'26 certificate has been generated and is attached to this email as a PDF.</p>
          <p>You can also verify the authenticity of your certificate at any time using the QR code printed on it.</p>
          <br/>
          <p>Thank you for being a part of South Punjab's First Teen Hackathon!</p>
          <br/>
          <p style="font-size: 12px; color: #666;">This is an automated message from the Ember'26 Organizing Committee.</p>
        </div>
      `;

      if (data.attachmentBase64) {
        // Remove the data URI prefix if present (e.g., "data:application/pdf;base64,")
        const base64Content = data.attachmentBase64.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, "");
        
        attachments.push({
          filename: `Ember_Certificate_${data.name.replace(/\s+/g, '_')}.pdf`,
          content: base64Content,
        });
      }
    } else if (type === 'certificate_generated') {
      subject = "Certificate Generated!";
      html = `
        <div style="font-family: sans-serif; color: #123962; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
          <h2 style="color: #1C7F93;">Hello ${data.name},</h2>
          <p>Your Ember'26 certificate has been successfully generated!</p>
          <p>Thank you for your incredible contribution to Ember'26. We truly appreciate your talent, dedication, and the energy you brought to the event.</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #1C7F93;">
            <p style="margin: 0; font-style: italic; color: #123962;">
              "It was an absolute pleasure having you with us. Your hard work has made a real impact, and we look forward to seeing you again soon Insha'Allah!"
            </p>
            <p style="margin-top: 10px; font-weight: bold;">— Rohan Ghalib, President Ember'26</p>
          </div>
          
          <p>Stay connected: <a href="https://rohanghalib.com" style="color: #1C7F93; font-weight: bold; text-decoration: none;">rohanghalib.com</a></p>
          
          <br/>
          <p style="font-size: 12px; color: #666;">This is an automated message from the Ember'26 Organizing Committee.</p>
        </div>
      `;
    } else if (type === 'certificate_otp') {
      subject = `Verification Code: ${data.otp} - Ember'26`;
      html = `
        <div style="font-family: sans-serif; color: #123962; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
          <h2 style="color: #1C7F93;">Certificate Verification</h2>
          <p>Hello ${data.name},</p>
          <p>You are requesting your official Ember'26 certificate. Please use the following one-time password (OTP) to verify your identity:</p>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 10px; margin: 25px 0; border: 2px dashed #1C7F93;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 10px; color: #123962;">${data.otp}</span>
          </div>
          <p>This code will expire shortly. If you did not request this certificate, please ignore this email.</p>
          <br/>
          <p style="font-size: 12px; color: #666;">This is an automated message from the Ember'26 Organizing Committee.</p>
        </div>
      `;
    } else {
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    const emailResponse = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
      attachments,
    });

    console.log('[Email API] Resend response:', emailResponse);

    if (emailResponse.error) {
      throw new Error(emailResponse.error.message);
    }

    return NextResponse.json({ success: true, data: emailResponse });
  } catch (error: any) {
    console.error('[Email API] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
