import Link from 'next/link';

export default function LMS() {
  const dummyCourses = Array.from({length: 4}, (_, i) => ({
    id: i+1, title: `Understanding Islam Foundation Vol ${i+1}`,
    instructor: "Dept of Tarbiyah BWP"
  }));

  return (
    <div className="min-h-screen bg-[#FAFCFF] pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Training Portal</h2>
          <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Learning Management</h1>
          <p className="text-slate-500 font-medium leading-relaxed">Exclusive access to structural courses and foundational curriculum for members of the organization.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {dummyCourses.map(c => (
            <Link href={`/lms/course/${c.id}`} key={c.id} className="group bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-50 hover:border-[#1C7F93]/20 hover:shadow-[0_20px_40px_rgba(28,127,147,0.08)] transition-all duration-500 transform hover:-translate-y-1 block">
               <div className="flex items-center space-x-6 mb-6">
                 <div className="w-16 h-16 bg-[#FAFCFF] shadow-inner rounded-2xl flex items-center justify-center text-[#1C7F93] ring-1 ring-slate-100 group-hover:ring-[#1C7F93] transition-all shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                 </div>
                 <div>
                   <h3 className="text-xl font-extrabold text-[#123962] mb-1 group-hover:text-[#1C7F93] transition-colors">{c.title}</h3>
                   <p className="text-slate-500 text-sm font-medium">{c.instructor}</p>
                 </div>
               </div>
               
               <div className="mb-6">
                 <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                    <span>Course Progress</span>
                    <span className="text-[#1C7F93]">40%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1C7F93] w-[40%] rounded-full group-hover:bg-[#123962] transition-colors"></div>
                 </div>
               </div>
               
               <div className="w-full py-3 bg-[#FAFCFF] text-center text-[#123962] rounded-xl font-bold text-sm group-hover:bg-[#1C7F93] border border-slate-100 group-hover:text-white transition-all duration-300">
                  Continue Learning
               </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
