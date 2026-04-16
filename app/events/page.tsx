import Link from 'next/link';

export const unstable_instant = { prefetch: 'static' };

export default function EventsList() {
  return (
    <div className="min-h-screen bg-[#FAFCFF] pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Conventions & Seminars</h2>
          <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Upcoming Events</h1>
          <p className="text-slate-500 font-medium leading-relaxed">Join hands with thousands of students across Bahawalpur in our tarbiyati seminars and student conventions.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {[1, 2, 3, 4].map(e => (
            <div key={e} className="group bg-gradient-to-bl from-[#123962] to-[#0c2848] rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(18,57,98,0.2)] relative flex flex-col justify-end p-8 sm:p-10 min-h-[400px]">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/jamiatevent/600/800')] opacity-30 mix-blend-overlay group-hover:opacity-50 group-hover:scale-105 transition-all duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#123962] via-[#123962]/60 to-transparent"></div>
                
                <div className="relative z-10 w-full">
                   <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                      <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.2em]">Open Event</span>
                   </div>
                   <h4 className="text-3xl font-black text-white mb-6 leading-tight">Annual Tarbiyati Convention BWP Phase {e}</h4>
                   <div className="px-6 py-5 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl mb-8 space-y-3">
                      <p className="flex items-center text-white text-sm font-bold">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-3 text-[#1C7F93]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         Nov 15 &bull; 09:00 AM
                      </p>
                      <p className="flex items-center text-white text-sm font-bold">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-3 text-[#1C7F93]"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                         IUB Main Auditorium
                      </p>
                   </div>
                   <Link href={`/events/${e}`} className="inline-flex w-full justify-center px-6 py-4 bg-white text-[#123962] rounded-2xl font-extrabold text-sm hover:bg-[#1C7F93] hover:text-white transition-all duration-300 shadow-xl">
                      Register Now
                   </Link>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
