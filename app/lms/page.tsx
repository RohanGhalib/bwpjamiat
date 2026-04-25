import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NISAB Learning Portal | IJT Bahawalpur',
  description: 'Access the official NISAB curriculum for Rafaqat and Rukniyat members of Islami Jamiat-e-Talaba Bahawalpur.',
  openGraph: {
    title: 'NISAB Learning Portal | IJT Bahawalpur',
    description: 'Exclusive NISAB training system for IJT Bahawalpur members.',
    url: 'https://bwpjamiat.vercel.app/lms',
    siteName: 'IJT Bahawalpur',
    locale: 'en_PK',
    type: 'website',
  },
};

export default function LMS() {
  const nisabCourses = [
  {
    id: "raf-mem",
    title: "NISAB for Rafaqat: Memorization",
    instructor: "Basic Syllabus",
    content: "Salah with Dua Al-Qunoot, Salat ul Janaza with translation, Last 10 Surahs of the 30th Juz."
  },
  {
    id: "raf-taf",
    title: "NISAB for Rafaqat: Tafseer",
    instructor: "Basic Syllabus",
    content: "Surah Al-Asr, Surah Al-Humaza, Surah Al-Feel, Sural Al-Zilzal, Surah Al-Takathur."
  },
  {
    id: "raf-lit",
    title: "NISAB for Rafaqat: Hadith & Literature",
    instructor: "Basic Syllabus",
    content: "40 Hadith (Khurram Murad), Mashal e Rah, Taleem ul Islam, Rahmat e Aalam, Khutbat, Deeniyat, and essential books."
  },
  {
    id: "ruk-mem",
    title: "NISAB for Rukniyat: Memorization",
    instructor: "Advanced Syllabus",
    content: "Proper recitation of Quran. Surahs: As-Saff, Al-Ghashiyah, Al-A'la, Al-Infitar, Luqman (Ruku 2), Al-Baqarah (last Ruku), Ad-Duhaa to An-Naas."
  },
  {
    id: "ruk-taf",
    title: "NISAB for Rukniyat: Tafseer",
    instructor: "Advanced Syllabus",
    content: "Tafseer of Memorization Surahs, plus Surah At-Tawbah, Surah Al-Isra, Surah Al-An'am, Surah Al-Hujurat, and Surah Hud."
  },
  {
    id: "ruk-lit",
    title: "NISAB for Rukniyat: Hadith, Fiqh & Literature",
    instructor: "Advanced Syllabus",
    content: "Zad E Rah, Asan Fiqh, Khutbat e Madras, An-Nabi ul Khatim, Islami Nizam e Zindagi, Tajdid wa Ihya e Din, Rasail wa Masail and related literature."
  }
  ];

  return (
    <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Training Portal</h2>
          <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Official NISAB System</h1>
          <p className="text-slate-500 font-medium leading-relaxed">Exclusive access to the structural curriculum for Rafaqat and Rukniyat members of the organization.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nisabCourses.map(c => (
            <div key={c.id} className="group bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-50 hover:border-[#1C7F93]/20 hover:shadow-[0_20px_40px_rgba(28,127,147,0.08)] transition-all duration-500 transform hover:-translate-y-1 block cursor-default flex flex-col h-full">
               <div className="flex items-center space-x-6 mb-6">
                 <div className="w-16 h-16 bg-[#FAFCFF] shadow-inner rounded-2xl flex items-center justify-center text-[#1C7F93] ring-1 ring-slate-100 group-hover:ring-[#1C7F93] transition-all shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                 </div>
                 <div>
                   <h3 className="text-lg md:text-xl font-extrabold text-[#123962] mb-1 group-hover:text-[#1C7F93] transition-colors">{c.title}</h3>
                   <p className="text-[#1C7F93] text-xs font-bold tracking-widest uppercase">{c.instructor}</p>
                 </div>
               </div>
               
               <div className="mb-8 flex-1">
                 <p className="text-slate-500 text-sm font-medium leading-relaxed">{c.content}</p>
               </div>
               
               <div className="w-full py-3 bg-slate-50 text-center text-slate-400 rounded-xl font-bold text-sm border border-slate-100 cursor-not-allowed">
                  Course Material Pending
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
