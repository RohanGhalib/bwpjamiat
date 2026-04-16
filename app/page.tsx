import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFCFF] overflow-hidden selection:bg-[#1C7F93] selection:text-white font-sans">
      
      {/* Hero Banner - Modern Soft Mesh */}
      <section className="relative pt-40 pb-24 lg:pt-48 lg:pb-32 flex flex-col justify-center min-h-[95vh] z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-br from-[#1C7F93]/20 via-[#2669A9]/10 to-transparent blur-[120px] rounded-full -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#123962]/5 to-transparent blur-[100px] rounded-full -z-10 pointer-events-none"></div>
        <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-gradient-to-tr from-green-100/40 to-transparent blur-[80px] rounded-full -z-10 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full mb-10 shadow-sm border border-slate-100/50 transform hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1C7F93] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1C7F93]"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-[#123962] uppercase">Since 1947 &bull; Striving For Truth</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[1.05] max-w-5xl mx-auto text-[#123962]">
            Nurturing Leaders for an <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1C7F93] to-[#2669A9] inline-block mt-2">Islamic Awakening</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
            Islami Jamiat-e-Talaba is the largest student network in Pakistan. We build human capital, foster holistic development, and actively advocate for an Islamic society based on the teachings of the Quran and Sunnah.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto relative">
            <Link href="/contact" className="group relative px-10 py-4 bg-[#123962] text-white rounded-full font-bold shadow-[0_10px_30px_rgba(18,57,98,0.2)] hover:shadow-[0_20px_40px_rgba(28,127,147,0.3)] hover:-translate-y-1 w-full sm:w-auto text-center transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C7F93] to-[#123962] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10">Join The Movement</span>
            </Link>
            <Link href="/about" className="px-10 py-4 bg-white/70 backdrop-blur-md border border-slate-200/50 text-[#123962] rounded-full font-extrabold hover:bg-white transition-all duration-300 shadow-sm hover:shadow-lg w-full sm:w-auto text-center">
              Explore Our Vision
            </Link>
          </div>
        </div>
      </section>

      {/* The 5-Point Agenda - Soft Elevated Cards */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-sm font-black text-[#1C7F93] tracking-widest uppercase mb-4 text-center">Core Ideology</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-[#123962] tracking-tight">The 5 Points Towards Revolution</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-50 hover:border-[#1C7F93]/20 hover:shadow-[0_30px_60px_rgba(28,127,147,0.08)] transition-all duration-500 group relative overflow-hidden transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#1C7F93]/5 to-transparent rounded-bl-full -z-10 group-hover:scale-150 group-hover:bg-[#1C7F93]/10 transition-all duration-700"></div>
              <div className="w-16 h-16 bg-[#FAFCFF] shadow-sm rounded-2xl flex items-center justify-center mb-8 text-[#1C7F93] ring-1 ring-slate-100 group-hover:ring-[#1C7F93] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
              </div>
              <h4 className="text-2xl font-extrabold text-[#123962] mb-4">Dawah</h4>
              <p className="text-slate-500/90 leading-relaxed font-medium">Inviting students to the way of Allah, fostering a deep connection with the Quran & Sunnah, and instilling responsibility.</p>
            </div>
            
            <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-50 hover:border-[#1C7F93]/20 hover:shadow-[0_30px_60px_rgba(28,127,147,0.08)] transition-all duration-500 group relative overflow-hidden transform hover:-translate-y-2 lg:mt-12">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#1C7F93]/5 to-transparent rounded-bl-full -z-10 group-hover:scale-150 group-hover:bg-[#1C7F93]/10 transition-all duration-700"></div>
              <div className="w-16 h-16 bg-[#FAFCFF] shadow-sm rounded-2xl flex items-center justify-center mb-8 text-[#1C7F93] ring-1 ring-slate-100 group-hover:ring-[#1C7F93] transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
              </div>
              <h4 className="text-2xl font-extrabold text-[#123962] mb-4">Organization</h4>
              <p className="text-slate-500/90 leading-relaxed font-medium">Uniting youth on a shared Islamic platform, empowering them to discover their identity and historical heritage.</p>
            </div>

            <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-50 hover:border-[#1C7F93]/20 hover:shadow-[0_30px_60px_rgba(28,127,147,0.08)] transition-all duration-500 group relative overflow-hidden transform hover:-translate-y-2">
               <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#1C7F93]/5 to-transparent rounded-bl-full -z-10 group-hover:scale-150 group-hover:bg-[#1C7F93]/10 transition-all duration-700"></div>
              <div className="w-16 h-16 bg-[#FAFCFF] shadow-sm rounded-2xl flex items-center justify-center mb-8 text-[#1C7F93] ring-1 ring-slate-100 group-hover:ring-[#1C7F93] transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
              </div>
              <h4 className="text-2xl font-extrabold text-[#123962] mb-4">Training</h4>
              <p className="text-slate-500/90 leading-relaxed font-medium">Equipping the future generation with advanced leadership skills, pristine morals, and unshakeable character.</p>
            </div>
            
             <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-50 hover:border-[#1C7F93]/20 hover:shadow-[0_30px_60px_rgba(28,127,147,0.08)] transition-all duration-500 group relative overflow-hidden transform hover:-translate-y-2 md:col-span-2 lg:col-span-1 lg:col-start-2 lg:-mt-12">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#1C7F93]/5 to-transparent rounded-bl-full -z-10 group-hover:scale-150 group-hover:bg-[#1C7F93]/10 transition-all duration-700"></div>
              <div className="w-16 h-16 bg-[#FAFCFF] shadow-sm rounded-2xl flex items-center justify-center mb-8 text-[#1C7F93] ring-1 ring-slate-100 group-hover:ring-[#1C7F93] transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
              </div>
              <h4 className="text-2xl font-extrabold text-[#123962] mb-4">Education</h4>
              <p className="text-slate-500/90 leading-relaxed font-medium">Leading an educational movement advocating for youth rights and the integration of profound Islamic principles into academia.</p>
            </div>
            
             <div className="bg-white p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-50 hover:border-[#1C7F93]/20 hover:shadow-[0_30px_60px_rgba(28,127,147,0.08)] transition-all duration-500 group relative overflow-hidden transform hover:-translate-y-2 md:col-span-2 lg:col-span-1">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#1C7F93]/5 to-transparent rounded-bl-full -z-10 group-hover:scale-150 group-hover:bg-[#1C7F93]/10 transition-all duration-700"></div>
              <div className="w-16 h-16 bg-[#FAFCFF] shadow-sm rounded-2xl flex items-center justify-center mb-8 text-[#1C7F93] ring-1 ring-slate-100 group-hover:ring-[#1C7F93] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
              </div>
              <h4 className="text-2xl font-extrabold text-[#123962] mb-4">Social Work</h4>
              <p className="text-slate-500/90 leading-relaxed font-medium">Dedication to public service, working actively towards a just welfare society free from exploitation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Soft Stats Banner */}
      <section className="py-24 relative overflow-hidden my-12">
        <div className="absolute inset-x-4 inset-y-0 bg-[#123962] rounded-[3rem]"></div>
        <div className="absolute inset-x-4 inset-y-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 rounded-[3rem]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#1C7F93]/40 to-transparent blur-[80px] rounded-full mix-blend-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10 max-w-6xl py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 text-center">
            <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-500">
               <span className="text-7xl lg:text-8xl font-black text-white mb-2 tracking-tighter">75</span>
               <span className="text-[#1C7F93] font-black uppercase tracking-[0.2em] text-xs">Years of Legacy</span>
            </div>
            <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-500">
               <span className="text-7xl lg:text-8xl font-black text-white mb-2 tracking-tighter">1M</span>
               <span className="text-[#1C7F93] font-black uppercase tracking-[0.2em] text-xs">Alumni Global</span>
            </div>
            <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-500">
               <span className="text-7xl lg:text-8xl font-black text-white mb-2 tracking-tighter">400</span>
               <span className="text-[#1C7F93] font-black uppercase tracking-[0.2em] text-xs">Active Units</span>
            </div>
            <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-500">
               <span className="text-7xl lg:text-8xl font-black text-white mb-2 tracking-tighter">10K</span>
               <span className="text-[#1C7F93] font-black uppercase tracking-[0.2em] text-xs">Annual Events</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles & Events */}
      <section className="pt-20 pb-40 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 px-4">
            <div className="max-w-xl">
              <h2 className="text-sm font-black text-[#1C7F93] tracking-widest uppercase mb-4">Stay Updated</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-[#123962] tracking-tight">Latest Dispatches</h3>
            </div>
            <Link href="/articles" className="mt-8 md:mt-0 px-8 py-3.5 bg-white shadow-sm border border-slate-100 text-[#123962] rounded-full font-bold hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
               View All News
            </Link>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-10 px-4">
             {/* Article Cards */}
             {[1, 2].map((i) => (
                <Link href={`/articles/${i}`} key={i} className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-50 hover:border-slate-100 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-2">
                   <div className="h-64 bg-slate-100 relative overflow-hidden m-3 rounded-[2rem]">
                      <div className="absolute inset-0 bg-[#123962]/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                      <Image src={`https://picsum.photos/seed/${i*50}/600/400`} alt="Article Image" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-5 left-5 z-20 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#1C7F93]">Tarbiyah</span>
                      </div>
                   </div>
                   <div className="px-8 pb-8 pt-6 flex-1 flex flex-col">
                      <h4 className="text-2xl font-extrabold text-[#123962] mb-4 leading-snug group-hover:text-[#1C7F93] transition-colors">The Pursuit of Knowledge in the 21st Century Islamic Renaissance</h4>
                      <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1 font-medium">An exploration of what it means to be a student in the modern university while maintaining pristine ideological boundaries...</p>
                      <div className="flex items-center text-xs font-bold text-slate-400 mt-auto uppercase tracking-wide">
                         <span className="text-[#123962]">October 12, 2025</span>
                         <span className="mx-3">&bull;</span>
                         <span>5 min read</span>
                      </div>
                   </div>
                </Link>
             ))}

             {/* Event Card (Glassmorphism overlay style) */}
             <div className="group bg-gradient-to-bl from-[#123962] to-[#0c2848] rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(18,57,98,0.3)] relative flex flex-col justify-end p-10 min-h-[480px]">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/jamiatever/600/800')] opacity-40 mix-blend-overlay group-hover:opacity-50 group-hover:scale-105 transition-all duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#123962] via-[#123962]/60 to-transparent"></div>
                
                <div className="relative z-10 w-full">
                   <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                      <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">Upcoming Event</span>
                   </div>
                   <h4 className="text-3xl font-black text-white mb-6 leading-tight">Annual Tarbiyati Convention BWP</h4>
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
                   <Link href="/events/1" className="inline-flex w-full justify-center px-6 py-4 bg-white text-[#123962] rounded-2xl font-extrabold text-sm hover:bg-[#1C7F93] hover:text-white transition-all duration-300 shadow-xl">
                      Register Now
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}
