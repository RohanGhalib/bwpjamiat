import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import HeroBubble from '@/components/HeroBubble';



export default function Home() {
   return (
      <div className="flex flex-col min-h-screen bg-transparent overflow-hidden selection:bg-[#1C7F93] selection:text-white font-sans animate-page-reveal">

         {/* Hero Banner - Thoughtful & Beautiful */}
         <section className="relative pt-44 pb-0 flex flex-col justify-start min-h-[90vh] z-0 overflow-hidden bg-gradient-to-b from-[#FAFCFF] via-white to-[#eef4f9]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-br from-[#1C7F93]/20 via-[#2669A9]/10 to-transparent blur-[120px] rounded-full -z-10 pointer-events-none"></div>
            <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-gradient-to-tr from-green-100/40 to-transparent blur-[80px] rounded-full -z-10 pointer-events-none"></div>

            {/* Noor Mahal Graphic - Blended as a majestic subtle vintage background */}
            <div className="absolute bottom-[-10vh] lg:bottom-[-15vh] inset-x-0 w-full h-[70vh] lg:h-[95vh] z-0 pointer-events-none opacity-[0.35] md:opacity-[0.25] mix-blend-luminosity grayscale transform scale-110 origin-bottom">
               <Image src="/noor.png" alt="Noor Mahal Bahawalpur" fill sizes="100vw" className="object-cover md:object-contain object-bottom" priority />
            </div>
            <div className="absolute bottom-0 inset-x-0 h-[50vh] bg-gradient-to-t from-[#FAFCFF] via-white/60 to-transparent z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-r from-[#1C7F93]/20 via-[#123962]/20 to-[#1C7F93]/20 blur-md"></div>

            <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center flex-1 pb-32">

               <HeroBubble />

               <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tight leading-[1.05] max-w-5xl mx-auto text-[#123962]">
                  Awakening A Generation <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C7F93] to-[#2669A9] inline-block mt-2">For The Pleasure Of Allah</span>
               </h1>

               <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                  Islami Jamiat-e-Talaba is not just an organization; it is an intellectual and moral revolution striving to establish a completely just Islamic society on the foundation of the Quran and Sunnah.
               </p>

               <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto relative z-20">
                  <Link href="/contact" className="group relative px-10 py-4 bg-[#123962] text-white rounded-full font-bold shadow-[0_10px_30px_rgba(18,57,98,0.2)] hover:shadow-[0_20px_40px_rgba(28,127,147,0.3)] hover:-translate-y-1 w-full sm:w-auto text-center transition-all duration-500 overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-[#1C7F93] to-[#123962] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                     <span className="relative z-10">Join The Revolution</span>
                  </Link>
               </div>
            </div>

         </section>

         {/* Maulana Maududi Ideology Section (Blended Sktech & Islamic Background Placeholder) */}
         <section className="py-28 bg-white relative border-b border-slate-100 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] z-10 overflow-hidden">
            {/* Background Texture Placeholder: Islamic Pattern/Calligraphy */}
            <div className="absolute right-0 top-0 w-full md:w-1/2 h-full bg-gradient-to-l from-[#1C7F93]/5 to-transparent pointer-events-none">
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
               <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                  <div className="w-full md:w-1/3 flex justify-center md:justify-end shrink-0">
                     <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden shadow-[0_20px_40px_rgba(18,57,98,0.1)] ring-8 ring-[#FAFCFF] transform md:-rotate-2 border border-slate-100 bg-[#FAFCFF]">
                        <Image src="/maududi.png" alt="Syed Abul A'la Maududi" fill sizes="(max-width: 768px) 14rem, 18rem" className="object-cover object-top mix-blend-multiply grayscale opacity-90 transition-all hover:grayscale-0 hover:opacity-100 duration-500" priority />
                     </div>
                  </div>

                  <div className="w-full md:w-2/3 text-center md:text-left">
                     <div className="w-12 h-1 bg-gradient-to-r from-[#1C7F93] to-transparent rounded-full mb-8 mx-auto md:mx-0"></div>
                     <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#123962] leading-relaxed md:leading-[1.4] tracking-tight font-serif mb-8 text-slate-700">
                        "A student's true duty is not merely to acquire knowledge for worldly gain, but to prepare themselves as a torchbearer of an intellectual and moral revolution in society."
                     </h2>
                     <h3 className="font-extrabold text-[#123962] tracking-widest uppercase text-sm mb-1">Syed Abul A'la Maududi</h3>
                     <p className="text-[#1C7F93] font-bold text-xs uppercase tracking-[0.2em]">Ideological Founder</p>
                  </div>
               </div>
            </div>
         </section>

         {/* The 5-Point Agenda - Soft Elevated Cards */}
         <section className="py-32 relative z-10 bg-[#FAFCFF] overflow-hidden">
            {/* Cloud/Crowd Background Texture Placeholder */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-white via-transparent to-[#FAFCFF] pointer-events-none">
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
               <div className="text-center max-w-3xl mx-auto mb-24">
                  <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4 text-center">Core Ideology</h2>
                  <h3 className="text-4xl md:text-5xl font-extrabold text-[#123962] tracking-tight">The 5 Points Towards Revolution</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
                  <div className="group lg:col-span-2 relative bg-white/70 backdrop-blur-md rounded-[2rem] p-8 lg:p-10 border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(28,127,147,0.08)] hover:border-[#1C7F93]/20 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 flex flex-col">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1C7F93]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                     <div className="flex items-start gap-4 mb-6 relative z-10">
                        <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#1C7F93] to-[#1C7F93]/30 leading-none -mt-2 group-hover:scale-110 transition-transform duration-500 origin-left">
                           1.
                        </span>
                        <div className="pt-2 sm:pt-4">
                           <h4 className="text-2xl font-extrabold text-[#123962] group-hover:text-[#1C7F93] transition-colors">"Dawah" (Call to Allah)</h4>
                        </div>
                     </div>
                     <p className="text-slate-500 font-medium text-sm leading-relaxed relative z-10 mt-auto">To convey the message of Islam to the students, to inspire them to acquire Islamic knowledge and to arouse in them the sense of responsibility to practice Islam in full.</p>
                  </div>

                  <div className="group lg:col-span-2 relative bg-white/70 backdrop-blur-md rounded-[2rem] p-8 lg:p-10 border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(28,127,147,0.08)] hover:border-[#1C7F93]/20 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 flex flex-col">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1C7F93]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                     <div className="flex items-start gap-4 mb-6 relative z-10">
                        <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#1C7F93] to-[#1C7F93]/30 leading-none -mt-2 group-hover:scale-110 transition-transform duration-500 origin-left">
                           2.
                        </span>
                        <div className="pt-2 sm:pt-4">
                           <h4 className="text-2xl font-extrabold text-[#123962] group-hover:text-[#1C7F93] transition-colors">Organization</h4>
                        </div>
                     </div>
                     <p className="text-slate-500 font-medium text-sm leading-relaxed relative z-10 mt-auto">To organize the students who are ready to partake in the struggle for establishing Islamic way of life within the fold of this organization.</p>
                  </div>

                  <div className="group lg:col-span-2 relative bg-white/70 backdrop-blur-md rounded-[2rem] p-8 lg:p-10 border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(28,127,147,0.08)] hover:border-[#1C7F93]/20 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 flex flex-col">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1C7F93]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                     <div className="flex items-start gap-4 mb-6 relative z-10">
                        <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#1C7F93] to-[#1C7F93]/30 leading-none -mt-2 group-hover:scale-110 transition-transform duration-500 origin-left">
                           3.
                        </span>
                        <div className="pt-2 sm:pt-4">
                           <h4 className="text-2xl font-extrabold text-[#123962] group-hover:text-[#1C7F93] transition-colors">Training</h4>
                        </div>
                     </div>
                     <p className="text-slate-500 font-medium text-sm leading-relaxed relative z-10 mt-auto">To impart Islamic knowledge and mold capable men of character, able to brave the challenges of Jahilyah and champion the superiority of Islam.</p>
                  </div>

                  <div className="group lg:col-span-2 md:col-start-1 lg:col-start-2 relative bg-white/70 backdrop-blur-md rounded-[2rem] p-8 lg:p-10 border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(28,127,147,0.08)] hover:border-[#1C7F93]/20 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 flex flex-col">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1C7F93]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                     <div className="flex items-start gap-4 mb-6 relative z-10">
                        <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#1C7F93] to-[#1C7F93]/30 leading-none -mt-2 group-hover:scale-110 transition-transform duration-500 origin-left">
                           4.
                        </span>
                        <div className="pt-2 sm:pt-4">
                           <h4 className="text-2xl font-extrabold text-[#123962] group-hover:text-[#1C7F93] transition-colors leading-snug">Education Movement</h4>
                        </div>
                     </div>
                     <p className="text-slate-500 font-medium text-sm leading-relaxed relative z-10 mt-auto">To transform the education system based on Islamic values, build ideal citizens, and resolve real student problems.</p>
                  </div>

                  <div className="group lg:col-span-2 md:col-start-2 lg:col-start-4 relative bg-white/70 backdrop-blur-md rounded-[2rem] p-8 lg:p-10 border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(28,127,147,0.08)] hover:border-[#1C7F93]/20 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 flex flex-col">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1C7F93]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                     <div className="flex items-start gap-4 mb-6 relative z-10">
                        <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#1C7F93] to-[#1C7F93]/30 leading-none -mt-2 group-hover:scale-110 transition-transform duration-500 origin-left">
                           5.
                        </span>
                        <div className="pt-2 sm:pt-4">
                           <h4 className="text-2xl font-extrabold text-[#123962] group-hover:text-[#1C7F93] transition-colors leading-snug">Islamic Social Order</h4>
                        </div>
                     </div>
                     <p className="text-slate-500 font-medium text-sm leading-relaxed relative z-10 mt-auto">To strive tirelessly for an Islamic social order, freeing humanity from economic exploitation, political oppression, and cultural servitude.</p>
                  </div>
               </div>
            </div>
         </section>

         {/* Modern Jamiat Manifesto Section with Urdu Nastaliq */}
         <section className="py-24 md:py-32 relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#1C7F93]/10 to-transparent rounded-bl-full pointer-events-none blur-3xl"></div>
            <div className="container mx-auto px-4 max-w-7xl relative z-10">
               <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                  <div className="space-y-8">
                     <div className="inline-flex items-center space-x-2 bg-blue-50/50 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-100">
                        <span className="w-2 h-2 rounded-full bg-[#1C7F93] animate-pulse"></span>
                        <span className="text-[10px] font-black tracking-[0.2em] text-[#123962] uppercase">The Movement</span>
                     </div>

                     <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#123962] tracking-tight leading-[1.05]">
                        Forging the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C7F93] to-[#2669A9]">Leaders of Tomorrow</span>
                     </h3>

                     <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
                        We believe that the university is not just a marketplace for degrees, but a battlefield of ideas. Jamiat stands as a shield for the Muslim student, arming them with the absolute conviction of their faith and the intellectual rigor to lead the world.
                     </p>

                     <div className="pt-8 border-t border-slate-100">
                        <div className="flex items-start space-x-5">
                           <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#123962] to-[#1C7F93] flex items-center justify-center shrink-0 shadow-lg shadow-[#1C7F93]/20 transform rotate-3">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-white -rotate-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                           </div>
                           <div>
                              <h4 className="font-extrabold text-[#123962] text-xl mb-1.5">Our Ultimate Goal</h4>
                              <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-md">Establishment of the Islamic system of life by practically molding the youth into active, enlightened agents of societal change.</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="relative h-full min-h-[400px] lg:min-h-[500px]">
                     {/* Decorative Frame */}
                     <div className="absolute inset-0 bg-gradient-to-br from-[#123962] to-[#0a1f3a] rounded-[3rem] shadow-2xl transform rotate-3 scale-[1.02] transition-transform hover:rotate-6 duration-700"></div>

                     {/* Glass Card with Urdu */}
                     <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/20 p-8 md:p-14 flex flex-col justify-center items-center text-center overflow-hidden">
                        {/* Subtle organic shapes behind text */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1C7F93]/30 blur-[80px] rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2669A9]/20 blur-[80px] rounded-full"></div>

                        <svg className="w-12 h-12 text-white/20 mb-6 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path></svg>

                        <h2 style={{ fontFamily: 'var(--font-nastaliq)' }} className="text-3xl md:text-4xl lg:text-5xl text-white leading-[2.2] tracking-normal drop-shadow-md font-bold px-2">
                           افراد کے ہاتھوں میں ہے اقوام کی تقدیر
                        </h2>
                        <div className="mt-8 h-1 w-16 bg-gradient-to-r from-transparent via-[#1C7F93] to-transparent"></div>
                        <p className="text-white/60 mt-6 text-[10px] font-black tracking-[0.2em] uppercase">Slogan Of The Year</p>
                     </div>
                  </div>

               </div>
            </div>
         </section>

         {/* Rich Stats Section */}
         <section className="py-0 relative overflow-hidden mt-12 mb-16 mx-4 md:mx-8 rounded-3xl md:rounded-[3rem]">

            {/* === Deep layered background === */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f3a] via-[#123962] to-[#0d2d4e] rounded-3xl md:rounded-[3rem]"></div>

            {/* Glowing orbs */}
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#1C7F93] opacity-20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-40 right-0 w-[600px] h-[600px] bg-[#2669A9] opacity-15 blur-[140px] rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#1C7F93] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

            {/* SVG mesh / dot grid texture */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
               <defs>
                  <pattern id="statsgrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                     <circle cx="1" cy="1" r="1" fill="white" />
                  </pattern>
               </defs>
               <rect width="100%" height="100%" fill="url(#statsgrid)" />
            </svg>

            {/* Top diagonal accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1C7F93]/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1C7F93]/40 to-transparent"></div>

            <div className="relative z-10 px-6 sm:px-8 lg:px-16 pt-16 pb-20">

               {/* Section header */}
               <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-4 mb-4">
                     <div className="h-px w-16 bg-gradient-to-l from-[#1C7F93]/60 to-transparent"></div>
                     <span className="text-[10px] font-black tracking-[0.3em] text-[#1C7F93] uppercase">Our Reach & Impact</span>
                     <div className="h-px w-16 bg-gradient-to-r from-[#1C7F93]/60 to-transparent"></div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                     75 Years of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C7F93] to-[#4fb8cc]">Unbroken Mission</span>
                  </h2>
               </div>

               {/* Stat Cards Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">

                  {/* Card 1 */}
                  <div className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.07] hover:border-[#1C7F93]/30 transition-all duration-500 overflow-hidden">
                     <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1C7F93]/50 to-transparent group-hover:via-[#1C7F93] transition-all duration-500"></div>
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-10 bg-[#1C7F93]/20 blur-xl rounded-full group-hover:w-32 group-hover:bg-[#1C7F93]/30 transition-all duration-500"></div>
                     {/* Icon */}
                     <div className="w-10 h-10 rounded-xl bg-[#1C7F93]/10 border border-[#1C7F93]/20 flex items-center justify-center mb-5 group-hover:bg-[#1C7F93]/20 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-[#4fb8cc]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                     </div>
                     <span className="text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-[#4fb8cc] transition-all duration-500">75</span>
                     <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#1C7F93] group-hover:text-[#4fb8cc] transition-colors duration-300">Years of Legacy</span>
                  </div>

                  {/* Card 2 */}
                  <div className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.07] hover:border-[#1C7F93]/30 transition-all duration-500 overflow-hidden">
                     <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1C7F93]/50 to-transparent group-hover:via-[#1C7F93] transition-all duration-500"></div>
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-10 bg-[#1C7F93]/20 blur-xl rounded-full group-hover:w-32 group-hover:bg-[#1C7F93]/30 transition-all duration-500"></div>
                     <div className="w-10 h-10 rounded-xl bg-[#1C7F93]/10 border border-[#1C7F93]/20 flex items-center justify-center mb-5 group-hover:bg-[#1C7F93]/20 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-[#4fb8cc]"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>
                     </div>
                     <span className="text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-[#4fb8cc] transition-all duration-500">1M+</span>
                     <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#1C7F93] group-hover:text-[#4fb8cc] transition-colors duration-300">Alumni Global</span>
                  </div>

                  {/* Card 3 */}
                  <div className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.07] hover:border-[#1C7F93]/30 transition-all duration-500 overflow-hidden">
                     <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1C7F93]/50 to-transparent group-hover:via-[#1C7F93] transition-all duration-500"></div>
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-10 bg-[#1C7F93]/20 blur-xl rounded-full group-hover:w-32 group-hover:bg-[#1C7F93]/30 transition-all duration-500"></div>
                     <div className="w-10 h-10 rounded-xl bg-[#1C7F93]/10 border border-[#1C7F93]/20 flex items-center justify-center mb-5 group-hover:bg-[#1C7F93]/20 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-[#4fb8cc]"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                     </div>
                     <span className="text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-[#4fb8cc] transition-all duration-500">400+</span>
                     <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#1C7F93] group-hover:text-[#4fb8cc] transition-colors duration-300">Active Units</span>
                  </div>

                  {/* Card 4 */}
                  <div className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.07] hover:border-[#1C7F93]/30 transition-all duration-500 overflow-hidden">
                     <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#1C7F93]/50 to-transparent group-hover:via-[#1C7F93] transition-all duration-500"></div>
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-10 bg-[#1C7F93]/20 blur-xl rounded-full group-hover:w-32 group-hover:bg-[#1C7F93]/30 transition-all duration-500"></div>
                     <div className="w-10 h-10 rounded-xl bg-[#1C7F93]/10 border border-[#1C7F93]/20 flex items-center justify-center mb-5 group-hover:bg-[#1C7F93]/20 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-[#4fb8cc]"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
                     </div>
                     <span className="text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-[#4fb8cc] transition-all duration-500">10K+</span>
                     <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#1C7F93] group-hover:text-[#4fb8cc] transition-colors duration-300">Annual Events</span>
                  </div>

               </div>

               {/* Bottom decorative quote strip */}
               <div className="mt-14 flex items-center gap-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10"></div>
                  <p className="text-center text-white/25 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] shrink-0">إِنَّ اللَّهَ مَعَ الصَّابِرِينَ &bull; Verily, Allah is with the patient</p>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10"></div>
               </div>

            </div>
         </section>

         {/* Featured Articles & Events */}
         <section className="pt-20 pb-40 relative z-10 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
               <div className="flex flex-col md:flex-row justify-between items-end mb-20 px-4">
                  <div className="max-w-xl">
                     <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Stay Updated</h2>
                     <h3 className="text-4xl md:text-5xl font-extrabold text-[#123962] tracking-tight">Latest Dispatches</h3>
                  </div>
                  <Link href="/articles" className="mt-8 md:mt-0 px-8 py-3.5 bg-white shadow-sm border border-slate-100 text-[#123962] rounded-full font-bold hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                     View All News
                  </Link>
               </div>

               <div className="grid lg:grid-cols-3 gap-10 px-4">
                  {/* Article Cards */}
                  {[1, 2].map((i) => (
                     <Link href={`/articles/${i}`} key={i} className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-50 hover:border-[#1C7F93]/20 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-2">
                        <div className="h-64 bg-slate-100 relative overflow-hidden m-3 rounded-[2rem]">
                           <div className="absolute inset-0 bg-[#123962]/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                           <Image src={`https://picsum.photos/seed/${i * 50}/600/400`} alt="Article Image" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                           <div className="absolute top-5 left-5 z-20 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#1C7F93]">Tarbiyah</span>
                           </div>
                        </div>
                        <div className="px-8 pb-8 pt-6 flex-1 flex flex-col">
                           <h4 className="text-2xl font-extrabold text-[#123962] mb-4 leading-snug group-hover:text-[#1C7F93] transition-colors">The Pursuit of Knowledge in the 21st Century Islamic Renaissance</h4>
                           <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1 font-medium">An exploration of what it means to be a student in the modern university while maintaining pristine ideological boundaries...</p>
                           <div className="flex items-center text-[10px] font-black text-slate-400 mt-auto uppercase tracking-widest">
                              <span className="text-[#123962]">October 12, 2025</span>
                              <span className="mx-3">&bull;</span>
                              <span>5 min read</span>
                           </div>
                        </div>
                     </Link>
                  ))}

                  {/* Event Card (Glassmorphism overlay style) */}
                  <Suspense fallback={
                     <div className="group bg-gradient-to-bl from-slate-100 to-white rounded-[2.5rem] border border-slate-100 flex flex-col justify-center items-center p-10 min-h-[480px] animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-slate-200 mb-4"></div>
                        <div className="h-6 w-48 bg-slate-200 rounded mb-2"></div>
                        <div className="h-4 w-32 bg-slate-200 rounded"></div>
                     </div>
                  }>
                     <FeaturedEvent />
                  </Suspense>
               </div>
            </div>
         </section>

      </div>
   );
}

async function FeaturedEvent() {
  const eventsRef = collection(db, 'events');
  const q = query(eventsRef, limit(1));
  let featuredEvent = null;
  
  try {
     const querySnapshot = await getDocs(q);
     if (!querySnapshot.empty) {
        featuredEvent = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as any;
     }
  } catch (error) {
     console.error("Error fetching featured event:", error);
  }

  if (!featuredEvent) {
     return (
        <div className="group bg-gradient-to-bl from-slate-100 to-white rounded-[2.5rem] border border-slate-100 flex flex-col justify-center items-center p-10 min-h-[480px]">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-300 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
           <h4 className="text-xl font-bold text-slate-400 mb-2">No Upcoming Events</h4>
           <p className="text-slate-400/80 text-sm text-center">Check back soon for conventions.</p>
        </div>
     );
  }

  return (
     <div className="group bg-gradient-to-bl from-[#123962] to-[#0c2848] rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(18,57,98,0.3)] relative flex flex-col justify-end p-10 min-h-[480px]">
        <div className="absolute inset-0 bg-black opacity-40 mix-blend-overlay group-hover:opacity-50 group-hover:scale-105 transition-all duration-1000" style={{ backgroundImage: `url('${featuredEvent.imageUrl || 'https://picsum.photos/seed/jamiatevent/600/800'}')`, backgroundSize: 'cover' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#123962] via-[#123962]/60 to-transparent"></div>

        <div className="relative z-10 w-full">
           {(featuredEvent.isActive !== false) && (
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/10">
                 <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                 <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">Upcoming Event</span>
              </div>
           )}
           <h4 className="text-3xl font-black text-white mb-6 leading-tight">{featuredEvent.title || "Annual Tarbiyati Convention"}</h4>
           <div className="px-6 py-5 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl mb-8 space-y-3">
              <p className="flex items-center text-white text-sm font-bold">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-3 text-[#1C7F93]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 {featuredEvent.dateStr || "TBD"}
              </p>
              <p className="flex items-center text-white text-sm font-bold">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-3 text-[#1C7F93]"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                 {featuredEvent.location || "TBD"}
              </p>
           </div>
           <Link href={`/events/${featuredEvent.id}`} className="inline-flex w-full justify-center px-6 py-4 bg-white text-[#123962] rounded-2xl font-extrabold text-sm hover:bg-[#1C7F93] hover:text-white transition-all duration-300 shadow-xl">
              Register Now
           </Link>
        </div>
     </div>
  );
}
