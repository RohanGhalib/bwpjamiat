"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function SingleEventPage({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventData, setEventData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      setEventId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (!eventId) return;

    const eventRef = doc(db, 'events', eventId);
    
    setLoading(true);
    const unsubscribe = onSnapshot(eventRef, (document) => {
      if (document.exists()) {
        setEventData({ id: document.id, ...document.data() });
      } else {
        setEventData(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching event:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 bg-transparent">
        <div className="container mx-auto px-4 max-w-5xl animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded mb-8"></div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[400px]">
            <div className="md:w-1/2 bg-gray-200"></div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center space-y-6">
              <div className="h-6 w-32 bg-gray-200 rounded-full"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
              <div className="h-20 w-full bg-gray-100 rounded"></div>
              <div className="h-20 w-full bg-gray-100 rounded"></div>
              <div className="h-12 w-full bg-gray-200 rounded-lg mt-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen py-16 bg-transparent">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-20">Event not found</h1>
          <Link href="/events" className="text-[#1C7F93] hover:underline mb-8 inline-block font-semibold">&larr; Back to Events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] py-16 bg-transparent pt-32">
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <Link href="/events" className="text-[#1C7F93] hover:underline mb-8 inline-block text-sm font-semibold">&larr; Back to Events</Link>
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gray-100 relative min-h-[300px] md:min-h-[500px]">
             {eventData.imageUrl ? (
               <img src={eventData.imageUrl} alt={eventData.title} className="absolute inset-0 w-full h-full object-cover" />
             ) : (
               <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#123962] to-[#1C7F93] flex items-center justify-center text-white/50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
               </div>
             )}
          </div>
          <div className="p-8 md:p-12 md:w-1/2 flex flex-col">
            <span className="text-xs font-bold text-white bg-[#1C7F93] max-w-max px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block shadow-sm">Upcoming Event</span>
            <h1 className="text-3xl md:text-4xl font-black text-[#123962] mb-6 leading-tight">{eventData.title || "Untitled Event"}</h1>
            
            <div className="space-y-6 mb-8 flex-1">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-white text-[#1C7F93] flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                </div>
                <div>
                  <p className="font-bold text-[#123962] text-lg">Date & Time</p>
                  <p className="text-sm font-medium text-slate-500 mt-1">{eventData.dateStr || "TBA"}</p>
                  {eventData.duration && (
                     <p className="text-sm font-medium text-slate-500">Duration: {eventData.duration}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-full bg-white text-[#1C7F93] flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-[#123962] text-lg">Venue</p>
                  <p className="text-sm font-medium text-slate-500 mt-1">{eventData.location || "TBA"}</p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(eventData.location || "")}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#1C7F93] hover:underline cursor-pointer inline-block mt-2">View on Map</a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
               {eventData.registrationLink ? (
                  <a href={eventData.registrationLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-4 bg-[#123962] text-white rounded-xl font-bold hover:bg-[#1C7F93] transition-all shadow-[0_10px_20px_rgba(18,57,98,0.2)] hover:-translate-y-1">
                     Register Now
                  </a>
               ) : (
                  <button className="w-full py-4 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed">Registration Closed</button>
               )}
            </div>
          </div>
        </div>

        {eventData.description && (
           <div className="mt-12 bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              <h2 className="text-2xl font-black text-[#123962] mb-6">Event Details</h2>
              <div className="prose max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                {eventData.description}
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
