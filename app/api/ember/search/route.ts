import { NextResponse } from 'next/server';
import { getEmberTeam } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase();

  if (!q || q.length < 3) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Fetching all members using the cached db method (caches for 1hr)
    // This protects the full data from the client while allowing flexible search
    // and preventing thousands of DB reads during search.
    const team = await getEmberTeam();
    
    const allMembers = team.map(member => ({
      id: member.id,
      name: member.name,
      department: member.department,
      phone: member.phone || ''
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
