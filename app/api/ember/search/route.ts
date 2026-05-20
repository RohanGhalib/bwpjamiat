import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase();

  if (!q || q.length < 3) {
    return NextResponse.json({ results: [] });
  }

  try {
    const membersRef = collection(db, 'ember_team');
    // Fetching all (only name/id/dept/phone) to perform substring search server-side
    // This protects the full data from the client while allowing flexible search
    const qSnap = await getDocs(query(membersRef, orderBy('name', 'asc')));
    
    const allMembers = qSnap.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      department: doc.data().department,
      phone: doc.data().phone || ''
    }));

    // Filter by substring (fuzzy search)
    const filtered = allMembers.filter(m => 
      m.name.toLowerCase().includes(q)
    );

    // Only return top 10 and MASK the phone (only last 3 digits)
    const results = filtered.slice(0, 10).map(m => ({
      id: m.id,
      name: m.name,
      department: m.department,
      phoneHint: m.phone.slice(-3) // Last 3 digits for UI hint
    }));

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('[Search API] Error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
