import { Suspense } from 'react';
import TaranasGallery from '@/components/taranas/TaranasGallery';
import { getTaranas } from '@/lib/db';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Taranas Gallery | IJT Bahawalpur',
  description: 'Listen to the official Taranas and anthems of Islami Jamiat-e-Talaba Bahawalpur — the rhythmic heartbeat of the student revolution.',
  openGraph: {
    title: 'Taranas Gallery | IJT Bahawalpur',
    description: 'Official Taranas of Islami Jamiat-e-Talaba Bahawalpur.',
    url: 'https://bwpjamiat.vercel.app/taranas',
    siteName: 'IJT Bahawalpur',
    locale: 'en_PK',
    type: 'website',
  },
};

// This is now a Server Component that fetches the taranas from Firebase!
export default async function Taranas() {
  const taranas = await getTaranas();

  return (
    <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0 overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce-bar {
          0%, 100% { height: 3px; }
          50% { height: 14px; }
        }
      `}} />

      <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-gradient-to-bl from-[#1C7F93]/10 to-transparent blur-[120px] rounded-bl-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Official Audio</h2>
          <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Taranas Gallery</h1>
          <p className="text-slate-500 font-medium leading-relaxed">The rhythmic heartbeat of our revolution. Listen to the anthems that have inspired millions across generations.</p>
        </div>

        <Suspense fallback={<div className="text-center py-20 animate-pulse text-slate-400">Loading Taranas...</div>}>
          <TaranasGallery initialTaranas={taranas} />
        </Suspense>
      </div>
    </div>
  );
}
