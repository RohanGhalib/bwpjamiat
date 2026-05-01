import Image from "next/image";
import localFont from "next/font/local";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ember'26 | South Punjab's First Teen Hackathon",
  description: "Join Ember'26 in Bahawalpur - a premier 2-day Game Jam and Hackathon for teens. Build games, learn from mentors, and innovate. Absolutely free registration!",
  keywords: ["Hackathon", "Game Jam", "Bahawalpur", "Teenagers", "Programming", "Innovista Cholistan", "Ember 2026"],
  alternates: {
    canonical: "https://jamiat.org.pk/ember",
  },
  openGraph: {
    title: "Ember'26 | Teen Hackathon & Game Jam",
    description: "South Punjab's first-ever hackathon for teenagers. March 7-8th at Innovista Cholistan.",
    url: "https://jamiat.org.pk/ember",
    siteName: "BWP Jamiat",
    images: [
      {
        url: "/emberbackground.jpg",
        width: 1200,
        height: 630,
        alt: "Ember'26 Hackathon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ember'26 | Teen Hackathon",
    description: "South Punjab's first-ever hackathon for teenagers.",
    images: ["/emberbackground.jpg"],
  },
};

const dreamPlanner = localFont({
  src: "../../../public/dreamplanner.otf",
  display: "swap",
});

import { getEmberTeam } from "@/lib/db";
import TeamCard from "@/components/ember/TeamCard";

import { Suspense } from "react";

export default async function EmberPage() {
  const allMembers = await getEmberTeam();

  // Hardcoded Leadership for main page as well
  const hardcodedLeadership = [
    { id: "president", name: "Rohan Ghalib", role: "President", img: "/rohan_profile.jpg", prominent: true },
    { id: "vp1", name: "Saim Bin Yusaf", role: "Vice President", img: "/person.png" },
    { id: "vp2", name: "Bisma Hanif", role: "Vice President", img: "/person.png" },
  ];

  const members = allMembers.filter(m => m.department !== "Leadership");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Ember'26 Hackathon & Game Jam",
    "startDate": "2026-03-07T09:00",
    "endDate": "2026-03-08T18:00",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "Innovista Cholistan",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Innovista Cholistan",
        "addressLocality": "Bahawalpur",
        "addressRegion": "Punjab",
        "addressCountry": "PK"
      }
    },
    "image": [
      "https://jamiat.org.pk/emberbackground.jpg"
    ],
    "description": "South Punjab's first ever Hackathon and Game Jam exclusively for teenagers. Join us for 48 hours of innovation.",
    "organizer": {
      "@type": "Organization",
      "name": "Innovista Cholistan",
      "url": "https://jamiat.org.pk"
    }
  };

  return (
    <main className="relative w-full overflow-x-hidden bg-[var(--c-navy-dark)]">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Hero Content Section ── */}
      <section className="relative h-auto min-h-[60vh] md:min-h-[700px] w-full flex items-start justify-center pt-24 md:pt-32 pb-32 md:pb-48 px-6 overflow-hidden">
        {/* Local Background Image Layer */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
          <Image
            src="/emberbackground.jpg"
            alt="Ember Background"
            fill
            priority
            sizes="100vw"
            className="object-cover blur-[8px] scale-105 saturate-[1.1] brightness-[1.0]"
          />
          {/* Muted gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--c-navy-dark)]/20 to-[var(--c-navy-dark)]" />
        </div>

        {/* Hero Content - Corrected Proportions */}
        <div className="relative z-10 flex flex-col items-center -rotate-[1deg] sm:-rotate-[2.5deg] animate-page-reveal w-full max-w-full">
          {/* Innovista Logo - Better mobile scaling */}
          <div className="relative mb-[-15px] sm:mb-[-45px] md:mb-[-55px] lg:mb-[-65px] z-20">
            <Image
              src="/logoinnovista.png"
              alt="Innovista"
              width={450}
              height={160}
              priority
              className="h-auto w-[180px] sm:w-[300px] md:w-[380px] lg:w-[440px] object-contain"
            />
          </div>

          {/* Main Title - Increased mobile size */}
          <h1 className={`${dreamPlanner.className} text-white text-center leading-[0.75] tracking-tighter text-[75px] xs:text-[95px] sm:text-[130px] md:text-[170px] lg:text-[210px] [text-shadow:4px_4px_0_#000] sm:[text-shadow:10px_10px_0_#000] w-full`}>
            EMBER'26
          </h1>

          {/* Location Subheading */}
          <h2 className={`${dreamPlanner.className} text-[var(--c-accent)] text-center leading-none tracking-[0.08em] text-[24px] sm:text-[42px] md:text-[55px] lg:text-[68px] mt-2 [text-shadow:2px_2px_0_#000] sm:[text-shadow:4px_4px_0_#000]`}>
            BAHAWALPUR
          </h2>
        </div>
      </section>

      {/* ── "What is Ember'26?" Section ── */}
      <section className="relative z-20 -mt-24 md:-mt-32 w-full px-0">
        <div className="w-full rounded-t-[50px] bg-[var(--c-orange)] px-8 pt-16 pb-28 md:px-16 md:pt-20 md:pb-40 border-t-8 border-[var(--c-orange-dark)]/30 shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
          <div className="max-w-6xl mx-auto">
            <h2 className={`${dreamPlanner.className} text-white text-[36px] sm:text-[50px] md:text-[65px] leading-tight mb-8 [text-shadow:5px_5px_0_#000]`}>
              WHAT IS EMBER'26?
            </h2>

            <div className="space-y-6">
              <p className={`${dreamPlanner.className} text-white text-[18px] sm:text-[24px] md:text-[30px] leading-snug`}>
                An epic 2-day Game Jam and Hackathon for teen artists, gamers, programmers, and tinkerers! Build an awesome game from scratch (zero experience required!) right here at Innovista Cholistan.
              </p>

              <p className={`${dreamPlanner.className} text-white text-[18px] sm:text-[24px] md:text-[30px] leading-snug`}>
                Just bring your laptop, charger, and any gear you might need. We will supply the expert mentors, dedicated guides, and absolutely <span className="underline decoration-2 md:decoration-4 underline-offset-4 md:underline-offset-8">FREE FOOD!</span>
              </p>

              <p className={`${dreamPlanner.className} text-white text-[18px] sm:text-[24px] md:text-[30px] leading-snug`}>
                Simply hit the signup link (link in bio) and await your approval. Once approved, join us on the 7th-8th March to make history at South Punjab's ultimate, first-ever hackathon event just for teenagers!
              </p>
            </div>
          </div>
        </div>

        {/* ── Unified Transition & Stats Section ── */}
        <div className="relative w-full bg-gradient-to-b from-[var(--c-orange)] to-[var(--c-navy-dark)] pt-0 pb-16">
          {/* Stats Ribbon - Overlapping the transition start */}
          <div className="relative -mt-16 px-6 z-30">
            <div className="max-w-5xl mx-auto glass-card rounded-[35px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-around gap-12 border-t border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">
              {/* Stat 1 */}
              <div className="flex flex-col items-center">
                <span className={`${dreamPlanner.className} text-[var(--c-accent)] text-[55px] md:text-[80px] leading-none mb-2 [text-shadow:4px_4px_0_rgba(0,0,0,0.3)]`}>250+</span>
                <span className="text-white/70 text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold">Participants</span>
              </div>

              <div className="hidden md:block w-[1px] h-16 bg-white/10" />

              {/* Stat 2 */}
              <div className="flex flex-col items-center">
                <span className={`${dreamPlanner.className} text-[var(--c-accent)] text-[55px] md:text-[80px] leading-none mb-2 [text-shadow:4px_4px_0_rgba(0,0,0,0.3)]`}>30+</span>
                <span className="text-white/70 text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold">Games Made</span>
              </div>

              <div className="hidden md:block w-[1px] h-16 bg-white/10" />

              {/* Stat 3 */}
              <div className="flex flex-col items-center">
                <span className={`${dreamPlanner.className} text-[var(--c-accent)] text-[55px] md:text-[80px] leading-none mb-2 [text-shadow:4px_4px_0_rgba(0,0,0,0.3)]`}>48</span>
                <span className="text-white/70 text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold">Hours Together</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Statement Section - Redesigned for more information ── */}
      <section className="relative z-20 px-8 py-24 md:py-36 flex flex-col items-center text-center overflow-hidden">
        {/* Dynamic Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[var(--c-orange)]/20 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[var(--c-accent)]/10 blur-[100px]" />
        </div>

        <p className={`${dreamPlanner.className} text-[var(--c-accent)] tracking-[0.3em] text-[18px] sm:text-[32px] md:text-[40px] uppercase mb-4 animate-fade-up px-4`}>
          South Punjab's First Ever
        </p>

        <h2 className={`${dreamPlanner.className} text-white text-[50px] xs:text-[70px] sm:text-[110px] md:text-[140px] lg:text-[180px] leading-[0.9] tracking-tighter [text-shadow:3px_3px_0_var(--c-orange),6px_6px_0_#000] sm:[text-shadow:4px_4px_0_var(--c-orange),8px_8px_0_#000] mb-12 animate-fade-up`}>
          HACKATHON
        </h2>

        {/* Feature Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {/* Item 1: For Teens */}
          <div className="glass-card rounded-[40px] p-10 flex flex-col items-center group hover:bg-white/[0.06] transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-[var(--c-accent)]/50 transition-colors">
              <span className="text-3xl">👤</span>
            </div>
            <h3 className={`${dreamPlanner.className} text-white text-[32px] sm:text-[42px] leading-tight mb-3`}>FOR TEENS</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-[250px]">
              Exclusively for ages 13–19. A high-energy space where the next generation of creators takes center stage.
            </p>
            <div className="mt-6 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--c-accent)] text-xs tracking-widest uppercase">
              Ages 13 – 19
            </div>
          </div>

          {/* Item 2: By Teens */}
          <div className="glass-card rounded-[40px] p-10 flex flex-col items-center group hover:bg-white/[0.06] transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-[var(--c-accent)]/50 transition-colors">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className={`${dreamPlanner.className} text-white text-[32px] sm:text-[42px] leading-tight mb-3`}>BY TEENS</h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-[250px]">
              Organized and mentored by fellow teen experts. We speak your language and share your passion for building.
            </p>
            <div className="mt-6 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[var(--c-accent)] text-xs tracking-widest uppercase">
              Built by Us
            </div>
          </div>

          {/* Item 3: Absolutely Free */}
          <div className="bg-[var(--c-orange)] rounded-[40px] p-10 flex flex-col items-center shadow-[0_20px_40px_rgba(201,74,0,0.2)] group hover:scale-[1.02] transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-black/10 flex items-center justify-center mb-6 border border-white/20">
              <span className="text-3xl text-white">🎁</span>
            </div>
            <h3 className={`${dreamPlanner.className} text-white text-[32px] sm:text-[42px] leading-tight mb-3`}>ABSOLUTELY FREE</h3>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-[250px]">
              No registration fees. Free food, free mentorship, and free gear. Pure innovation, zero cost.
            </p>
            <div className="mt-6 px-4 py-1 rounded-full bg-black/20 text-white text-xs tracking-widest uppercase">
              Zero Cost Ever
            </div>
          </div>
        </div>
      </section>

      {/* ── Press Releases Section ── */}
      <section className="relative z-20 px-8 py-20 md:py-32 flex flex-col items-center">
        <h2 className={`${dreamPlanner.className} text-center text-white text-[45px] sm:text-[65px] md:text-[80px] leading-tight [text-shadow:6px_6px_0_var(--c-orange)] mb-16 animate-fade-up`}>
          PRESS RELEASES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {/* Article 1 */}
          <div className="glass-card rounded-[32px] p-8 flex flex-col h-full group hover:bg-white/[0.08] transition-all duration-300 cursor-pointer">
            <div className="text-[var(--c-accent)] text-xs tracking-widest uppercase mb-4 opacity-70">Feature Story</div>
            <h3 className={`${dreamPlanner.className} text-white text-[24px] sm:text-[28px] leading-tight mb-6 flex-grow`}>
              How an 18 year old hosted South Punjab's First hackathon for teens
            </h3>
            <div className="flex items-center text-[var(--c-accent)] group-hover:translate-x-2 transition-transform">
              <span className="text-sm font-bold tracking-widest mr-2 uppercase">Read Article</span>
              <span>→</span>
            </div>
          </div>

          {/* Article 2 */}
          <div className="glass-card rounded-[32px] p-8 flex flex-col h-full group hover:bg-white/[0.08] transition-all duration-300 cursor-pointer opacity-80">
            <div className="text-[var(--c-accent)] text-xs tracking-widest uppercase mb-4 opacity-70">Coming Soon</div>
            <h3 className={`${dreamPlanner.className} text-white text-[24px] sm:text-[28px] leading-tight mb-6 flex-grow`}>
              The Future of Tech in Bahawalpur: Insights from the Ember'26 Mentors
            </h3>
            <div className="flex items-center text-[var(--c-accent)] group-hover:translate-x-2 transition-transform">
              <span className="text-sm font-bold tracking-widest mr-2 uppercase">Coming Soon</span>
              <span>→</span>
            </div>
          </div>

          {/* Article 3 */}
          <div className="glass-card rounded-[32px] p-8 flex flex-col h-full group hover:bg-white/[0.08] transition-all duration-300 cursor-pointer opacity-80">
            <div className="text-[var(--c-accent)] text-xs tracking-widest uppercase mb-4 opacity-70">Coming Soon</div>
            <h3 className={`${dreamPlanner.className} text-white text-[24px] sm:text-[28px] leading-tight mb-6 flex-grow`}>
              Building Games in 48 Hours: The Best Creations from Ember'26
            </h3>
            <div className="flex items-center text-[var(--c-accent)] group-hover:translate-x-2 transition-transform">
              <span className="text-sm font-bold tracking-widest mr-2 uppercase">Coming Soon</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team Section ── */}
      <section className="relative z-20 px-8 py-24 md:py-40 flex flex-col items-center">
        {/* Noor Mahal Background Blend */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <Image
            src="/noor.png"
            alt=""
            fill
            className="object-cover object-bottom opacity-[0.25] mix-blend-luminosity grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--c-navy-dark)] via-[var(--c-navy-dark)]/80 to-[var(--c-navy-dark)]" />
        </div>

        <h2 className={`${dreamPlanner.className} text-center text-white text-[45px] sm:text-[65px] md:text-[85px] leading-tight [text-shadow:6px_6px_0_var(--c-orange)] mb-20 animate-fade-up`}>
          OUR PROUD TEAM
        </h2>

        <Suspense fallback={
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-[var(--c-accent)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <HomeTeamLoader hardcodedLeadership={hardcodedLeadership} />
        </Suspense>

        {/* See All Team Button */}
        <div className="mt-24 animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <Link 
            href="/ember/team" 
            className={`${dreamPlanner.className} bg-[var(--c-orange)] hover:bg-[var(--c-accent)] text-white px-12 py-4 rounded-full text-2xl tracking-widest shadow-2xl transition-all hover:scale-105 flex items-center gap-3 group`}
          >
            SEE ALL TEAM <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </section>

      {/* ── Sponsors Section (Infinite Carousel) ── */}
      <section className="relative z-20 py-20 bg-black/20 border-y border-white/5 overflow-hidden">
        <h2 className={`${dreamPlanner.className} text-center text-white/40 text-[24px] tracking-[0.5em] mb-12 uppercase`}>
          Our Partners & Sponsors
        </h2>

        <div className="flex w-full overflow-hidden">
          {/* Infinite Scroll Container */}
          <div className="flex animate-[scroll_40s_linear_infinite] min-w-max items-center gap-20 px-10">
            {["GO PADEL", "OPTIONS RESTAURANT", "ALKHIDMAT FOUNDATION", "INNOVISTA CHOLISTAN"].map((name, i) => (
              <div key={i} className={`${dreamPlanner.className} text-white/20 text-[40px] md:text-[60px] whitespace-nowrap hover:text-white/40 transition-colors cursor-default`}>
                {name}
              </div>
            ))}
            {/* Duplicate for seamless looping */}
            {["GO PADEL", "OPTIONS RESTAURANT", "ALKHIDMAT FOUNDATION", "INNOVISTA CHOLISTAN"].map((name, i) => (
              <div key={`dup-${i}`} className={`${dreamPlanner.className} text-white/20 text-[40px] md:text-[60px] whitespace-nowrap hover:text-white/40 transition-colors cursor-default`}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mentors Section ── */}
      <section className="relative z-20 px-8 py-24 md:py-32 flex flex-col items-center">
        <h2 className={`${dreamPlanner.className} text-center text-white text-[45px] sm:text-[65px] md:text-[80px] leading-tight [text-shadow:6px_6px_0_var(--c-orange)] mb-16 animate-fade-up`}>
          THE MENTORS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-7xl px-4">
          {[
            { name: "Syed Zeeshan Akhtar", title: "Chairman Alkhidmat South Punjab", img: "/ember/mentors/zeeshan.jpg" },
            { name: "Saadiya Shaikh ", title: "Deputy Manager BDCM", img: "/ember/mentors/saadiya.jpeg" },
            { name: "Muhammad Madni", title: "Principal KIPS College Bahawalpur", img: "/ember/mentors/madni.jpg" },
            { name: "Hanzlah Saleem", title: "Motivational Speaker", img: "/ember/mentors/hanzlah.png" },
            { name: "Ubaid Ur Rahman", title: "President IJT Bahawalpur", img: "/ember/mentors/ubaid.png" },
            { name: "Adnan Faisal", title: "Director DAS Bahawalpur", img: "/ember/mentors/adnan.jpg" },
            { name: "Azam Gujjar", title: "Director SNGPL Bahawalpur", img: "/ember/mentors/azam.png" },
            { name: "Muhtshim Daud", title: "COO ThinkCode IT Solutions", img: "/ember/mentors/muhtshim.jpeg" }

          ].map((mentor, i) => (
            <div key={i} className="flex flex-col items-center group animate-fade-up" style={{ animationDelay: `${0.05 * i}s` }}>
              <div className="w-full max-w-[320px] aspect-square rounded-[40px] bg-white/5 border border-white/10 mb-6 overflow-hidden group-hover:border-[var(--c-accent)] transition-all duration-500 relative shadow-2xl">
                <Image
                  src={mentor.img}
                  alt={mentor.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-navy-dark)]/90 via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity" />
              </div>
              <p className={`${dreamPlanner.className} text-white text-2xl sm:text-3xl text-center mb-1 group-hover:text-[var(--c-accent)] transition-colors`}>{mentor.name}</p>
              <p className="text-[var(--c-accent)] text-xs sm:text-sm tracking-[0.15em] uppercase font-bold text-center opacity-70 group-hover:opacity-100 transition-all">{mentor.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="relative z-20 px-8 py-20 md:py-32 bg-[var(--c-navy-dark)]/50">
        <div className="max-w-4xl mx-auto">
          <h2 className={`${dreamPlanner.className} text-center text-white text-[45px] sm:text-[65px] md:text-[80px] leading-tight [text-shadow:6px_6px_0_var(--c-orange)] mb-16 animate-fade-up`}>
            QUESTIONS?
          </h2>
          <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {[
              { q: "Who can participate?", a: "Any teen aged 13-19 from South Punjab with a passion for building, design, or gaming!" },
              { q: "What should I bring?", a: "Your laptop, charger, and a collaborative spirit. We provide the food, power, and Wi-Fi." },
              { q: "Is it really free?", a: "Yes, absolutely! Every aspect of Ember'26 is completely free for all participants." }
            ].map((faq, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 md:p-8 hover:bg-white/5 transition-colors border-white/5">
                <h3 className={`${dreamPlanner.className} text-white text-2xl mb-2`}>{faq.q}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram Section ── */}
      <section className="relative z-20 px-8 py-24 md:py-32 flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <div className="glass-card rounded-[40px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden relative group">
            {/* Background Glows */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#E1306C]/20 blur-[80px] group-hover:bg-[#E1306C]/30 transition-colors duration-700" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#5851DB]/20 blur-[80px] group-hover:bg-[#5851DB]/30 transition-colors duration-700" />

            {/* Left Side: Visual/Icon */}
            <div className="flex-shrink-0 relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-[35px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-1 shadow-2xl">
                <div className="w-full h-full rounded-[31px] bg-[var(--c-navy-dark)] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-16 h-16 md:w-24 md:h-24 text-white fill-current">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white text-[var(--c-navy-dark)] font-bold px-4 py-1 rounded-full text-sm shadow-xl animate-bounce">
                LIVE
              </div>
            </div>

            {/* Right Side: Content */}
            <div className="flex-grow text-center md:text-left">
              <h2 className={`${dreamPlanner.className} text-white text-[32px] md:text-[50px] leading-tight mb-4`}>
                STAY IN THE LOOP
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto md:mx-0">
                Follow us on Instagram for exclusive behind-the-scenes content, event updates, and highlights from South Punjab's biggest teen community.
              </p>

              <a
                href="https://instagram.com/emberbahawalpur"
                target="_blank"
                rel="noopener noreferrer"
                className={`${dreamPlanner.className} inline-flex items-center gap-3 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white px-10 py-4 rounded-full text-xl hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(238,42,123,0.3)]`}
              >
                @EMBERBAHAWALPUR
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Farewell Section ── */}
      <section className="relative z-20 py-32 md:py-60 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-orange)]/20 to-transparent -z-10" />
        <h2 className={`${dreamPlanner.className} text-white text-[45px] sm:text-[100px] md:text-[140px] lg:text-[180px] leading-none [text-shadow:6px_6px_0_#000] md:[text-shadow:10px_10px_0_#000] mb-8 animate-page-reveal`}>
          SEE YOU NEXT TIME!!!!
        </h2>
        <p className={`${dreamPlanner.className} text-[var(--c-accent)] text-lg sm:text-3xl tracking-[0.2em] opacity-80 uppercase px-4 mb-16`}>
          EMBER'26 | BAHAWALPUR
        </p>

        {/* Credits & Copyright */}
        <div className="flex flex-col items-center gap-4 opacity-50 hover:opacity-100 transition-opacity duration-500">
          <p className="text-white/70 text-sm tracking-widest uppercase font-bold">
            © 2026 BWP Jamiat. All Rights Reserved.
          </p>
          <a
            href="https://rohanghalib.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--c-accent)] text-xs tracking-[0.3em] uppercase hover:underline decoration-1 underline-offset-4"
          >
            An Event by Rohan Ghalib
          </a>
        </div>
      </section>

      {/* Footer Space */}
      <div className="h-32 w-full bg-[var(--c-navy-dark)]" />
    </main>
  );
}

async function HomeTeamLoader({ hardcodedLeadership }: { hardcodedLeadership: any[] }) {
  const allMembers = await getEmberTeam();
  const members = allMembers.filter(m => m.department !== "Leadership");

  return (
    <div className="flex flex-col items-center gap-24 w-full max-w-7xl">
      {/* Leadership Section */}
      <div className="flex flex-col items-center gap-16 w-full">
        <h3 className={`${dreamPlanner.className} text-[var(--c-accent)] text-2xl sm:text-4xl tracking-[0.2em] mb-4`}>LEADERSHIP</h3>
        <div className="flex flex-col items-center gap-20 w-full">
          <TeamCard {...hardcodedLeadership[0]} prominent={true} />
          <div className="flex flex-wrap justify-center gap-12 sm:gap-24">
            {hardcodedLeadership.slice(1).map((member, i) => (
              <TeamCard key={member.id} {...member} size="lg" delay={0.1 * i} />
            ))}
          </div>
        </div>
      </div>

      {/* Key Organizers (From DB) */}
      {members.length > 0 && (
        <div className="flex flex-col items-center gap-12 w-full mt-20">
          <h3 className={`${dreamPlanner.className} text-[var(--c-accent)] text-2xl sm:text-4xl tracking-[0.2em] mb-4`}>CORE ORGANIZERS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full place-items-center">
            {members.slice(0, 8).map((member, i) => (
              <TeamCard 
                key={member.id} 
                {...member} 
                size="sm" 
                delay={0.05 * i}
                polished={member.department === "Discipline"}
              />
            ))}
          </div>
        </div>
      )}

      {/* Static Group Photos as complementary view */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 w-full mt-32">
        {/* Boys Team Card */}
        <div className="flex flex-col items-center group animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="relative p-5 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-[1.03] group-hover:-rotate-1"
            style={{
              background: "linear-gradient(135deg, #5D3A1A 0%, #8B5E3C 25%, #4A2E15 50%, #C49A6C 75%, #5D3A1A 100%)",
              border: "4px solid #3d2710"
            }}>
            <div className="absolute inset-0 border-[1px] border-white/10 pointer-events-none" />
            <div className="relative bg-[#1a0f05] p-3 rounded-sm overflow-hidden">
              <Image
                src="/boys.png"
                alt="Boys Team"
                width={500}
                height={350}
                className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] h-auto object-cover rounded-xs sepia-[0.2] brightness-90 group-hover:brightness-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
          <p className={`${dreamPlanner.className} mt-8 text-[var(--c-accent)] text-[24px] sm:text-[32px] tracking-[0.15em] [text-shadow:3px_3px_0_#000]`}>
            THE BOYS
          </p>
        </div>

        {/* Girls Team Card */}
        <div className="flex flex-col items-center group animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="relative p-5 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-[1.03] group-hover:rotate-1"
            style={{
              background: "linear-gradient(135deg, #5D3A1A 0%, #8B5E3C 25%, #4A2E15 50%, #C49A6C 75%, #5D3A1A 100%)",
              border: "4px solid #3d2710"
            }}>
            <div className="absolute inset-0 border-[1px] border-white/10 pointer-events-none" />
            <div className="relative bg-[#1a0f05] p-3 rounded-sm overflow-hidden">
              <Image
                src="/girls.png"
                alt="Girls Team"
                width={500}
                height={350}
                className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] h-auto object-cover rounded-xs sepia-[0.2] brightness-90 group-hover:brightness-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
          <p className={`${dreamPlanner.className} mt-8 text-[var(--c-accent)] text-[24px] sm:text-[32px] tracking-[0.15em] [text-shadow:3px_3px_0_#000]`}>
            THE GIRLS
          </p>
        </div>
      </div>
    </div>
  );
}