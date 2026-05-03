import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { memberId, phone } = await request.json();

    if (!memberId || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch member from Firestore
    const memberRef = doc(db, 'ember_team', memberId);
    const memberSnap = await getDoc(memberRef);

    if (!memberSnap.exists()) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const memberData = memberSnap.data();

    // 2. Verify Phone (Compare on server)
    const normalizedInputPhone = phone.replace(/\s+/g, '').slice(-10);
    const normalizedRecordPhone = (memberData.phone || '').replace(/\s+/g, '').slice(-10);

    if (normalizedInputPhone !== normalizedRecordPhone) {
      return NextResponse.json({ error: 'Phone number does not match our records.' }, { status: 403 });
    }

    if (!memberData.email) {
      return NextResponse.json({ error: 'No email found for this record. Contact admin.' }, { status: 400 });
    }

    // 3. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 4. Save OTP for validation
    const otpRef = doc(db, 'otp_verifications', memberId);
    await setDoc(otpRef, {
      otp,
      createdAt: new Date().toISOString(),
      email: memberData.email
    });

    // 5. Send OTP via Email
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = request.headers.get('host');
    
    await fetch(`${protocol}://${host}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: memberData.email,
        type: 'certificate_otp',
        data: { name: memberData.name, otp }
      })
    });

    const emailParts = memberData.email.split('@');
    const maskedEmail = `${emailParts[0].slice(0, 3)}***@${emailParts[1]}`;

    // SECURE: We no longer reveal if it's a re-generation here. 
    // The user MUST pass OTP first.
    return NextResponse.json({ 
      success: true, 
      maskedEmail 
    });

  } catch (error: any) {
    console.error('[Verify Identity API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
