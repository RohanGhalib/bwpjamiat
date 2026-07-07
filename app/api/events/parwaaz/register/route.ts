import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const { name, phone, email, gender, lastInstitution, expectedField, city } = await request.json();

    // 1. Basic validation
    if (!name || !phone || !email || !gender || !lastInstitution || !expectedField) {
      return NextResponse.json({ error: 'Missing required registration fields' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();
    const resolvedCity = city?.trim() || 'Bahawalpur';

    // 2. Save registration details in Firestore under parwaaz_registrations
    const regData = {
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      gender,
      lastInstitution: lastInstitution.trim(),
      expectedField,
      city: resolvedCity,
      submittedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'parwaaz_registrations'), regData);

    // 3. Build Google Calendar link for the email
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Parwaaz+Career+Counselling+Seminar&dates=20260709T043000Z/20260709T063000Z&details=Confused+about+your+career+after+Intermediate?+This+seminar+is+for+you!+Join+us+for+expert+guidance+and+counselling.&location=E-Library,+Dring+Stadium,+Bahawalpur`;

    // 4. Construct a beautiful themed HTML email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Confirmed - Parwaaz Seminar</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f6; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.05); border: 1px solid #eef2f1;">
                
                <!-- Email Header -->
                <tr>
                  <td align="center" style="background: linear-gradient(135deg, #021a15 0%, #052c24 100%); padding: 40px 20px; border-bottom: 4px solid #eab308;">
                    <div style="color: #ffffff; font-size: 11px; font-weight: 800; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 12px; opacity: 0.8;">Islami Jamiat-e-Talaba Bahawalpur</div>
                    <h1 style="color: #ffffff; font-size: 38px; font-weight: 900; margin: 0; letter-spacing: 2px; text-transform: uppercase; line-height: 1;">PARWAAZ</h1>
                    <div style="color: #eab308; font-size: 15px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Career Counselling Seminar</div>
                  </td>
                </tr>

                <!-- Email Body -->
                <tr>
                  <td style="padding: 40px 30px; color: #2d3748;">
                    <h2 style="color: #052c24; font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 20px; text-align: center;">Registration Confirmed!</h2>
                    
                    <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
                      Assalam-o-Alaikum <strong>${name.trim()}</strong>,
                    </p>
                    
                    <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 25px;">
                      We are pleased to confirm your registration for the <strong>Parwaaz Career Counselling Seminar</strong>. If you have recently completed your Intermediate (FSc / ICS / I.Com / FA) and are seeking clarity regarding your university options and future career path, this seminar is designed specifically for you.
                    </p>

                    <!-- Event Info Cards -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px; background-color: #f7faf9; border-radius: 12px; padding: 20px; border: 1px solid #e6eeec;">
                      <tr>
                        <td style="padding-bottom: 12px; font-size: 14px; color: #718096;">
                          <strong style="color: #052c24;">Date:</strong> Thursday, 9th July 2026
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px; font-size: 14px; color: #718096;">
                          <strong style="color: #052c24;">Time:</strong> 09:30 AM - 11:30 AM (PKT)
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px; font-size: 14px; color: #718096;">
                          <strong style="color: #052c24;">Venue:</strong> E-Library, Dring Stadium, Bahawalpur
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; color: #718096;">
                          <strong style="color: #052c24;">Entry Fee:</strong> <span style="background-color: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Free Entry</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Add to Calendar Button -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                      <tr>
                        <td align="center">
                          <a href="${calendarUrl}" target="_blank" style="background-color: #052c24; color: #ffffff; padding: 14px 28px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(5, 44, 36, 0.15); border: 1px solid #031a15; transition: background-color 0.2s;">
                            📅 Add to Google Calendar
                          </a>
                        </td>
                      </tr>
                    </table>

                    <hr style="border: 0; border-top: 1px solid #edf2f0; margin-bottom: 25px;">

                    <!-- Important Information -->
                    <h3 style="font-size: 16px; font-weight: 700; color: #052c24; margin-top: 0; margin-bottom: 10px;">Important Instructions:</h3>
                    <ul style="padding-left: 20px; font-size: 14px; line-height: 1.5; color: #4a5568; margin-bottom: 0;">
                      <li style="margin-bottom: 8px;">Please arrive 15 minutes before the scheduled time to secure your seat.</li>
                      <li style="margin-bottom: 8px;">Show this email confirmation on your mobile phone at the reception desk for smooth entry.</li>
                      <li style="margin-bottom: 8px;">Bring a notepad and pen to jot down critical tips from our expert speakers.</li>
                    </ul>

                  </td>
                </tr>

                <!-- Email Footer -->
                <tr>
                  <td align="center" style="background-color: #f7faf9; padding: 30px; border-top: 1px solid #edf2f0; text-align: center; color: #718096; font-size: 12px;">
                    <p style="margin: 0 0 8px 0; font-weight: bold; color: #4a5568;">Islami Jamiat-e-Talaba Bahawalpur</p>
                    <p style="margin: 0 0 16px 0; line-height: 1.4;">Empowering students, nurturing character, and building futures across Bahawalpur.</p>
                    <div style="margin-bottom: 0;">
                      <span style="display: inline-block; padding: 0 8px; color: #052c24; font-weight: bold;">@jamiat.bwp</span>
                    </div>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // 5. Send confirmation email using Resend
    let emailWarning = undefined;
    try {
      await sendEmail({
        to: cleanEmail,
        fromName: 'Jamiat Bahawalpur',
        subject: 'Registration Confirmed: Parwaaz Career Counselling Seminar',
        html: emailHtml,
        requireApiKey: true // Skips cleanly if RESEND_API_KEY is not defined in development
      });
    } catch (emailError: any) {
      console.error('Email failed to send, but registration was saved:', emailError);
      emailWarning = 'Registration succeeded, but confirmation email could not be sent.';
    }

    return NextResponse.json({
      success: true,
      registrationId: docRef.id,
      emailWarning
    });

  } catch (error: any) {
    console.error('Error in Parwaaz registration API:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during registration.' }, { status: 500 });
  }
}
