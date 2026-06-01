import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { sendEmail } from '@/lib/email-service';

// Centralized mock schedule data mapping
const subjectSchedule = {
  "Physics": {
    date: "Thu, Jun 18",
    time: "09:00 AM - 12:00 PM",
    location: "Gromers Academy Hall A"
  },
  "Chemistry": {
    date: "Fri, Jun 19",
    time: "09:00 AM - 12:00 PM",
    location: "KIPS Academy Auditorium"
  },
  "Biology": {
    date: "Sat, Jun 20",
    time: "09:00 AM - 11:30 AM",
    location: "Base Academy Room 302"
  },
  "Mathematics": {
    date: "Sat, Jun 20",
    time: "12:00 PM - 02:30 PM",
    location: "Unique Academy Main Hall"
  },
  "Computer Science": {
    date: "Sat, Jun 20",
    time: "03:00 PM - 05:30 PM",
    location: "Unique Academy Comp Lab"
  },
  "Grand Finale": {
    date: "Sun, Jun 21",
    time: "10:00 AM - 01:00 PM",
    location: "Grand Auditorium Main Hall"
  }
};

export async function POST(request: Request) {
  try {
    const { name, whatsapp, college, email, dob, rollNo, group, subjects, otp } = await request.json();

    if (!name || !whatsapp || !college || !email || !dob || !rollNo || !group || !otp) {
      return NextResponse.json({ error: 'Missing required registration fields' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Verify OTP
    const otpRef = doc(db, 'restart_camp_otps', cleanEmail);
    const otpSnap = await getDoc(otpRef);

    if (!otpSnap.exists()) {
      return NextResponse.json({ error: 'Verification code expired or not found. Please resend.' }, { status: 404 });
    }

    const otpData = otpSnap.data();

    // Check expiration (10 minutes = 600,000 ms)
    const createdAt = new Date(otpData.createdAt).getTime();
    const now = new Date().getTime();
    if (now - createdAt > 600000) {
      await deleteDoc(otpRef);
      return NextResponse.json({ error: 'Verification code expired. Please request a new one.' }, { status: 410 });
    }

    if (otpData.otp !== otp.trim()) {
      return NextResponse.json({ error: 'Invalid verification code.' }, { status: 403 });
    }

    // 2. Check if user is already registered in restart_camp_registrations
    const regRef = collection(db, 'restart_camp_registrations');
    const q = query(regRef, where('email', '==', cleanEmail));
    const regSnap = await getDocs(q);

    let finalPassId = '';
    let isUpdate = false;
    let docId = '';

    if (!regSnap.empty) {
      // User already registered: Update existing document
      isUpdate = true;
      const existingDoc = regSnap.docs[0];
      docId = existingDoc.id;
      finalPassId = existingDoc.data().passId;

      const docRef = doc(db, 'restart_camp_registrations', docId);
      await updateDoc(docRef, {
        name,
        whatsapp,
        college,
        dob,
        rollNo,
        group,
        subjects: subjects || [],
        updatedAt: new Date().toISOString()
      });
    } else {
      // New user registration
      const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
      finalPassId = `RST-26-${randomSuffix}`;

      await addDoc(collection(db, 'restart_camp_registrations'), {
        name,
        whatsapp,
        college,
        email: cleanEmail,
        dob,
        rollNo,
        group,
        subjects: subjects || [],
        passId: finalPassId,
        registeredAt: new Date().toISOString()
      });
    }

    // 3. Delete verified OTP record
    await deleteDoc(otpRef);

    // 4. Generate QR code link using qrserver API (highly compatible in HTML emails)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${finalPassId}&color=2a1405&bgcolor=f5eade`;

    // Translate Group label for presentation
    const groupLabels: Record<string, string> = {
      'fsc-med': 'FSc Pre-Medical',
      'fsc-eng': 'FSc Pre-Engineering',
      'ics': 'ICS (Computer Science)'
    };
    const displayGroup = groupLabels[group] || group;

    // 5. Generate dynamic class schedule HTML rows
    let scheduleRowsHtml = '';
    for (const sub of (subjects || [])) {
      const sched = subjectSchedule[sub as keyof typeof subjectSchedule];
      if (sched) {
        scheduleRowsHtml += `
          <tr style="border-bottom: 1px solid #d2bfa6;">
            <td style="padding: 8px 0; font-size: 13px; font-weight: bold; color: #1b3526; text-align: left;">
              ${sub}<br/>
              <span style="font-size: 10px; font-weight: normal; color: #a47347;">${sched.location}</span>
            </td>
            <td style="padding: 8px 0; font-size: 12px; text-align: right; color: #5a3a1d; vertical-align: top;">
              <strong>${sched.date}</strong><br/>
              <span style="font-size: 10px; opacity: 0.8;">${sched.time}</span>
            </td>
          </tr>
        `;
      }
    }
    // Add Grand Finale
    const finale = subjectSchedule["Grand Finale"];
    scheduleRowsHtml += `
      <tr>
        <td style="padding: 8px 0; font-size: 13px; font-weight: bold; color: #c27027; text-align: left;">
          Grand Finale (Mandatory)<br/>
          <span style="font-size: 10px; font-weight: normal; color: #a47347;">${finale.location}</span>
        </td>
        <td style="padding: 8px 0; font-size: 12px; text-align: right; color: #5a3a1d; vertical-align: top;">
          <strong>${finale.date}</strong><br/>
          <span style="font-size: 10px; opacity: 0.8;">${finale.time}</span>
        </td>
      </tr>
    `;

    // 6. Send event-themed HTML ticket email
    await sendEmail({
      to: cleanEmail,
      fromName: "Restart Camp '26",
      fromEmail: 'no-reply@bwpjamiat.org',
      subject: isUpdate 
        ? `Updated Pass: Restart Camp '26 (${finalPassId})` 
        : `Your Pass: Restart Camp '26 (${finalPassId})`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #8b5a2e; border-radius: 16px; overflow: hidden; background-color: #fcf8f2; color: #2a1405; box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
          <!-- Header (Chalkboard style) -->
          <div style="background-color: #1b3526; padding: 30px 20px; text-align: center; border-bottom: 4px solid #8b5a2e;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 3px; font-weight: 800;">RESTART CAMP '26</h1>
            <p style="color: #c27027; margin: 8px 0 0 0; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">Official Entry Ticket</p>
          </div>
          
          <!-- Content Body -->
          <div style="padding: 30px 24px;">
            <p style="font-size: 16px; margin: 0 0 10px 0; font-weight: bold;">Hello ${name},</p>
            <p style="font-size: 14px; margin: 0 0 25px 0; color: #5a3a1d; line-height: 1.5;">
              ${isUpdate 
                ? 'Your registration details have been updated. Here is your revised entry pass ticket details for **Restart Camp \'26**:'
                : 'Your email has been verified and your digital pass for **Restart Camp \'26** has been issued. Please keep this email safe. You can show the QR code below at the entrance for verification.'}
            </p>

            <!-- Cardboard Ticket Container -->
            <div style="background-color: #f5eade; border: 2px solid #d2bfa6; border-radius: 12px; padding: 24px; position: relative;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding-bottom: 15px; width: 65%; vertical-align: top; text-align: left;">
                    <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #a47347; display: block; margin-bottom: 2px;">Attendee Name</span>
                    <strong style="font-size: 16px; color: #2a1405;">${name}</strong>
                  </td>
                  <td style="padding-bottom: 15px; width: 35%; vertical-align: top; text-align: right;">
                    <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #a47347; display: block; margin-bottom: 2px;">Pass ID</span>
                    <strong style="font-size: 16px; color: #c27027; font-family: monospace;">${finalPassId}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 15px; vertical-align: top; text-align: left;">
                    <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #a47347; display: block; margin-bottom: 2px;">College / Institute</span>
                    <span style="font-size: 13px; font-weight: 700; color: #3b2314;">${college}</span>
                  </td>
                  <td style="padding-bottom: 15px; vertical-align: top; text-align: right;">
                    <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #a47347; display: block; margin-bottom: 2px;">Matric Roll No</span>
                    <span style="font-size: 13px; font-weight: 700; color: #3b2314;">${rollNo}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 15px; vertical-align: top; text-align: left;">
                    <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #a47347; display: block; margin-bottom: 2px;">Study Group</span>
                    <span style="font-size: 13px; font-weight: 700; color: #3b2314;">${displayGroup}</span>
                  </td>
                  <td style="padding-bottom: 15px; vertical-align: top; text-align: right;">
                    <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #a47347; display: block; margin-bottom: 2px;">Date of Birth</span>
                    <span style="font-size: 13px; font-weight: 700; color: #3b2314;">${dob}</span>
                  </td>
                </tr>
                
                <!-- Dynamic Schedule Table in Email -->
                <tr>
                  <td colspan="2" style="padding-top: 15px; border-top: 1px dashed #d2bfa6;">
                    <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #a47347; display: block; margin-bottom: 6px; text-align: left;">Your Class Schedule</span>
                    <table style="width: 100%; border-collapse: collapse;">
                      ${scheduleRowsHtml}
                    </table>
                  </td>
                </tr>

                <tr>
                  <td colspan="2" style="padding-top: 20px; border-top: 1px dashed #d2bfa6; text-align: center;">
                    <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #a47347; display: block; margin-bottom: 10px;">Entrance Verification QR Code</span>
                    <img src="${qrCodeUrl}" alt="Pass QR" style="border: 2px solid #8b5a2e; border-radius: 8px; width: 150px; height: 150px;" />
                  </td>
                </tr>
              </table>
            </div>

            <!-- Event Details Checklist -->
            <div style="margin-top: 25px; background-color: #fcf8f2; border: 1px solid #d2bfa6; border-radius: 8px; padding: 15px;">
              <h3 style="font-size: 13px; margin: 0 0 10px 0; color: #8b5a2e; text-transform: uppercase; font-weight: 800;">Camp Instructions:</h3>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #5a3a1d; line-height: 1.6;">
                <li>Bring a digital or printed copy of this email ticket.</li>
                <li>Reach the venue 15 minutes before the scheduled class time.</li>
                <li>Make sure to attend Day 4 (closing ceremony) to collect physical guess papers booklet.</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f5eade; padding: 20px 15px; text-align: center; font-size: 12px; color: #a47347; border-top: 1px solid #d2bfa6;">
            <p style="margin: 0 0 5px 0; font-weight: bold;">Restart Camp '26 | Islami Jamiat e Talaba Bahawalpur</p>
            <p style="margin: 0; color: #c09975;">Need help? Reply to this email or reach us on WhatsApp.</p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true, passId: finalPassId });
  } catch (error) {
    console.error('[Register API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
