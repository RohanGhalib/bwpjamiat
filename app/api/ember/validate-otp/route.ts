import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

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

    const otpData = otpSnap.data();

    if (otpData.otp !== otp) {
      return NextResponse.json({ error: 'Invalid verification code.' }, { status: 403 });
    }

    // OTP is valid! Delete it
    await deleteDoc(otpRef);

    // Fetch member details
    const memberRef = doc(db, 'ember_team', memberId);
    const memberSnap = await getDoc(memberRef);
    const memberData = memberSnap.data();

    if (!memberData) throw new Error("Member data not found");

    // 1. SECURE CHECK: Now check if it's a re-generation AFTER OTP is verified
    const certRef = collection(db, 'certificate_requests');
    const certSnap = await getDocs(
      query(certRef, where('memberId', '==', memberId), where('status', 'in', ['sent', 'generated']))
    );

    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = request.headers.get('host');

    if (!certSnap.empty) {
      // CASE: ALREADY GENERATED
      const existingCert = certSnap.docs[0];
      const certData = existingCert.data();
      
      // Trigger Re-generation Email
      fetch(`${protocol}://${host}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: memberData.email,
          type: 'certificate_regenerated',
          data: { name: memberData.name }
        })
      }).catch(err => console.error("Failed to send re-gen email:", err));

      return NextResponse.json({
        already_generated: true,
        certificateId: existingCert.id,
        date: certData.requestedAt,
        member: {
          id: memberId,
          name: memberData.name,
          department: memberData.department,
          role: memberData.role,
          gender: memberData.gender
        }
      });
    }

    // CASE: NEW GENERATION
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

    // Trigger Success Email
    fetch(`${protocol}://${host}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: memberData.email,
        type: 'certificate_generated',
        data: { name: memberData.name }
      })
    }).catch(err => console.error("Failed to send success email:", err));

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
