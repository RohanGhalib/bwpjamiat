"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { FastAverageColor } from 'fast-average-color';
import Link from 'next/link';
import { sortEventsBySchedule, type EventRecord } from '@/lib/event-utils';

export default function HeroBubble() {
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [bgColor, setBgColor] = useState('rgba(255, 255, 255, 0.7)');
  const [textColor, setTextColor] = useState('#123962');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const eventsRef = collection(db, 'events');
    
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const latestEvent = sortEventsBySchedule(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as EventRecord))
      )[0] ?? null;

      if (latestEvent) {
        setEvent(latestEvent);
        
        if (latestEvent.imageUrl) {
          const fac = new FastAverageColor();
          fac.getColorAsync(latestEvent.imageUrl, { crossOrigin: 'anonymous' })
            .then(color => {
              setBgColor(`rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.85)`);
              setIsDark(color.isDark);
              setTextColor(color.isDark ? '#FFFFFF' : '#123962');
            })
            .catch(e => {
              console.log("Error extracting color", e);
              // Fallback
              setBgColor('rgba(255, 255, 255, 0.7)');
              setTextColor('#123962');
            });
        }
      } else {
        setEvent(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
     return (
        <div className="inline-flex items-center space-x-3 bg-white/70 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 shadow-sm border border-slate-200/50 animate-pulse">
            <span className="h-3 w-3 rounded-full bg-slate-300"></span>
            <span className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase w-32">&nbsp;</span>
        </div>
     );
  }

  if (event) {
     return (
        <Link href={`/events/${event.id}`}>
           <div 
             className="inline-flex items-center space-x-3 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 shadow-md border hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
             style={{ 
                backgroundColor: bgColor, 
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
             }}
           >
              <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: textColor }}></span>
                 <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: textColor }}></span>
              </span>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase transition-colors" style={{ color: textColor }}>
                 Upcoming Event: {event.title}
              </span>
           </div>
        </Link>
     );
  }

  return (
    <div className="inline-flex items-center space-x-3 bg-white/70 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 shadow-sm border border-slate-200/50 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <span className="relative flex h-3 w-3">
         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1C7F93] opacity-75"></span>
         <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1C7F93]"></span>
      </span>
      <span className="text-[10px] font-black tracking-[0.2em] text-[#123962] uppercase">Since 1947 &bull; Bahawalpur Chapter</span>
    </div>
  );
}
