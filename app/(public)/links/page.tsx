import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import HeroBubble from '@/components/HeroBubble';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Links | Islami Jamiat-e-Talaba Bahawalpur',
  description: 'Connect with Islami Jamiat-e-Talaba Bahawalpur across all platforms. Access our events, literature, social media, and more.',
  path: '/links',
});

// A highly reusable link button component
function LinkButton({ href, icon, title, subtitle, isExternal = false }: { href: string, icon?: React.ReactNode, title: string, subtitle?: string, isExternal?: boolean }) {
  const content = (
    <div className="relative group w-full flex items-center p-4 mb-4 bg-white/70 backdrop-blur-md rounded-[1.5rem] border border-white/40 shadow-sm hover:shadow-[0_10px_30px_rgba(28,127,147,0.15)] hover:border-[#1C7F93]/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C7F93]/0 via-[#1C7F93]/5 to-[#1C7F93]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {icon && (
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-slate-50/80 rounded-xl text-[#123962] mr-4 group-hover:bg-[#1C7F93] group-hover:text-white transition-colors duration-300 shadow-sm">
          {icon}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-[#123962] font-extrabold text-base leading-tight group-hover:text-[#1C7F93] transition-colors">{title}</h3>
        {subtitle && <p className="text-slate-500 text-xs font-medium mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex-shrink-0 text-slate-300 group-hover:text-[#1C7F93] transition-colors">
        {isExternal ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
        )}
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="w-full max-w-lg mx-auto block">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="w-full max-w-lg mx-auto block">
      {content}
    </Link>
  );
}

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-[#FAFCFF] relative overflow-hidden flex flex-col font-sans selection:bg-[#1C7F93] selection:text-white pb-10">

      {/* Background Elements (Noor Mahal Theme) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-[#1C7F93]/10 via-[#2669A9]/5 to-transparent blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 inset-x-0 w-full h-[70vh] lg:h-[95vh] opacity-[0.25] md:opacity-[0.15] mix-blend-luminosity grayscale transform scale-110 origin-bottom">
          <Image src="/noor.png" alt="Noor Mahal Background" fill sizes="100vw" className="object-cover md:object-contain object-bottom" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFCFF]/80 via-white/60 to-[#FAFCFF]/90"></div>
      </div>

      <main className="container mx-auto px-4 pt-32 sm:pt-40 relative z-10 flex flex-col items-center flex-1 max-w-xl">

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-10 w-full relative">
          {/* Decorative glowing orb behind logo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-40 h-40 bg-gradient-to-br from-[#1C7F93]/40 to-[#2669A9]/30 blur-2xl rounded-full -z-10 animate-pulse"></div>

          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center transform hover:scale-105 transition-all duration-500 mb-6 group hover:drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]">
            <Image src="/logo.png" alt="IJT Bahawalpur Logo" fill sizes="128px" className="object-contain transition-transform duration-500" priority />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#123962] to-[#1C7F93] tracking-tight mb-3 drop-shadow-sm">
            IJT Bahawalpur
          </h1>
          <p className="text-[15px] font-semibold text-slate-600 max-w-sm mb-8 leading-relaxed">
            Awakening a generation for the pleasure of Allah. Discover our movement, events, and community.
          </p>

          <HeroBubble />
        </div>

        {/* Links Container */}
        <div className="w-full space-y-1 mb-16 relative">
          <div className="absolute -inset-4 bg-white/30 rounded-[2.5rem] blur-xl -z-10"></div>

          <h2 className="text-[10px] font-black tracking-[0.25em] text-[#1C7F93] uppercase text-center mb-6">Our Ecosystem</h2>

          <LinkButton
            href="/events"
            title="Upcoming Conventions"
            subtitle="Register for our latest events and programs"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>}
          />

          <LinkButton
            href="/contact"
            title="Apply For Membership"
            subtitle="Join the student revolution today"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>}
          />
          <h2 className="text-[10px] font-black tracking-[0.25em] text-[#1C7F93] uppercase text-center mt-10 mb-6">Social Media</h2>

          <LinkButton
            href="https://instagram.com/bwp.jamiat"
            title="Instagram"
            subtitle="Follow our visual journey"
            isExternal
            icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>}
          />

          <LinkButton
            href="https://www.facebook.com/profile.php?id=61584553894384"
            title="Facebook"
            subtitle="Join our community discussions"
            isExternal
            icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>}
          />

          <LinkButton
            href="https://tiktok.com/@bwp.jamiat"
            title="TikTok"
            subtitle="Watch our latest shorts & highlights"
            isExternal
            icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" /></svg>}
          />
          <h2 className="text-[10px] font-black tracking-[0.25em] text-[#1C7F93] uppercase text-center mt-10 mb-6">Explore Portals</h2>

          <LinkButton
            href="/literature"
            title="Literature Archive"
            subtitle="Access our ideological books & magazines"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>}
          />

          <LinkButton
            href="/taranas"
            title="Taranas Gallery"
            subtitle="Listen to revolutionary anthems"
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" /></svg>}
          />


        </div>

      </main>

      {/* Footer Section */}
      <footer className="w-full relative z-10 pt-12 mt-auto pb-8 flex flex-col items-center">
        <div className="w-full max-w-sm px-6 mb-8 text-center">
          <h2 style={{ fontFamily: 'var(--font-nastaliq)' }} className="text-3xl sm:text-4xl text-[#123962] leading-[2.2] tracking-normal drop-shadow-sm font-bold opacity-90">
            گامزن ہے سوئے منزل<br></br>
            جمعیت کا کارواں
          </h2>
          <div className="mx-auto mt-4 h-[2px] w-16 bg-gradient-to-r from-transparent via-[#1C7F93] to-transparent"></div>
        </div>

        <div className="flex flex-col items-center justify-center group opacity-80 hover:opacity-100 transition-opacity">
          <Link href="/">
            <div className="relative w-10 h-10 mb-3 bg-white rounded-full p-2 shadow-sm border border-slate-100 transform group-hover:scale-110 transition-transform duration-300">
              <Image src="/logo.png" alt="IJT Logo" fill sizes="40px" className="object-contain p-1" />
            </div>
          </Link>
          <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-black text-center">Islami Jamiat-e-Talaba <br /> Bahawalpur</p>
        </div>
      </footer>
    </div>
  );
}
