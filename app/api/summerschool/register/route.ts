import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { sendEmail } from '@/lib/email-service';
import { upsertContact } from '@/lib/contacts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      whatsapp,
      email,
      classLevel,
      institute,
      address,
      whyJoining,
      isMale
    } = body;

    // 1. Validation
    if (!name?.trim() || !whatsapp?.trim() || !email?.trim() || !classLevel?.trim() || !institute?.trim() || !address?.trim() || !whyJoining?.trim()) {
      return NextResponse.json({ error: 'Please fill in all required registration fields.' }, { status: 400 });
    }

    if (!isMale) {
      return NextResponse.json({ error: 'This summer camp session is strictly for male students (Boys).' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanWhatsapp = whatsapp.trim();

    // 2. Check existing registration by email
    const regRef = collection(db, 'summer_school_registrations');
    const q = query(regRef, where('email', '==', cleanEmail));
    const regSnap = await getDocs(q);

    let passId = '';
    let isAlreadyRegistered = false;

    if (!regSnap.empty) {
      isAlreadyRegistered = true;
      const existingDoc = regSnap.docs[0];
      const docId = existingDoc.id;
      passId = existingDoc.data().passId || `SC-26-${Math.floor(10000 + Math.random() * 90000)}`;

      // Update existing record
      const docRef = doc(db, 'summer_school_registrations', docId);
      await updateDoc(docRef, {
        name: name.trim(),
        whatsapp: cleanWhatsapp,
        classLevel: classLevel.trim(),
        institute: institute.trim(),
        address: address.trim(),
        whyJoining: whyJoining.trim(),
        updatedAt: new Date().toISOString()
      });
    } else {
      // Create new registration
      const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
      passId = `SC-26-${randomSuffix}`;

      await addDoc(collection(db, 'summer_school_registrations'), {
        name: name.trim(),
        whatsapp: cleanWhatsapp,
        email: cleanEmail,
        classLevel: classLevel.trim(),
        institute: institute.trim(),
        address: address.trim(),
        whyJoining: whyJoining.trim(),
        gender: 'Male',
        passId,
        registeredAt: new Date().toISOString()
      });
    }

    // 3. Central Contacts CRM Ingestion
    try {
      await upsertContact({
        name: name.trim(),
        phone: cleanWhatsapp,
        email: cleanEmail,
        city: address.trim(),
        institution: institute.trim(),
        source: 'summer_school',
        sourceEventTitle: 'AI Summer Camp',
        tags: ['summer_school', 'summer-camp-2026'],
        status: 'lead',
        customFields: {
          classLevel: classLevel.trim(),
          passId,
          whyJoining: whyJoining.trim(),
          gender: 'Male',
        },
      });
    } catch (contactErr) {
      console.error('[SummerSchool Ingest Contact Error]:', contactErr);
    }

    // 3. Send HTML Confirmation Email
    try {
      await sendEmail({
        to: cleanEmail,
        fromName: "Summer Camp - Jamiat BWP",
        fromEmail: "info@bwpjamiat.org",
        subject: isAlreadyRegistered 
          ? `Registration Details Updated: Summer Camp '26 (${passId})`
          : `Registration Confirmed: Summer Camp '26 (${passId})`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #10b981; border-radius: 16px; overflow: hidden; background-color: #0d1b2a; color: #ffffff;">
            <!-- Header Banner -->
            <div style="background: linear-gradient(135deg, #0f2b46 0%, #0d3b66 50%, #10b981 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #10b981;">
              <h2 style="color: #6ee7b7; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 8px 0; font-weight: 700;">Islami Jamiat-e-Talaba Bahawalpur</h2>
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">SUMMER CAMP 2026</h1>
              <p style="color: #a7f3d0; margin: 8px 0 0 0; font-size: 14px; font-weight: 600;">Prompt Engineering & AI Tools Expertise</p>
            </div>
            
            <!-- Body Content -->
            <div style="padding: 28px 24px; background-color: #0f172a;">
              <p style="font-size: 16px; margin: 0 0 16px 0; font-weight: 600; color: #f1f5f9;">Dear ${name},</p>
              <p style="font-size: 14px; margin: 0 0 24px 0; color: #94a3b8; line-height: 1.6;">
                ${isAlreadyRegistered 
                  ? 'Your summer camp registration details have been updated successfully! Below is your official entry pass for the upcoming session.'
                  : 'Congratulations! Your registration for the **AI & Prompt Engineering Summer Camp** has been successfully confirmed. Below are your official camp pass details.'}
              </p>

              <!-- Ticket Box -->
              <div style="background-color: #1e293b; border: 2px dashed #10b981; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding-bottom: 12px; width: 60%; vertical-align: top;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; display: block;">Participant Name</span>
                      <strong style="font-size: 15px; color: #f8fafc;">${name}</strong>
                    </td>
                    <td style="padding-bottom: 12px; width: 40%; vertical-align: top; text-align: right;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; display: block;">Pass ID</span>
                      <strong style="font-size: 15px; color: #10b981; font-family: monospace;">${passId}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px; vertical-align: top;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; display: block;">Class / Grade</span>
                      <span style="font-size: 13px; color: #cbd5e1; font-weight: 600;">${classLevel}</span>
                    </td>
                    <td style="padding-bottom: 12px; vertical-align: top; text-align: right;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; display: block;">Institute</span>
                      <span style="font-size: 13px; color: #cbd5e1; font-weight: 600;">${institute}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px; vertical-align: top;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; display: block;">Dates</span>
                      <span style="font-size: 13px; color: #34d399; font-weight: 700;">3rd August – 19th August (15 Days)</span>
                    </td>
                    <td style="padding-bottom: 12px; vertical-align: top; text-align: right;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; display: block;">Timing</span>
                      <span style="font-size: 13px; color: #34d399; font-weight: 700;">10:00 AM – 12:00 PM (Morning)</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding-top: 8px; border-top: 1px solid #334155;">
                      <span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; display: block;">Venue Location</span>
                      <span style="font-size: 13px; color: #f8fafc; font-weight: 600;">Al-Khidmat Office, Bahawalpur</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Camp Instructions -->
              <div style="background-color: #092c24; border: 1px solid #059669; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 8px 0; color: #6ee7b7; font-size: 13px; text-transform: uppercase; font-weight: 700;">Key Instructions:</h4>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #a7f3d0; line-height: 1.6;">
                  <li>Session starts sharply at <strong>10:00 AM</strong> starting <strong>3rd August</strong>. Please arrive 10 minutes early.</li>
                  <li>Bring your smartphone or laptop if available for practical hands-on exercises.</li>
                  <li>This session is strictly reserved for registered male students.</li>
                  <li>Show this Pass ID (<strong>${passId}</strong>) on your smartphone upon entrance.</li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #0b1329; padding: 16px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;">
              <p style="margin: 0 0 4px 0;">Islami Jamiat-e-Talaba Bahawalpur | Summer Camp 2026</p>
              <p style="margin: 0;">For queries, contact us on WhatsApp: <strong>${cleanWhatsapp}</strong></p>
            </div>
          </div>
        `
      });
    } catch (emailErr) {
      console.error('[SummerSchool Register] Email error:', emailErr);
      // Non-blocking for registration completion
    }

    return NextResponse.json({
      success: true,
      passId,
      alreadyRegistered: isAlreadyRegistered,
      message: isAlreadyRegistered
        ? 'Registration details updated successfully!'
        : 'Registration successful! Confirmation email has been sent.'
    });

  } catch (error) {
    console.error('[SummerSchool Register API] Error:', error);
    return NextResponse.json({ error: 'Internal server error while saving registration.' }, { status: 500 });
  }
}
