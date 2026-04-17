'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LaunchPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'intro' | 'countdown' | 'reveal'>('intro');
  const [timeLeft, setTimeLeft] = useState(9);
  const [timerActive, setTimerActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Wait for the entry animation to finish before ticking the clock down
    if (phase === 'countdown' && !timerActive) {
      timer = setTimeout(() => setTimerActive(true), 1300);
    } 
    // Start ticking down
    else if (phase === 'countdown' && timerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } 
    // Trigger Reveal when it reaches 0
    else if (phase === 'countdown' && timerActive && timeLeft === 0) {
      handleReveal();
    }
    
    return () => clearTimeout(timer);
  }, [phase, timerActive, timeLeft]);

  const handleStartCountdown = () => {
    setPhase('countdown');
  };

  const handleReveal = () => {
    setPhase('reveal');
    setTimeout(() => {
      window.scrollTo(0, 0);
      router.push('/');
    }, 800); // Route shortly after veil begins fully opening
  };

  const renderArabicPhrase = () => {
    // Before timer starts ticking (during animation), show the first phrase
    if (!timerActive) return 'یا اللہ';
    const sequence = (timeLeft - 1) % 3;
    if (sequence === 2) return 'یا اللہ';
    if (sequence === 1) return 'بِسْمِ اللَّهِ';
    if (sequence === 0) return 'اللّٰهُ أَكْبَر';
  };

  if (!mounted) return null;

  return (
    <div className={`launch-page-active fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out ${phase === 'reveal' ? 'bg-transparent filter blur-sm scale-110 pointer-events-none' : 'bg-[#061224] text-white'}`}>
      
      {/* Dark Curtain / Veil Effect (Splits open during reveal) */}
      <div className={`absolute inset-y-0 left-0 w-1/2 bg-[#061224] z-[90] transition-transform duration-[1500ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${phase === 'reveal' ? '-translate-x-full' : 'translate-x-0'}`}></div>
      <div className={`absolute inset-y-0 right-0 w-1/2 bg-[#061224] z-[90] transition-transform duration-[1500ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${phase === 'reveal' ? 'translate-x-full' : 'translate-x-0'}`}></div>
      
      {/* Absolute Flash Bloom on Reveal */}
      <div className={`absolute inset-0 bg-white z-[95] pointer-events-none transition-all duration-[1200ms] ease-out ${phase === 'reveal' ? 'opacity-100 mix-blend-overlay' : 'opacity-0'}`}></div>

      {/* Lighting & Textures (Behind the curtain) */}
      <div className="absolute inset-0 z-[91] pointer-events-none">
        <div className={`absolute top-0 right-[-10%] w-[1000px] h-[1000px] bg-radial-gradient from-[#1C7F93]/15 via-transparent to-transparent blur-[120px] rounded-full transition-opacity duration-700 ${phase === 'intro' ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute bottom-[-20%] left-[-10%] w-[1200px] h-[1000px] bg-radial-gradient from-[#123962]/30 via-[#1C7F93]/10 to-transparent blur-[150px] rounded-full transition-opacity duration-700 ${phase === 'intro' ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute bottom-0 inset-x-0 w-full h-[80vh] opacity-[0.03] mix-blend-screen scale-110 origin-bottom transition-opacity duration-700 ${phase === 'intro' ? 'opacity-100' : 'opacity-0'}`}>
           <Image src="/noor.png" alt="Noor Mahal" fill sizes="100vw" className="object-cover object-bottom" priority />
        </div>
      </div>

      {/* ===== SLIDE 1: INTRO ===== */}
      <div className={`absolute inset-0 z-[92] flex flex-col items-center justify-center p-8 transition-all duration-[1000ms] ease-[cubic-bezier(0.3,0,0,1)] ${
        phase === 'intro' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-110 -translate-y-20 pointer-events-none'
      }`}>
         <div className="relative w-36 h-36 md:w-44 md:h-44 mb-8 pb-2">
            <div className="absolute inset-0 bg-[#1C7F93] opacity-30 blur-[60px] rounded-full"></div>
            <Image src="/logo.png" alt="Jamiat Logo" fill className="object-contain drop-shadow-[0_0_30px_rgba(28,127,147,0.4)] animate-[float_6s_ease-in-out_infinite]" priority />
         </div>
         
         <div className="inline-flex items-center space-x-3 mb-6 bg-white/5 border border-white/10 backdrop-blur-md px-5 py-2.5 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4fb8cc] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4fb8cc]"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.3em] text-[#4fb8cc] uppercase">Official Digital Inauguration</span>
         </div>

         <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tight leading-[1.05] text-white text-center">
            Welcome To <br />
            <span className="font-serif italic font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2f8fb] to-[#1C7F93] drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">The New Era</span>
         </h1>
         
         <div className="flex flex-col items-center justify-center mb-8 border-y border-white/10 py-4 w-full max-w-lg">
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#4fb8cc] mb-1">Inaugurated By</span>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-widest drop-shadow-md">SAHIBZADA WASEEM HAIDER</h3>
            <span className="text-xs font-bold text-slate-400 mt-1 tracking-widest uppercase">Central President IJT</span>
         </div>
         
         <button 
           onClick={handleStartCountdown}
           className="group relative px-14 py-5 bg-transparent border border-[#1C7F93]/50 text-white rounded-full font-bold text-lg md:text-xl transition-all duration-700 overflow-hidden"
         >
            <div className="absolute inset-0 bg-[#0A1A30] -z-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1C7F93]/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] -z-10"></div>
            <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-[#4fb8cc]/60 transition-colors duration-500 shadow-[0_0_0_rgba(28,127,147,0)] group-hover:shadow-[0_0_40px_rgba(28,127,147,0.8)] -z-10"></div>
            <span className="relative flex items-center gap-4 text-white">
               Launch Website
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
               </svg>
            </span>
         </button>
      </div>

      {/* ===== SLIDE 2: COUNTDOWN ===== */}
      <div className={`absolute inset-0 z-[92] flex items-center justify-center px-4 transition-all duration-[1000ms] ease-[cubic-bezier(0.3,0,0,1)] ${
        phase === 'countdown' ? 'opacity-100 scale-100 translate-y-0 delay-300' :
        phase === 'reveal' ? 'opacity-0 scale-150 blur-xl translate-y-0' :
        'opacity-0 scale-90 translate-y-20 pointer-events-none'
      }`}>
         
         <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 md:gap-8 items-center justify-center">
            {/* Left Box: Initiative */}
            <div className={`flex flex-col items-center justify-center p-12 relative overflow-hidden rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-xl transition-all duration-[1000ms] delay-500 ${phase === 'countdown' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
               <div className="absolute inset-0 bg-gradient-to-br from-[#1C7F93]/10 to-transparent"></div>
               <span className="relative z-10 text-sm md:text-base font-black text-[#4fb8cc] uppercase tracking-[0.3em] mb-12 text-center">
                  Proud Initiative Of
               </span>
               <div className="relative w-80 h-32 md:w-[450px] md:h-[180px] z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <Image src="/logotechzone.webp" alt="IJT Tech Zone" fill className="object-contain" priority />
               </div>
            </div>

            {/* Right Box: Countdown */}
            <div className={`flex flex-col items-center justify-center transition-all duration-[1000ms] delay-700 ${phase === 'countdown' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
               <div className="relative flex items-center justify-center w-full min-h-[250px]">
                  {/* Glowing rings behind timer */}
                  <div className="absolute inset-0 rounded-full animate-ping border border-[#1C7F93] opacity-20 scale-150" style={{ animationDuration: '1s' }}></div>
                  <div className="absolute w-[250px] h-[250px] bg-[#1C7F93]/30 blur-[80px] rounded-full"></div>
                  
                  {/* Arabic/Urdu phrase countdown */}
                  <div 
                     key={timeLeft} 
                     className="relative z-10 text-[70px] md:text-[110px] text-white leading-[1.4] pb-4 drop-shadow-[0_0_50px_rgba(28,127,147,0.8)] animate-[pulse_1s_ease-in-out_infinite] whitespace-nowrap"
                     style={{ fontFamily: "var(--font-amiri), serif" }}
                     dir="rtl"
                  >
                     {renderArabicPhrase()}
                  </div>
               </div>
               
               <div className="mt-4 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-sm md:text-base font-bold text-[#4fb8cc] uppercase tracking-[0.4em]">
                     Initiating System
                  </span>
               </div>
            </div>
         </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .bg-radial-gradient {
          background-image: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
