import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#123962] text-white py-24 relative overflow-hidden flex flex-col justify-center min-h-[70vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-[#123962] to-blue-900 opacity-90 z-0"></div>
        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm font-medium text-blue-100">Welcome to Islami Jamiat-e-Talaba</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight max-w-4xl mx-auto text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
            The Largest Student Organization In Pakistan
          </h1>
          <p className="text-xl md:text-2xl text-blue-100/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Nurturing future leaders through education, discipline, and Islamic tarbiyah in Bahawalpur.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <Link href="/contact" className="px-8 py-3.5 bg-[#1C7F93] text-white rounded-lg font-bold hover:bg-white hover:text-[#123962] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto text-center">
              Join Us Today
            </Link>
            <Link href="/literature" className="px-8 py-3.5 bg-white/5 border border-white/20 text-white rounded-lg font-bold hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto text-center">
              Explore Literature
            </Link>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-sm font-bold text-[#1C7F93] tracking-widest uppercase mb-3">Our Core Philosophy</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-[#123962] mb-12">Vision & Mission</h3>
          <div className="grid md:grid-cols-2 gap-8 text-gray-600">
            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-blue-900/5 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-[#1C7F93] rounded-xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Education Excellence</h4>
              <p className="leading-relaxed text-gray-500">Fostering academic brilliance and holistic development among the student community, ensuring they are well-equipped to lead across all professional fields.</p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-blue-900/5 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-[#1C7F93] rounded-xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Spiritual Purification</h4>
              <p className="leading-relaxed text-gray-500">Promoting Islamic values, moral integrity, and deep spiritual discipline to create conscious individuals who serve humanity for the sake of Allah.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Programs */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#123962] mb-4">Our 5-Point Agenda</h2>
            <p className="text-gray-500">Through our continuous efforts, we execute practical programs aimed at uplifting the condition of students mentally, physically, and spiritually.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Dawah', 'Organization', 'Training', 'Islamic Education Movement'].map((program, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
                <div className="text-4xl font-black text-gray-100 mb-4 group-hover:text-blue-50 transition-colors">0{i+1}</div>
                <h3 className="text-xl font-bold text-[#123962] mb-3 group-hover:text-[#1C7F93] transition-colors">{program}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Strategic objective to deeply establish {program.toLowerCase()} activities as the core pillar of student development in the region.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Figures / Stats */}
      <section className="py-20 bg-gradient-to-br from-[#123962] to-[#1C7F93] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center divide-x divide-white/10">
            <div className="px-4"><div className="text-5xl font-black mb-3">35+</div><div className="font-medium text-blue-100 tracking-wide">Active Units</div></div>
            <div className="px-4"><div className="text-5xl font-black mb-3">5K+</div><div className="font-medium text-blue-100 tracking-wide">Members</div></div>
            <div className="px-4"><div className="text-5xl font-black mb-3">120+</div><div className="font-medium text-blue-100 tracking-wide">Annual Events</div></div>
            <div className="px-4"><div className="text-5xl font-black mb-3">50+</div><div className="font-medium text-blue-100 tracking-wide">Publications</div></div>
          </div>
        </div>
      </section>

      {/* Recent Activity (Articles + Events) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-16 lg:gap-12">
            
            <div className="lg:col-span-2">
               <div className="flex justify-between items-end mb-10 pb-4 border-b border-gray-100">
                 <div>
                   <h2 className="text-3xl font-bold text-[#123962]">Recent Press Releases & Articles</h2>
                   <p className="text-gray-500 mt-2 text-sm">Stay updated with our latest thoughts and actions.</p>
                 </div>
                 <Link href="/articles" className="text-[#1C7F93] hover:text-[#123962] font-semibold text-sm transition-colors whitespace-nowrap ml-4">
                   View All &rarr;
                 </Link>
               </div>
               
               <div className="space-y-8">
                 {[1, 2, 3].map(i => (
                   <Link key={i} href={`/articles/slug-${i}`} className="flex flex-col sm:flex-row gap-6 group">
                     <div className="w-full sm:w-48 h-48 sm:h-32 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden relative">
                        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                        <img src={`https://picsum.photos/seed/${i*10}/400/300`} alt="placeholder" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     </div>
                     <div className="flex-1 flex flex-col justify-center">
                       <span className="text-xs font-bold text-[#1C7F93] uppercase tracking-wider mb-2">Press Release</span>
                       <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1C7F93] transition-colors leading-tight mb-2">
                         IJT Concludes Seven-Day Al-Furqan Training Camp with Record Participation
                       </h3>
                       <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                          <span>July {20+i}, 2025</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span>By Media Cell</span>
                       </p>
                       <p className="text-gray-600 text-sm line-clamp-2">A landmark event focusing on leadership skills, deep Quranic reflection, and contemporary socio-political issues facing the university structure.</p>
                     </div>
                   </Link>
                 ))}
               </div>
            </div>
            
            <div>
               <h2 className="text-3xl font-bold text-[#123962] mb-10 pb-4 border-b border-gray-100">Upcoming Event</h2>
               <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl shadow-blue-900/5 group">
                 <div className="h-56 bg-gray-100 relative overflow-hidden">
                    <img src="https://picsum.photos/seed/event/600/400" alt="event poster" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#123962]/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="bg-[#1C7F93] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Convention</span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 text-center flex flex-col items-center min-w-[70px]">
                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Nov</span>
                      <span className="text-2xl font-black text-[#123962] leading-none mt-1">15</span>
                    </div>
                 </div>
                 <div className="p-8">
                   <h3 className="font-bold text-xl text-gray-900 mb-4 group-hover:text-[#1C7F93] transition-colors">Annual Jamiat Conference BWP Chapter</h3>
                   <div className="text-sm text-gray-600 space-y-3 mb-8">
                     <p className="flex items-center gap-3">
                       <span className="w-8 h-8 rounded-full bg-blue-50 text-[#1C7F93] flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>
                       <span className="font-medium">09:00 AM - 05:00 PM</span>
                     </p>
                     <p className="flex items-center gap-3">
                       <span className="w-8 h-8 rounded-full bg-blue-50 text-[#1C7F93] flex items-center justify-center flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg></span>
                       <span className="font-medium">Main Auditorium, IUB</span>
                     </p>
                   </div>
                   <Link href="/events/1" className="flex items-center justify-center w-full py-3.5 bg-gray-50 border border-gray-200 text-[#123962] rounded-xl hover:bg-[#123962] hover:text-white transition-all font-bold">
                     Event Details
                   </Link>
                 </div>
               </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
