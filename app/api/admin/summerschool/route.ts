import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

export async function GET() {
  try {
    const regRef = collection(db, 'summer_school_registrations');
    let snapshot;
    try {
      const q = query(regRef, orderBy('registeredAt', 'desc'));
      snapshot = await getDocs(q);
    } catch {
      // Fallback if index on registeredAt isn't built yet
      snapshot = await getDocs(regRef);
    }

    const registrations = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    console.error('[Admin SummerSchool GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing registration ID.' }, { status: 400 });
    }

    await deleteDoc(doc(db, 'summer_school_registrations', id));
    return NextResponse.json({ success: true, message: 'Registration deleted successfully.' });
  } catch (error) {
    console.error('[Admin SummerSchool DELETE] Error:', error);
    return NextResponse.json({ error: 'Failed to delete registration.' }, { status: 500 });
  }
}
