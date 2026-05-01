import Image from "next/image";
import localFont from "next/font/local";
import { Metadata } from "next";
import Link from "next/link";
import { getEmberTeam } from "@/lib/db";
import { EmberMember } from "@/lib/types";
import TeamCard from "@/components/ember/TeamCard";

export const metadata: Metadata = {
  title: "Meet the Team | Ember'26",
  description: "The passionate individuals behind South Punjab's first teen hackathon. Meet the organizers, developers, and creatives of Ember'26.",
};

const dreamPlanner = localFont({
  src: "../../../../public/dreamplanner.otf",
  display: "swap",
});

import { Suspense } from "react";

export default function EmberTeamPage() {
  return (
    <main className="relative w-full overflow-x-hidden bg-[var(--c-navy-dark)] min-h-screen">
      {/* ── Background Elements ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/emberbackground.jpg"
          alt=""
          fill
          priority
          className="object-cover blur-[10px] scale-110 opacity-40 brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--c-navy-dark)]/40 via-[var(--c-navy-dark)] to-[var(--c-navy-dark)]" />
      </div>

      {/* ── Navigation ── */}
      <nav className="relative z-20 pt-8 px-8 max-w-7xl mx-auto">
        <Link 
          href="/ember" 
          className={`${dreamPlanner.className} text-[var(--c-accent)] hover:text-white transition-colors text-xl tracking-widest flex items-center gap-2 group`}
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO HOME
        </Link>
      </nav>

      {/* ── Hero Section ── */}
      <header className="relative z-10 pt-16 pb-24 px-6 flex flex-col items-center text-center">
        <div className="animate-page-reveal">
          <h1 className={`${dreamPlanner.className} text-white leading-[0.8] tracking-tighter text-[60px] xs:text-[80px] sm:text-[100px] md:text-[140px] lg:text-[180px] [text-shadow:4px_4px_0_#000] sm:[text-shadow:8px_8px_0_#000]`}>
            THE TEAM FOR 2026
          </h1>
          <p className={`${dreamPlanner.className} text-[var(--c-accent)] text-lg sm:text-2xl tracking-[0.3em] uppercase mt-4 [text-shadow:2px_2px_0_#000]`}>
            Pioneering the Future of Innovation
          </p>
        </div>
      </header>

      <Suspense fallback={
        <div className="flex justify-center items-center py-40">
          <div className="w-12 h-12 border-4 border-[var(--c-accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <TeamListLoader />
      </Suspense>

      {/* ── Footer ── */}
      <section className="relative z-10 py-24 border-t border-white/5 flex flex-col items-center text-center px-6">
        <h2 className={`${dreamPlanner.className} text-white text-[45px] sm:text-[60px] md:text-[80px] mb-12`}>
          WANT TO JOIN US?
        </h2>
        <a 
          href="https://instagram.com/emberbahawalpur" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`${dreamPlanner.className} bg-white text-[var(--c-navy-dark)] px-12 py-5 rounded-full text-2xl hover:bg-[var(--c-accent)] hover:text-white transition-all shadow-2xl hover:scale-105`}
        >
          GET IN TOUCH
        </a>
      </section>

      {/* Bottom Spacer */}
      <div className="h-32 w-full" />
    </main>
  );
}

