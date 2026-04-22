import Link from 'next/link';
import { Suspense } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

interface JamiatEvent {
  id: string;
  title: string;
  dateStr: string;
  eventDate?: string; // ISO date string for sorting (YYYY-MM-DD)
  location: string;
  imageUrl?: string;
  isActive?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
}

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
  // eslint-disable-next-line prefer-const
  let events: JamiatEvent[] = [];
  
  try {
     const querySnapshot = await getDocs(q);
     querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...(doc.data() as Omit<JamiatEvent, 'id'>) });
     });
  } catch (error) {
     console.error("Error fetching events:", error);
  }

  // Sort: upcoming events first (soonest first), undated events in the middle, past events at bottom
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const nowMs = now.getTime();
  events.sort((a, b) => {
    const aMs = a.eventDate ? new Date(a.eventDate).getTime() : null;
    const bMs = b.eventDate ? new Date(b.eventDate).getTime() : null;
    const aFuture = aMs !== null && aMs >= nowMs;
    const bFuture = bMs !== null && bMs >= nowMs;
    const aPast  = aMs !== null && aMs < nowMs;
    const bPast  = bMs !== null && bMs < nowMs;

    if (aFuture && bFuture) return aMs! - bMs!;  // both upcoming: soonest first
    if (aPast  && bPast)  return bMs! - aMs!;    // both past: most recent past first
    if (aFuture) return -1;                       // upcoming before undated/past
    if (bFuture) return 1;
    if (aPast)  return 1;                         // past after undated
    if (bPast)  return -1;
    return 0;                                     // both undated: preserve order
  });

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
        {events.map(e => {
           const gradientFrom = e.gradientFrom || '#123962';
           const gradientTo = e.gradientTo || '#0c2848';
           const isPast = e.eventDate ? new Date(e.eventDate).getTime() < nowMs : false;
           return (
              <div
                 key={e.id}
                 className="group rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(18,57,98,0.2)] relative flex flex-col justify-end p-8 sm:p-10 min-h-[400px]"
                 style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
              >
                 {e.imageUrl && (
                    <div
                       className="absolute inset-0 opacity-40 mix-blend-overlay group-hover:opacity-50 group-hover:scale-105 transition-all duration-1000"
                       style={{ backgroundImage: `url('${e.imageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                 
                 <div className="relative z-10 w-full">
                    {isPast ? (
                       <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/10">
                          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                          <span className="text-[10px] font-extrabold text-white/80 uppercase tracking-[0.2em]">Past Event</span>
                       </div>
                    ) : (e.isActive !== false) && (
                       <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/10">
                          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                          <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.2em]">Open Event</span>
                       </div>
                    )}
                    <h4 className="text-3xl font-black text-white mb-6 leading-tight">{e.title || "Annual Tarbiyati Convention"}</h4>
                    <div className="px-6 py-5 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl mb-8 space-y-3">
                       <p className="flex items-center text-white text-sm font-bold">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-3 text-white/70"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {e.dateStr || "TBD"}
                       </p>
                       <p className="flex items-center text-white text-sm font-bold">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-3 text-white/70"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                          {e.location || "TBD"}
                       </p>
                    </div>
                    <Link href={`/events/${e.id}`} className="inline-flex w-full justify-center px-6 py-4 bg-white text-[#123962] rounded-2xl font-extrabold text-sm hover:bg-white/90 hover:shadow-xl transition-all duration-300 shadow-xl">
                       View Details
                    </Link>
                 </div>
              </div>
           );
        })}
     </>
  );
}
