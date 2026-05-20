"use client";

import { useMemo, type CSSProperties } from 'react';
import Link from 'next/link';
import { getEventState, type EventRecord } from '@/lib/event-utils';
import { useEventTheme } from '@/lib/event-theme';

export default function EventTile({ event }: { event: EventRecord }) {
  const state = getEventState(event);
  const seed = event.id || event.title || 'event';
  const theme = useEventTheme({ imageUrl: event.imageUrl, seed, storedTheme: event.eventTheme });
  const styleVars = useMemo(
    () =>
      ({
        backgroundImage: theme.gradient,
        '--event-accent': theme.accent,
        '--event-accent-hover': theme.accentHover,
        '--event-text-on-accent': theme.textOnAccent,
      }) as CSSProperties,
    [theme.accent, theme.accentHover, theme.gradient, theme.textOnAccent],
  );

  return (
    <div
      className="group rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(18,57,98,0.2)] relative flex flex-col justify-end p-8 sm:p-10 min-h-[400px] border border-white/10 bg-[#081A2E]"
      style={styleVars}
    >
      {event.imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 saturate-[1.65] mix-blend-soft-light pointer-events-none"
          style={{ backgroundImage: `url(${event.imageUrl})` }}
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_48%)] mix-blend-soft-light pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/24 to-black/5 pointer-events-none"></div>
      <div className="relative z-10 w-full">
        {state !== 'past' && (
          <div className="inline-flex items-center space-x-2 bg-white/18 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.2em]">{state === 'unknown' ? 'Event' : 'Open Event'}</span>
          </div>
        )}
        {state === 'past' && (
          <div className="inline-flex items-center space-x-2 bg-black/15 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-white/70"></span>
            <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.2em]">Finished</span>
          </div>
        )}
        <h4 className="text-3xl font-black text-white mb-6 leading-tight drop-shadow-md">{event.title || 'Untitled Event'}</h4>
        <div className="px-6 py-5 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl mb-8 space-y-3 shadow-lg">
          <p className="flex items-center text-white text-sm font-bold drop-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-3 text-white/90"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {event.dateStr || 'TBD'}
          </p>
          <p className="flex items-center text-white text-sm font-bold drop-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-3 text-white/90"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            {event.location || 'TBD'}
          </p>
        </div>
        <Link href={`/events/${event.id}`} className="inline-flex w-full justify-center px-6 py-4 bg-[var(--event-accent)] text-[var(--event-text-on-accent)] rounded-2xl font-extrabold text-sm hover:bg-white hover:text-[var(--event-accent)] transition-all duration-300 shadow-xl hover:-translate-y-1">
          View Details
        </Link>
      </div>
    </div>
  );
}