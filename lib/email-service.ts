import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type TemplateType =
  | 'request_received'
  | 'certificate_rejected'
  | 'certificate_approved'
  | 'certificate_generated'
  | 'certificate_regenerated'
  | 'certificate_otp';

type SendEmailInput = {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  fromName?: string;
  fromEmail?: string;
  subject?: string;
  html?: string;
  type?: TemplateType;
  data?: Record<string, string | number | boolean | undefined>;
  requireApiKey?: boolean;
};

function asRecipients(value?: string | string[]) {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  return value.split(',').map((entry) => entry.trim()).filter(Boolean);
}

function templatePayload(type: TemplateType, data: Record<string, string | number | boolean | undefined> = {}) {
  const name = String(data.name || 'Participant');
  const note = String(data.note || '');
  const otp = String(data.otp || '');
  const attachmentBase64 = String(data.attachmentBase64 || '');

  if (type === 'request_received') {
    return {
      subject: "Certificate Request Received - Ember'26",
      html: `<div style="font-family:sans-serif;color:#123962;max-width:600px;margin:0 auto;border:1px solid #eee;border-radius:10px;padding:20px;"><h2 style="color:#1C7F93;">Hello ${name},</h2><p>We have successfully received your request for the Ember'26 certificate.</p><p>Our team will verify your details and generate your official credential shortly.</p></div>`,
    };
  }

  if (type === 'certificate_rejected') {
    return {
      subject: "Certificate Request Update - Ember'26",
      html: `<div style="font-family:sans-serif;color:#123962;max-width:600px;margin:0 auto;border:1px solid #eee;border-radius:10px;padding:20px;"><h2 style="color:#dc2626;">Certificate Request Denied</h2><p>Hello ${name},</p><p>Your request for an Ember'26 certificate could not be fulfilled.</p><p><strong>Reason:</strong> ${note}</p></div>`,
    };
  }

  if (type === 'certificate_approved') {
    const base64Content = attachmentBase64.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, '');
    return {
      subject: "Your Official Ember'26 Certificate",
      html: `<div style="font-family:sans-serif;color:#123962;max-width:600px;margin:0 auto;border:1px solid #eee;border-radius:10px;padding:20px;"><h2 style="color:#1C7F93;">Congratulations ${name}!</h2><p>Your official Ember'26 certificate is attached with this email.</p></div>`,
      attachments: base64Content
        ? [
            {
              filename: `Ember_Certificate_${name.replace(/\s+/g, '_')}.pdf`,
              content: base64Content,
            },
          ]
        : [],
    };
  }

  if (type === 'certificate_generated' || type === 'certificate_regenerated') {
    const isRegenerated = type === 'certificate_regenerated';
    return {
      subject: isRegenerated ? 'Certificate RE-GENERATED!' : 'Certificate Generated!',
      html: `<div style="font-family:sans-serif;color:#123962;max-width:600px;margin:0 auto;border:1px solid #eee;border-radius:10px;padding:20px;"><h2 style="color:#1C7F93;">Hello ${name},</h2><p>Your Ember'26 certificate has been successfully ${isRegenerated ? 're-generated' : 'generated'}.</p></div>`,
    };
  }

  return {
    subject: `Verification Code: ${otp} - Ember'26`,
    html: `<div style="font-family:sans-serif;color:#123962;max-width:600px;margin:0 auto;border:1px solid #eee;border-radius:10px;padding:20px;"><h2 style="color:#1C7F93;">Certificate Verification</h2><p>Hello ${name},</p><p>Your OTP is: <strong>${otp}</strong></p></div>`,
  };
}

export async function sendEmail(input: SendEmailInput) {
  if (input.requireApiKey !== false && !process.env.RESEND_API_KEY) {
    return { success: true, warning: 'RESEND_API_KEY is not set. Email skipped.' };
  }

  const fromAddress = `${input.fromName || 'Bahawalpur Jamiat'} <${input.fromEmail || 'no-reply@bwpjamiat.org'}>`;
  const isTemplate = Boolean(input.type);
  const template = input.type ? templatePayload(input.type, input.data) : null;
  const subject = input.subject || template?.subject;
  const html = input.html || template?.html;

  if (!subject || !html) {
    throw new Error('Missing email subject or body.');
  }

  const response = await resend.emails.send({
    from: fromAddress,
    to: asRecipients(input.to) || [],
    cc: asRecipients(input.cc),
    bcc: asRecipients(input.bcc),
    subject,
    html,
    attachments: template && 'attachments' in template ? template.attachments : undefined,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return { success: true, templateMode: isTemplate, data: response.data };
}

