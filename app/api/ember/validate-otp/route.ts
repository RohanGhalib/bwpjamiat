import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { memberId, otp } = await request.json();

    if (!memberId || !otp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const otpRef = doc(db, 'otp_verifications', memberId);
    const otpSnap = await getDoc(otpRef);

    if (!otpSnap.exists()) {
      return NextResponse.json({ error: 'Verification expired or not found. Please restart.' }, { status: 404 });
    }

    const data = otpSnap.data();

    if (data.otp !== otp) {
      return NextResponse.json({ error: 'Invalid verification code.' }, { status: 403 });
    }

    // OTP is valid! Delete it
    await deleteDoc(otpRef);

    // Fetch member details
    const memberRef = doc(db, 'ember_team', memberId);
    const memberSnap = await getDoc(memberRef);
    const memberData = memberSnap.data();

    if (!memberData) throw new Error("Member data not found");

    // SECURE GENERATION: Create the record on the server
    const docRef = await addDoc(collection(db, 'certificate_requests'), {
      memberId: memberId,
      name: memberData.name,
      department: memberData.department,
      certificateType: memberData.department === 'Participant' ? 'Participation' : 'Appreciation',
      email: memberData.email || '',
      phone: memberData.phone || '',
      status: 'generated',
      requestedAt: new Date().toISOString()
    });

    // TRIGGER CONGRATULATIONS EMAIL
    if (memberData.email) {
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = request.headers.get('host');
      
      fetch(`${protocol}://${host}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: memberData.email,
          type: 'certificate_generated',
          data: { name: memberData.name }
        })
      }).catch(err => console.error("Failed to send congratulations email from server:", err));
    }

    return NextResponse.json({ 
      success: true,
      certificateId: docRef.id,
      member: {
        id: memberId,
        name: memberData.name,
        department: memberData.department,
        role: memberData.role,
        gender: memberData.gender
      }
    });

  } catch (error: any) {
    console.error('[Validate OTP API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
