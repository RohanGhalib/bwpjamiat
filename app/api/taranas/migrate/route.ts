import { NextResponse } from 'next/server';
import { addTarana, getTaranas } from '@/lib/db';

export async function GET() {
  try {
    const existing = await getTaranas();
    if (existing.length === 0) {
      await addTarana({
        title: 'Gamzan hay soo e Manzil Jamiat ka karwan',
        artist: 'Jamiat',
        duration: '05:46',
        audioUrl: '/tarana1.mp3',
        tags: ['Classic']
      });
      await addTarana({
        title: 'Tumhi Badlogay Pakistan',
        artist: 'Fahad Farooqi',
        duration: '06:50',
        audioUrl: '/tarana2.mp3',
        tags: ['Motivational']
      });
      return NextResponse.json({ message: "Successfully migrated hardcoded taranas to database." });
    }
    return NextResponse.json({ message: "Taranas already exist in the database, no migration needed." });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: "Failed to migrate" }, { status: 500 });
  }
}
