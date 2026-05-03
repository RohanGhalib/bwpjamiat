import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q || q.length < 3) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Prefix search in Firestore
    // Note: This is case-sensitive unless data is stored lowercase.
    // Assuming names start with Uppercase.
    const term = q.charAt(0).toUpperCase() + q.slice(1);
    const endTerm = term + '\uf8ff';

    const membersRef = collection(db, 'ember_team');
    const qSnap = await getDocs(
      query(
        membersRef,
        where('name', '>=', term),
        where('name', '<=', endTerm),
        limit(10)
      )
    );

    const results = qSnap.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      department: doc.data().department
    }));

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('[Search API] Error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
