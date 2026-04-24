import { Suspense } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import EventTile from '@/components/events/EventTile';
import { sortEventsBySchedule, type EventRecord } from '@/lib/event-utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upcoming Events | IJT Bahawalpur',
  description: 'Join the upcoming conventions, seminars, and tarbiyati programs of Islami Jamiat-e-Talaba Bahawalpur across the city.',
  openGraph: {
    title: 'Upcoming Events | IJT Bahawalpur',
    description: 'Student conventions and Islamic seminars in Bahawalpur by IJT.',
    url: 'https://bwpjamiat.vercel.app/events',
    siteName: 'IJT Bahawalpur',
    locale: 'en_PK',
    type: 'website',
  },
};

export default function EventsList() {
  return (
    <div className="min-h-screen bg-transparent  pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Conventions & Seminars</h2>
          <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Upcoming Events</h1>
          <p className="text-slate-500 font-medium leading-relaxed">Join hands with thousands of students across Bahawalpur in our tarbiyati seminars and student conventions.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
           <Suspense fallback={
              <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-[2rem] border border-slate-100 animate-pulse">
                <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
                <div className="w-48 h-6 bg-slate-200 rounded mb-2"></div>
                <div className="w-32 h-4 bg-slate-200 rounded"></div>
              </div>
           }>
              <EventsFetcher />
           </Suspense>
        </div>
      </div>
    </div>
  );
}

async function EventsFetcher() {
  const eventsRef = collection(db, 'events');
  const q = query(eventsRef);
  let events: EventRecord[] = [];
  
  try {
     const querySnapshot = await getDocs(q);
     querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...(doc.data() as Omit<EventRecord, 'id'>) });
     });
  } catch (error) {
     console.error("Error fetching events:", error);
  }

  events = sortEventsBySchedule(events);

  if (events.length === 0) {
     return (
        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-[2rem] border border-slate-100">
           <div className="w-16 h-16 bg-[#123962]/5 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#1C7F93]"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>
           </div>
           <h3 className="text-xl font-bold text-[#123962] mb-2">No Upcoming Events</h3>
           <p className="text-slate-500 text-sm">Please check back later for convention updates.</p>
        </div>
     );
  }

  return (
     <>
        {events.map(e => <EventTile key={e.id} event={e} />)}
     </>
  );
}
