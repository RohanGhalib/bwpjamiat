import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getAllArticles } from '@/lib/db';

export const metadata: Metadata = buildMetadata({
  title: 'Articles & Dispatches | IJT Bahawalpur',
  description: 'Read articles, reflections, and dispatches from student leaders and scholars of Islami Jamiat-e-Talaba Bahawalpur.',
  path: '/articles',
  keywords: ['IJT Bahawalpur articles', 'student articles', 'Islamic student writing'],
});

export default async function ArticlesList() {
  const articles = await getAllArticles(false);

  return (
    <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#1C7F93]/10 to-transparent blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Official Blog</h2>
          <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Articles & Dispatches</h1>
          <p className="text-slate-500 font-medium leading-relaxed">Perspectives, updates, and deep dives from the student leaders and scholars of the Bahawalpur chapter.</p>
        </div>

        <div className="space-y-6">
          {articles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-50">
               <h3 className="text-xl font-bold text-slate-500">No articles published yet. Check back soon.</h3>
            </div>
          ) : articles.map(a => (
            <Link href={`/articles/${a.slug}`} key={a.id} className="group block bg-white rounded-[2rem] p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-50 hover:border-[#1C7F93]/20 hover:shadow-[0_20px_40px_rgba(28,127,147,0.08)] transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                 <div className="w-full md:w-56 h-48 md:h-36 bg-slate-100 rounded-2xl shrink-0 relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-100 p-1">
                    {a.thumbnailUrl ? (
                       <Image src={a.thumbnailUrl} alt={a.title} fill className="object-cover rounded-xl" sizes="(max-width: 768px) 100vw, 250px" />
                    ) : (
                       <div className="absolute inset-0 bg-[#123962]/5 group-hover:bg-transparent transition-colors duration-500 flex items-center justify-center">
                          <svg className="w-10 h-10 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path></svg>
                       </div>
                    )}
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                       <span className="text-[10px] font-bold bg-[#1C7F93]/10 text-[#1C7F93] px-3 py-1 rounded-full uppercase tracking-widest">{a.category}</span>
                       <span className="text-xs font-bold text-slate-400">{a.publishDate}</span>
                    </div>
                    <h3 className="font-extrabold text-[#123962] text-2xl mb-3 group-hover:text-[#1C7F93] transition-colors">{a.title}</h3>
                    <p className="text-slate-500 font-medium text-sm">By {a.authorName}</p>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