async function TeamListLoader() {
  const allMembers = await getEmberTeam();

  // Hardcoded Leadership for consistent branding/styling
  const hardcodedLeadership = [
    { id: "president", name: "Rohan Ghalib", role: "President", img: "/rohan_profile.jpg", prominent: true },
    { id: "vp1", name: "Saim Bin Yusaf", role: "Vice President", img: "/person.png" },
    { id: "vp2", name: "Bisma Hanif", role: "Vice President", img: "/person.png" },
  ];

  // Filter out any leadership members that might have been added to the DB to avoid duplicates
  const members = allMembers.filter(m => m.department !== "Leadership");

  // Grouping logic
  const executiveCouncil = members.filter(m => m.department === "Executive Council");
  const otherDepts = Array.from(new Set(members.map(m => m.department)))
    .filter(d => d !== "Leadership" && d !== "Executive Council");

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32 space-y-40">
      
      {/* Leadership Section */}
      <section className="flex flex-col items-center gap-24">
        {/* President - Most Prominent */}
        <div className="w-full">
          <TeamCard {...hardcodedLeadership[0]} prominent={true} delay={0.1} />
        </div>

        {/* Vice Presidents */}
        <div className="flex flex-wrap justify-center gap-12 sm:gap-24">
          {hardcodedLeadership.slice(1).map((member, i) => (
            <TeamCard key={member.id} {...member} size="lg" delay={0.2 + (i * 0.1)} />
          ))}
        </div>
      </section>

      {/* Executive Council */}
      {executiveCouncil.length > 0 && (
        <section className="flex flex-col items-center">
          <h2 className={`${dreamPlanner.className} text-white text-[40px] sm:text-[60px] md:text-[80px] mb-16 [text-shadow:4px_4px_0_var(--c-orange)] text-center`}>
            EXECUTIVE COUNCIL
          </h2>
          <div className="flex flex-col items-center gap-16">
            {/* Director (Assuming first in EC order) */}
            <TeamCard {...executiveCouncil[0]} size="lg" />
            
            {executiveCouncil.length > 1 && (
              <div className="flex flex-wrap justify-center gap-12">
                {executiveCouncil.slice(1).map((member, i) => (
                  <TeamCard key={member.id} {...member} delay={i * 0.1} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Departments */}
      {otherDepts.map((deptName, deptIdx) => {
        const deptMembers = members.filter(m => m.department === deptName);
        const boys = deptMembers.filter(m => m.gender === 'boy');
        const girls = deptMembers.filter(m => m.gender === 'girl');

        return (
          <section key={deptName} className="relative">
            <div className="flex items-center gap-6 mb-16 px-0 md:px-0">
              <h2 className={`${dreamPlanner.className} text-white text-[40px] sm:text-[60px] md:text-[80px] leading-none [text-shadow:4px_4px_0_var(--c-orange)] whitespace-nowrap`}>
                {deptName}
              </h2>
              <div className="h-[2px] w-full bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            <div className="space-y-20 px-0 md:px-0">
              {/* Boys Group if exists */}
              {boys.length > 0 && (
                <div className="flex flex-col items-center md:items-start">
                  <h3 className={`${dreamPlanner.className} text-[var(--c-accent)] text-2xl sm:text-3xl tracking-[0.2em] mb-10`}>
                    {girls.length > 0 ? "THE BOYS" : "TEAM"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 w-full place-items-center md:place-items-start">
                    {boys.map((member, i) => (
                      <TeamCard 
                        key={member.id} 
                        {...member} 
                        delay={(deptIdx * 0.2) + (i * 0.05)} 
                        size="sm"
                        polished={deptName === "Discipline"}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Girls Group if exists */}
              {girls.length > 0 && (
                <div className="flex flex-col items-center md:items-start">
                  <h3 className={`${dreamPlanner.className} text-[var(--c-accent)] text-2xl sm:text-3xl tracking-[0.2em] mb-10`}>
                    {boys.length > 0 ? "THE GIRLS" : "TEAM"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 w-full place-items-center md:place-items-start">
                    {girls.map((member, i) => (
                      <TeamCard 
                        key={member.id} 
                        {...member} 
                        delay={(deptIdx * 0.2) + (i * 0.05)} 
                        size="sm"
                        polished={deptName === "Discipline"}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })}

      {members.length === 0 && (
        <section className="py-40 text-center">
          <h2 className={`${dreamPlanner.className} text-white/20 text-4xl`}>TEAM DATA COMING SOON</h2>
        </section>
      )}

    </div>
  );
}
