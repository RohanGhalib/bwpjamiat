import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if the user is already registered in restart_camp_registrations
    const regRef = collection(db, 'restart_camp_registrations');
    const q = query(regRef, where('email', '==', cleanEmail));
    const regSnap = await getDocs(q);

    let alreadyRegistered = false;
    let registeredName = name;
    let existingData: any = null;

    if (!regSnap.empty) {
      alreadyRegistered = true;
      const docData = regSnap.docs[0].data();
      registeredName = docData.name;
      existingData = {
        name: docData.name,
        whatsapp: docData.whatsapp,
        college: docData.college,
        dob: docData.dob,
        rollNo: docData.rollNo,
        group: docData.group,
        subjects: docData.subjects || []
      };
    }

    // Generate 6-digit verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in firestore (expiration is checked during verification)
    const otpRef = doc(db, 'restart_camp_otps', cleanEmail);
    await setDoc(otpRef, {
      otp,
      name: registeredName,
      createdAt: new Date().toISOString()
    });

    // Send themed OTP verification email using our standard service
    await sendEmail({
      to: cleanEmail,
      fromName: "Restart Camp '26",
      fromEmail: 'no-reply@bwpjamiat.org',
      subject: alreadyRegistered 
        ? `Access Code: ${otp} - Retrieve/Modify Restart Camp '26 Pass`
        : `Verification Code: ${otp} - Restart Camp '26`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e8ed; border-radius: 12px; overflow: hidden; background-color: #fcf8f2; color: #2a1405;">
          <!-- Header -->
          <div style="background-color: #1b3526; padding: 24px; text-align: center; border-bottom: 3px solid #8b5a2e;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px;">RESTART CAMP '26</h1>
            <p style="color: #c27027; margin: 5px 0 0 0; font-size: 14px; font-weight: bold;">OTP Verification</p>
          </div>
          <!-- Body -->
          <div style="padding: 32px 24px; text-align: center;">
            <p style="font-size: 16px; margin: 0 0 20px 0; color: #2a1405; font-weight: bold;">Hello ${registeredName},</p>
            <p style="font-size: 14px; margin: 0 0 30px 0; color: #5a3a1d; line-height: 1.6;">
              ${alreadyRegistered 
                ? 'An active pass is already registered for this email. Use the code below to access your pass or make study group adjustments:' 
                : 'Thank you for registering for Restart Camp \'26. Please use the following 6-digit verification code to complete your registration:'}
            </p>
            <div style="background-color: #f4ebe1; border: 2px dashed #c09975; border-radius: 8px; padding: 15px 30px; display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #c27027; margin-bottom: 30px;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #a47347; margin: 0;">
              This code is valid for 10 minutes. If you did not request this code, please ignore this email.
            </p>
          </div>
          <!-- Footer -->
          <div style="background-color: #f5eade; padding: 15px; text-align: center; font-size: 12px; color: #a47347; border-top: 1px solid #d2bfa6;">
            Organized by Islami Jamiat e Talaba Bahawalpur
          </div>
        </div>
      `
    });

    return NextResponse.json({ 
      success: true,
      alreadyRegistered,
      name: registeredName,
      registration: existingData
    });
  } catch (error) {
    console.error('[Send OTP API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
