import Link from 'next/link';

export default function Taranas() {
  const dummyTaranas = Array.from({length: 6}, (_, i) => ({
    id: i+1, title: `Jamiat Tarana Vol ${i+1}`,
    artist: "Shayan Tariq", duration: "04:30"
  }));

  return (
    <div className="min-h-screen bg-[#FAFCFF] pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0 overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-gradient-to-bl from-[#1C7F93]/10 to-transparent blur-[120px] rounded-bl-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Official Audio</h2>
          <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Taranas Gallery</h1>
          <p className="text-slate-500 font-medium leading-relaxed">The rhythmic heartbeat of our revolution. Listen to the anthems that have inspired millions across generations.</p>
        </div>

        <div className="bg-white rounded-[3rem] p-4 sm:p-8 lg:p-12 shadow-[0_20px_60px_rgba(18,57,98,0.03)] border border-slate-50">
          <div className="space-y-4">
             {dummyTaranas.map(t => (
               <div key={t.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-[#FAFCFF] rounded-3xl hover:bg-white border border-transparent hover:border-slate-100 shadow-sm hover:shadow-[0_10px_30px_rgba(28,127,147,0.06)] transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center space-x-6 mb-4 sm:mb-0">
                    <button className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-[#1C7F93] group-hover:bg-[#1C7F93] group-hover:text-white transition-colors duration-300 shrink-0 border border-slate-50">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
                    </button>
                    <div>
                      <h4 className="font-extrabold text-[#123962] text-xl mb-1">{t.title}</h4>
                      <p className="text-[#1C7F93] text-xs font-bold uppercase tracking-widest">{t.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:w-auto w-full">
                     <div className="h-1 flex-1 sm:w-32 bg-slate-100 rounded-full mx-4 overflow-hidden hidden sm:block">
                        <div className="h-full bg-slate-300 w-1/3 rounded-full group-hover:bg-[#1C7F93] transition-colors"></div>
                     </div>
                     <div className="text-slate-400 font-bold text-xs bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm shrink-0">
                       {t.duration}
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
