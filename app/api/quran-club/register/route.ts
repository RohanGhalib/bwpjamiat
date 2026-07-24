import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      whatsapp, 
      email, 
      dob,
      address,
      occupation,
      college, 
      degree,
      interest,
      motivation,
      membershipFeeAccepted,
      committed
    } = body;

    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || body.name || '';

    if (!firstName || !lastName || !whatsapp || !email) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if already registered
    const regRef = collection(db, 'quran_club_registrations');
    const q = query(regRef, where('email', '==', cleanEmail));
    const regSnap = await getDocs(q);

    if (!regSnap.empty) {
      const existingDoc = regSnap.docs[0].data();
      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        passId: existingDoc.passId || 'QC-EXISTING',
        message: 'You have already submitted an application for Quran Club! We will contact you soon.'
      });
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
    const passId = `QC-26-${randomSuffix}`;

    await addDoc(collection(db, 'quran_club_registrations'), {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: fullName,
      whatsapp: whatsapp.trim(),
      email: cleanEmail,
      dob: dob || 'N/A',
      address: address ? address.trim() : 'N/A',
      occupation: occupation || 'N/A',
      college: college ? college.trim() : 'N/A',
      degree: degree ? degree.trim() : 'N/A',
      interest: interest || 'General',
      motivation: motivation ? motivation.trim() : 'N/A',
      membershipFeeAccepted: !!membershipFeeAccepted,
      committed: !!committed,
      passId,
      registeredAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      alreadyRegistered: false,
      passId,
      message: 'Application successfully received! We will contact you soon for an interview.'
    });
  } catch (error) {
    console.error('[QuranClub API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
