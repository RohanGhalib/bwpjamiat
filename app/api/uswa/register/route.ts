import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { upsertContact } from '@/lib/contacts';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      whatsapp,
      email,
      city,
      address,
      institution,
      college,
      degree,
      academicYear,
      motivation,
    } = body;

    const cleanFirstName = (firstName || '').trim();
    const cleanLastName = (lastName || '').trim();
    const fullName = `${cleanFirstName} ${cleanLastName}`.trim() || (body.name || '').trim();
    const cleanWhatsapp = (whatsapp || body.phone || '').trim();
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanCity = (city || address || '').trim();
    const cleanInstitution = (institution || college || '').trim();
    const cleanDegree = (degree || '').trim();
    const cleanYear = (academicYear || '').trim();
    const cleanMotivation = (motivation || '').trim();

    // 1. Validation
    if (!cleanFirstName || !cleanLastName || !cleanWhatsapp || !cleanEmail || !cleanInstitution || !cleanDegree) {
      return NextResponse.json(
        { error: 'Please fill in all required fields (Name, WhatsApp, Email, Institution, and Degree).' },
        { status: 400 }
      );
    }

    // 2. Duplicate Check in 'uswa_registrations' by email
    const regRef = collection(db, 'uswa_registrations');
    const q = query(regRef, where('email', '==', cleanEmail));
    const regSnap = await getDocs(q);

    if (!regSnap.empty) {
      const existingDoc = regSnap.docs[0].data();
      const existingPassId = existingDoc.passId || 'USWA-EXISTING';
      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        passId: existingPassId,
        message: 'You have already registered for USWA Summit! Your pass details have been loaded.',
      });
    }

    // 3. Generate Pass ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
    const passId = `USWA-26-${randomSuffix}`;
    const now = new Date().toISOString();

    // 4. Record to dedicated 'uswa_registrations' collection
    await addDoc(collection(db, 'uswa_registrations'), {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      name: fullName,
      whatsapp: cleanWhatsapp,
      email: cleanEmail,
      city: cleanCity,
      institution: cleanInstitution,
      degree: cleanDegree,
      academicYear: cleanYear,
      motivation: cleanMotivation,
      passId,
      status: 'Registered',
      registeredAt: now,
    });

    // 5. Ingest into Central Contacts CRM (Strict adherence to AGENTS.md)
    try {
      await upsertContact({
        name: fullName,
        phone: cleanWhatsapp,
        email: cleanEmail,
        city: cleanCity,
        institution: cleanInstitution,
        source: 'uswa',
        sourceEventTitle: 'USWA - The Prophetic Mindset',
        tags: ['uswa', 'uswa-summit-2026'],
        status: 'lead',
        customFields: {
          firstName: cleanFirstName,
          lastName: cleanLastName,
          institution: cleanInstitution,
          degree: cleanDegree,
          academicYear: cleanYear,
          passId,
          motivation: cleanMotivation,
        },
        isSubscribedToEmail: true,
      });
    } catch (contactErr) {
      console.error('[USWA Register Ingest Contact Error]:', contactErr);
    }

    // 6. Send Branded Confirmation Email
    try {
      await sendEmail({
        to: cleanEmail,
        fromName: 'USWA Summit - Jamiat BWP',
        fromEmail: 'info@bwpjamiat.org',
        subject: `Registration Confirmed: USWA Summit '26 (${passId})`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #16a34a; border-radius: 16px; overflow: hidden; background-color: #031c0a; color: #ffffff;">
            <!-- Header Banner -->
            <div style="background: linear-gradient(135deg, #04260d 0%, #0c4a1b 50%, #16a34a 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #22c55e;">
              <p style="color: #86efac; font-size: 12px; letter-spacing: 2.5px; text-transform: uppercase; margin: 0 0 8px 0; font-weight: 800;">Islami Jamiat-e-Talaba Bahawalpur</p>
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">USWA</h1>
              <p style="color: #bbf7d0; margin: 6px 0 0 0; font-size: 15px; font-style: italic; font-weight: 700; letter-spacing: 1px;">THE PROPHETIC MINDSET</p>
              <p style="color: #dcfce7; margin: 8px 0 0 0; font-size: 13px;">A 1-Day Summit on the Life & Legacy of Prophet Muhammad (SAW)</p>
            </div>
            
            <!-- Body Content -->
            <div style="padding: 28px 24px; background-color: #05240e;">
              <p style="font-size: 16px; margin: 0 0 16px 0; font-weight: 600; color: #f0fdf4;">Assalamu Alaikum ${fullName},</p>
              <p style="font-size: 14px; margin: 0 0 24px 0; color: #bbf7d0; line-height: 1.6;">
                Congratulations! Your registration for the **USWA: The Prophetic Mindset Summit** has been successfully received. We look forward to welcoming you to this transformative gathering.
              </p>

              <!-- Ticket Box -->
              <div style="background-color: #0a3315; border: 2px dashed #22c55e; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding-bottom: 12px; width: 60%; vertical-align: top;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #86efac; font-weight: 700; display: block;">Participant Name</span>
                      <strong style="font-size: 16px; color: #ffffff;">${fullName}</strong>
                    </td>
                    <td style="padding-bottom: 12px; width: 40%; vertical-align: top; text-align: right;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #86efac; font-weight: 700; display: block;">Pass ID</span>
                      <strong style="font-size: 16px; color: #4ade80; font-family: monospace;">${passId}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px; vertical-align: top;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #86efac; font-weight: 700; display: block;">Degree / Study</span>
                      <span style="font-size: 13px; color: #e2e8f0; font-weight: 600;">${cleanDegree}</span>
                    </td>
                    <td style="padding-bottom: 12px; vertical-align: top; text-align: right;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #86efac; font-weight: 700; display: block;">Institution</span>
                      <span style="font-size: 13px; color: #e2e8f0; font-weight: 600;">${cleanInstitution}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px; vertical-align: top;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #86efac; font-weight: 700; display: block;">Date & Day</span>
                      <span style="font-size: 13px; color: #ffffff; font-weight: 700;">Sunday, 20th September</span>
                    </td>
                    <td style="padding-bottom: 12px; vertical-align: top; text-align: right;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #86efac; font-weight: 700; display: block;">Entry Status</span>
                      <span style="font-size: 13px; color: #4ade80; font-weight: 700;">Free of Cost (Boys Only)</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top: 10px; border-top: 1px solid #14532d;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #86efac; font-weight: 700; display: block;">Summit Location</span>
                      <span style="font-size: 13px; color: #ffffff; font-weight: 700;">KIPS College, Model Town A, Bahawalpur</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Summit Guidance -->
              <div style="background-color: #063814; border: 1px solid #15803d; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 8px 0; color: #86efac; font-size: 13px; text-transform: uppercase; font-weight: 700;">Program Highlights:</h4>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #bbf7d0; line-height: 1.6;">
                  <li>Interactive Keynote Sessions on the Prophetic Mindset</li>
                  <li>Special Interactive Quiz Competition</li>
                  <li>Refreshments included for all registered attendees</li>
                  <li>Show this Pass ID (<strong>${passId}</strong>) on your smartphone upon arrival at KIPS College</li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #021206; padding: 16px; text-align: center; border-top: 1px solid #14532d; font-size: 12px; color: #86efac;">
              <p style="margin: 0 0 4px 0;">Islami Jamiat-e-Talaba Bahawalpur | USWA Summit</p>
              <p style="margin: 0;">Official Website: <strong>bwpjamiat.org/uswa</strong></p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('[USWA Register API] Email dispatch error:', emailErr);
      // Non-blocking for registration flow
    }

    return NextResponse.json({
      success: true,
      alreadyRegistered: false,
      passId,
      message: 'Registration successful! Your pass has been generated.',
    });
  } catch (error) {
    console.error('[USWA Register API] Internal Error:', error);
    return NextResponse.json({ error: 'Internal server error while processing registration.' }, { status: 500 });
  }
}
