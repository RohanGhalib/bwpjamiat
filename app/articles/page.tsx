import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles & Dispatches | IJT Bahawalpur',
  description: 'Read articles, reflections, and dispatches from student leaders and scholars of Islami Jamiat-e-Talaba Bahawalpur.',
  openGraph: {
    title: 'Articles & Dispatches | IJT Bahawalpur',
    description: 'Official blog and articles from IJT Bahawalpur student leadership.',
    url: 'https://bwpjamiat.vercel.app/articles',
    siteName: 'IJT Bahawalpur',
    locale: 'en_PK',
    type: 'website',
  },
};

export default function ArticlesList() {
  const dummyArticles = Array.from({length: 6}, (_, i) => ({
    id: i+1, title: `The Impact of Youth on Societal Transformation`,
    author: "Hamza Tariq", date: "Oct 12, 2025"
  }));

  return (
    <div className="min-h-screen bg-transparent  pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#1C7F93]/10 to-transparent blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Official Blog</h2>
          <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Articles & Dispatches</h1>
          <p className="text-slate-500 font-medium leading-relaxed">Perspectives, updates, and deep dives from the student leaders and scholars of the Bahawalpur chapter.</p>
        </div>

        <div className="space-y-6">
          {dummyArticles.map(a => (
            <Link href={`/articles/${a.id}`} key={a.id} className="group block bg-white rounded-[2rem] p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-50 hover:border-[#1C7F93]/20 hover:shadow-[0_20px_40px_rgba(28,127,147,0.08)] transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                 <div className="w-full md:w-56 h-48 md:h-36 bg-slate-100 rounded-2xl shrink-0 relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-100 p-1">
                    <div className="absolute inset-0 bg-[#123962]/5 group-hover:bg-transparent transition-colors duration-500"></div>
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                       <span className="text-[10px] font-bold bg-[#1C7F93]/10 text-[#1C7F93] px-3 py-1 rounded-full uppercase tracking-widest">Thought</span>
                       <span className="text-xs font-bold text-slate-400">{a.date}</span>
                    </div>
                    <h3 className="font-extrabold text-[#123962] text-2xl mb-3 group-hover:text-[#1C7F93] transition-colors">{a.title}</h3>
                    <p className="text-slate-500 font-medium text-sm">By {a.author}</p>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
