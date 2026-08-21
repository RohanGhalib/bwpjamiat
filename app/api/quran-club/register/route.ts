import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { upsertContact } from '@/lib/contacts';

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

    // 1. Maintain backwards-compatible legacy collection entry
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

    // 2. Ingest into Central Contacts CRM
    try {
      await upsertContact({
        name: fullName,
        phone: whatsapp.trim(),
        email: cleanEmail,
        city: address ? address.trim() : '',
        institution: college ? college.trim() : '',
        source: 'quran_club',
        sourceEventTitle: 'Quran Club 2026',
        tags: ['quran_club', 'quran-club-2026'],
        status: 'lead',
        customFields: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          degree: degree ? degree.trim() : '',
          college: college ? college.trim() : '',
          passId,
          dob: dob || '',
          occupation: occupation || '',
          motivation: motivation ? motivation.trim() : '',
          interest: interest || '',
        },
      });
    } catch (contactErr) {
      console.error('[QuranClub Ingest Contact Error]:', contactErr);
    }

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
