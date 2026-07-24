import Image from "next/image";
import localFont from "next/font/local";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { BookOpen, MessagesSquare, Heart, Trees, Utensils, HelpCircle, UserCheck } from "lucide-react";

const khandevane = localFont({
  src: "../../../public/fonts/Khandevane Regular.ttf",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: "Quran Club - A Journey Towards Understanding Quran | IJT Bahawalpur",
  description: "Join Quran Club by Islami Jamiat-e-Talaba Bahawalpur. A space of tranquility offering weekly Quran Tafseer classes, intellectual sessions, character development, retreat camps, and brotherhood.",
  path: "/quran-club",
  image: "/quranclub/bgquranclub.png",
  keywords: [
    "Quran Club",
    "Quran Tafseer",
    "Understanding Quran",
    "IJT Bahawalpur",
    "Intellectual Sessions",
    "Character Development",
    "Study Tours",
    "Bahawalpur Students"
  ]
});

export default function QuranClubLandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Quran Club - A Journey Towards Understanding Quran",
    "description": "A spiritual and educational journey of Quran Tafseer, intellectual sessions, character development, and retreat camps by Islami Jamiat-e-Talaba Bahawalpur.",
    "provider": {
      "@type": "Organization",
      "name": "Islami Jamiat-e-Talaba Bahawalpur",
      "url": "https://bwpjamiat.org"
    },
    "isAccessibleForFree": true,
    "inLanguage": ["Urdu", "English", "Arabic"]
  };

  return (
    <main className="relative w-full bg-[#09041b] text-white selection:bg-[#A81829] selection:text-white font-sans overflow-x-hidden scroll-smooth">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── 1. HERO SECTION (Original bgquranclub.png Poster) ── */}
      <section className="relative h-[100dvh] min-h-[600px] w-full overflow-hidden flex flex-col justify-between items-center pb-12">
        {/* Background Graphic Texture */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
          <Image
            src="/quranclub/bgquranclub.png"
            alt="Quran Club Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        </div>

        {/* Hero Content Container (Logo positioned in upper-middle area) */}
        <div className="relative z-10 flex flex-col items-center justify-start text-center w-full pt-36 sm:pt-32 md:pt-36 lg:pt-40 px-4 animate-page-reveal">
          {/* QURAN Club Logo Graphic */}
          <div className="relative w-[280px] xs:w-[320px] sm:w-[380px] md:w-[440px] lg:w-[480px] aspect-[16/7] flex items-center justify-center">
            <Image
              src="/quranclub/logoquranclub.png"
              alt="QURAN Club - A Journey Towards Understanding Quran"
              fill
              priority
              className="object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.8)]"
            />
          </div>

          {/* Mobile Only CTA Button positioned in the empty space below logo */}
          <div className="mt-10 sm:hidden z-30 pointer-events-auto">
            <a
              href="/quran-club/join"
              className="px-8 py-3.5 rounded-full bg-[#A81829] hover:bg-[#8B1425] text-white font-black text-sm uppercase tracking-wider shadow-[0_10px_24px_rgba(168,24,41,0.5)] border border-red-400/30 inline-block text-center whitespace-nowrap cursor-pointer"
            >
              Join Quran Club
            </a>
          </div>
        </div>

        {/* Quran Majeed Container (Moved downwards) */}
        <div className="absolute -bottom-24 sm:-bottom-36 md:-bottom-44 lg:-bottom-52 left-1/2 -translate-x-1/2 w-[130vw] sm:w-[100vw] md:w-[85vw] lg:w-[75vw] max-w-[950px] aspect-[16/9] z-10 pointer-events-none flex items-center justify-center">
          <Image
            src="/quranclub/quran.png"
            alt="Quran Majeed"
            fill
            priority
            className="object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          />
        </div>

        {/* Dark Mask Overlay at bottom of Hero */}
        <div 
          className="absolute bottom-0 inset-x-0 h-24 sm:h-32 md:h-40 lg:h-48 z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #09041b 0%, rgba(9, 4, 27, 0.96) 30%, rgba(9, 4, 27, 0.6) 65%, transparent 100%)'
          }}
        />

        {/* Desktop Only CTA Button above mask */}
        <div className="hidden sm:block absolute sm:bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-30">
          <a
            href="/quran-club/join"
            className="px-10 py-4 sm:px-12 sm:py-5 rounded-full bg-[#A81829] hover:bg-[#8B1425] text-white font-black text-base sm:text-lg md:text-xl uppercase tracking-wider shadow-[0_12px_32px_rgba(168,24,41,0.6)] hover:shadow-[0_16px_40px_rgba(168,24,41,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 border border-red-400/30 inline-block text-center whitespace-nowrap cursor-pointer"
          >
            Join Quran Club
          </a>
        </div>
      </section>

      {/* ── 2. INVITATION & PHILOSOPHY SECTION (Urdu Translation & Khandevane Font) ── */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-[#09041b] via-[#1a0512] to-[#09041b] border-t border-[#A81829]/20">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Ayah Card */}
          <div className="mb-10 p-8 sm:p-10 rounded-3xl bg-black/40 border border-[#A81829]/30 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
            <p className={`${khandevane.className} text-white text-3xl sm:text-4xl md:text-5xl tracking-wide leading-relaxed mb-6`} dir="rtl" lang="ar">
              كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ
            </p>
            <p 
              className="text-red-200/90 text-xl sm:text-2xl leading-loose font-medium"
              style={{ fontFamily: "var(--font-nastaliq)" }}
              dir="rtl"
            >
              &quot;یہ ایک بابرکت کتاب ہے جو ہم نے آپ کی طرف نازل کی ہے تاکہ لوگ اس کی آیات میں غور و فکر کریں۔&quot; <br />
              <span className="text-red-300/80 text-sm font-semibold tracking-wider block mt-2">[سورہ ص 38:29]</span>
            </p>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            A Place of Rest, Understanding & True Peace
          </h2>

          <p className="text-red-100/90 text-base sm:text-lg leading-relaxed font-medium max-w-3xl mx-auto mb-8">
            In the quiet moments amidst our busy lives, our hearts often search for a place of rest. The Quran is a profound source of healing and guidance. Together, we step away from the noise of the world, reflect upon His words, and allow them to deeply nourish our souls. This is a space built on genuine brotherhood, where we can grow at our own pace, supported by one another.
          </p>

        </div>
      </section>

      {/* ── 3. WHAT WE SHARE ON THIS JOURNEY (5 PILLARS) ── */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-[#09041b] via-[#240615] to-[#09041b] border-y border-[#A81829]/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-red-300 font-extrabold block mb-3">
              Our Journey Together
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              What We Share in <span className="text-red-400">Quran Club</span>
            </h2>
          </div>

          {/* 5 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8 text-red-400" />,
                title: "Weekly Quran Tafseer Classes",
                desc: "Deep, calm reflections to truly understand and connect with the Divine words."
              },
              {
                icon: <MessagesSquare className="w-8 h-8 text-red-400" />,
                title: "Intellectual Sessions",
                desc: "Meaningful, open conversations where your thoughts and questions are always welcomed and valued."
              },
              {
                icon: <Heart className="w-8 h-8 text-red-400" />,
                title: "Character Development",
                desc: "Drawing practical, gentle, and life-shaping lessons directly from the Quran."
              },
              {
                icon: <Trees className="w-8 h-8 text-red-400" />,
                title: "Study Tours & Retreat Camps",
                desc: "Stepping out into nature to reflect on His creation and strengthen our brotherly bonds."
              },
              {
                icon: <Utensils className="w-8 h-8 text-red-400" />,
                title: "Get-Togethers & Dinners",
                desc: "Sharing meals, breaking bread, and forming lasting ties of love and mutual support."
              }
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-3xl bg-gradient-to-b from-[#3D0613]/70 via-[#27040C]/80 to-[#150207]/90 border border-[#A81829]/30 backdrop-blur-xl hover:border-red-400/60 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-[#A81829]/20 border border-red-400/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{pillar.title}</h3>
                  <p className="text-red-100/80 text-sm sm:text-base leading-relaxed font-medium">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. MEMBERSHIP APPLICATION SECTION ── */}
      <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-[#09041b] via-[#1a0512] to-[#09041b]">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#A81829]/20 border border-red-400/30 text-white text-xs font-bold uppercase tracking-widest mb-4">
            <UserCheck className="w-4 h-4 text-red-300" /> Official Application Form
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Join Quran Club
          </h2>

          <p className="text-red-100/90 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
            To ensure genuine commitment, responsibility, and sustainable growth, we require all applicants to submit an official membership form. Joining Quran Club involves a monthly membership contribution of PKR 500.
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <a
              href="/quran-club/join"
              className="px-10 py-4 sm:px-12 sm:py-5 rounded-xl bg-[#A81829] hover:bg-[#8B1425] text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-[0_12px_32px_rgba(168,24,41,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 border border-red-400/30 inline-block text-center cursor-pointer"
            >
              Join Quran Club
            </a>
            <p className="text-red-300/60 text-xs uppercase tracking-widest font-semibold mt-2">
              Monthly Contribution: PKR 500 / month
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. FAQ SECTION ── */}
      <section className="relative py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-12 flex items-center justify-center gap-3">
          <HelpCircle className="w-8 h-8 text-red-400" /> Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: "Who is welcome to join Quran Club?",
              a: "Any brother seeking to build a meaningful, committed relationship with the Quran, develop high moral character, and bond in a supportive brotherhood is welcome."
            },
            {
              q: "Is there a membership contribution fee?",
              a: "Yes. To cover weekly study circles, physical guides, retreats, and dinners, a monthly contribution of PKR 500 is requested from each member."
            },
            {
              q: "What activities take place during Study Tours & Retreat Camps?",
              a: "We step out into nature to reflect on Allah's creation, engage in open intellectual sessions, bond with fellow brothers, and share meals together."
            }
          ].map((faq, idx) => (
            <div key={idx} className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#3D0613]/70 to-[#20030B]/90 border border-[#A81829]/30 backdrop-blur-md">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-red-100/80 text-sm sm:text-base leading-relaxed font-medium">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER BAR ── */}
      <footer className="relative py-8 text-center text-xs text-red-200/60 uppercase tracking-widest border-t border-[#A81829]/20 bg-black/40">
        <p className="mb-1.5">© 2026 Quran Club. Organized by Islami Jamiat-e-Talaba Bahawalpur.</p>
        <p className="text-[11px] text-red-300/50">bwpjamiat.org • @jamiatbwp</p>
      </footer>
    </main>
  );
}
