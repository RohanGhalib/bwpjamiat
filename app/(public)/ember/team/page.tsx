import Image from "next/image";
import localFont from "next/font/local";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Meet the Team | Ember'26",
  description: "The passionate individuals behind South Punjab's first teen hackathon. Meet the organizers, developers, and creatives of Ember'26.",
};

const dreamPlanner = localFont({
  src: "../../../../public/dreamplanner.otf",
  display: "swap",
});

const teamData = {
  leadership: [
    { name: "Rohan Ghalib", role: "President", img: "/rohan_profile.jpg", prominent: true },
    { name: "Saim Bin Yusaf", role: "Vice President", img: "/person.png" },
    { name: "Bisma Hanif", role: "Vice President", img: "/person.png" },
  ],
  executiveCouncil: {
    title: "EXECUTIVE COUNCIL",
    director: { name: "Syed Hamil Shah", role: "Director Executive Council", img: "/person.png" },
    members: [
      { name: "Team Member", role: "Council Member", img: "/person.png" },
      { name: "Team Member", role: "Council Member", img: "/person.png" },
    ],
  },
  departments: [
    {
      name: "MANAGEMENT",
      groups: [
        { title: "THE BOYS", members: [{ name: "Boy 1", role: "Lead", img: "/person.png" }, { name: "Boy 2", role: "Member", img: "/person.png" }, { name: "Boy 3", role: "Member", img: "/person.png" }] },
        { title: "THE GIRLS", members: [{ name: "Girl 1", role: "Lead", img: "/person.png" }, { name: "Girl 2", role: "Member", img: "/person.png" }, { name: "Girl 3", role: "Member", img: "/person.png" }] },
      ]
    },
    {
      name: "LOGISTICS",
      groups: [
        { title: "THE BOYS", members: [{ name: "Boy 1", role: "Lead", img: "/person.png" }, { name: "Boy 2", role: "Member", img: "/person.png" }, { name: "Boy 3", role: "Member", img: "/person.png" }] },
      ]
    },
    {
      name: "MEDIA",
      groups: [
        { title: "TEAM", members: [{ name: "Member 1", role: "Creative", img: "/person.png" }, { name: "Member 2", role: "Editor", img: "/person.png" }] },
      ]
    },
    {
      name: "MARKETING",
      groups: [
        { title: "TEAM", members: [{ name: "Member 1", role: "Strategy", img: "/person.png" }, { name: "Member 2", role: "PR", img: "/person.png" }] },
      ]
    },
    {
      name: "OUTREACH",
      groups: [
        { title: "TEAM", members: [{ name: "Member 1", role: "Liaison", img: "/person.png" }, { name: "Member 2", role: "Ambassador", img: "/person.png" }] },
      ]
    },
    {
      name: "DISCIPLINE",
      groups: [
        { title: "CHIEF OFFICER", members: [{ name: "Alyan Qazi", role: "Discipline Officer", img: "/person.png", polished: true }] },
      ]
    },
    {
      name: "SECURITY",
      groups: [
        { title: "TEAM", members: [{ name: "Member 1", role: "Safety", img: "/person.png" }, { name: "Member 2", role: "Ground", img: "/person.png" }] },
      ]
    },
  ]
};

function TeamCard({ name, role, img, delay = 0, size = "md", prominent = false, polished = false }: { name: string, role: string, img: string, delay?: number, size?: "sm" | "md" | "lg", prominent?: boolean, polished?: boolean }) {
  const sizeClasses = prominent ? "min-w-[300px] sm:min-w-[400px]" : size === "lg" ? "min-w-[280px]" : size === "sm" ? "min-w-[180px]" : "min-w-[220px]";
  
  return (
    <div 
      className="flex flex-col items-center group animate-fade-up w-full max-w-fit mx-auto" 
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`relative p-2 sm:p-4 rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:scale-[1.03] ${prominent ? "border-2 border-[var(--c-accent)]/30 group-hover:border-[var(--c-accent)]" : polished ? "border border-[var(--c-accent)]/20" : ""} ${sizeClasses}`}
        style={{
          background: prominent 
            ? "linear-gradient(135deg, #1a0f05 0%, #3d2710 50%, #1a0f05 100%)"
            : "linear-gradient(135deg, #5D3A1A 0%, #8B5E3C 25%, #4A2E15 50%, #C49A6C 75%, #5D3A1A 100%)",
          border: prominent ? "none" : polished ? "1px solid rgba(230, 106, 46, 0.3)" : "2px solid #3d2710"
        }}>
        {prominent && (
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--c-accent)]/20 via-transparent to-[var(--c-orange)]/20 rounded-xl pointer-events-none" />
        )}
        {polished && !prominent && (
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--c-accent)]/5 to-transparent rounded-xl pointer-events-none" />
        )}
        <div className="relative aspect-[4/5] w-full bg-[#1a0f05] rounded-lg overflow-hidden">
          <Image
            src={img}
            alt={name}
            fill
            className="object-cover sepia-[0.1] brightness-90 group-hover:brightness-105 group-hover:sepia-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        </div>
      </div>
      <div className="mt-8 text-center px-6">
        <h3 className={`${dreamPlanner.className} text-white ${prominent ? "text-4xl sm:text-5xl lg:text-6xl" : "text-2xl sm:text-3xl"} mb-2 group-hover:text-[var(--c-accent)] transition-colors duration-300`}>
          {name}
        </h3>
        <p className={`${prominent ? "text-sm sm:text-base lg:text-lg" : "text-[10px] sm:text-xs"} text-[var(--c-accent)] tracking-[0.2em] uppercase font-bold opacity-70 group-hover:opacity-100 transition-opacity`}>
          {role}
        </p>
      </div>
    </div>
  );
}

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

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32 space-y-40">
        
        {/* Leadership Section */}
        <section className="flex flex-col items-center gap-24">
          {/* President - Most Prominent */}
          <div className="w-full">
            <TeamCard {...teamData.leadership[0]} prominent={true} delay={0.1} />
          </div>

          {/* Vice Presidents */}
          <div className="flex flex-wrap justify-center gap-12 sm:gap-24">
            {teamData.leadership.slice(1).map((member, i) => (
              <TeamCard key={i} {...member} size="lg" delay={0.2 + (i * 0.1)} />
            ))}
          </div>
        </section>

        {/* Executive Council */}
        <section className="flex flex-col items-center">
          <h2 className={`${dreamPlanner.className} text-white text-[40px] sm:text-[60px] md:text-[80px] mb-16 [text-shadow:4px_4px_0_var(--c-orange)] text-center`}>
            {teamData.executiveCouncil.title}
          </h2>
          <div className="flex flex-col items-center gap-16">
            <TeamCard {...teamData.executiveCouncil.director} size="lg" />
            <div className="flex flex-wrap justify-center gap-12">
              {teamData.executiveCouncil.members.map((member, i) => (
                <TeamCard key={i} {...member} delay={i * 0.1} />
              ))}
            </div>
          </div>
        </section>

        {/* Departments */}
        {teamData.departments.map((dept, deptIdx) => (
          <section key={dept.name} className="relative">
            <div className="flex items-center gap-6 mb-16 px-0 md:px-0">
              <h2 className={`${dreamPlanner.className} text-white text-[40px] sm:text-[60px] md:text-[80px] leading-none [text-shadow:4px_4px_0_var(--c-orange)] whitespace-nowrap`}>
                {dept.name}
              </h2>
              <div className="h-[2px] w-full bg-gradient-to-r from-white/20 to-transparent" />
            </div>

            <div className="space-y-20 px-0 md:px-0">
              {dept.groups.map((group, groupIdx) => (
                <div key={group.title} className="flex flex-col items-center md:items-start">
                  <h3 className={`${dreamPlanner.className} text-[var(--c-accent)] text-2xl sm:text-3xl tracking-[0.2em] mb-10`}>
                    {group.title}
                  </h3>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 w-full place-items-center md:place-items-start`}>
                    {group.members.map((member, i) => (
                      <TeamCard 
                        key={i} 
                        {...member} 
                        delay={(deptIdx * 0.2) + (groupIdx * 0.1) + (i * 0.05)} 
                        size="sm" 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

      </div>

      {/* ── Footer ── */}
      <section className="relative z-10 py-24 border-t border-white/5 flex flex-col items-center text-center px-6">
        <h2 className={`${dreamPlanner.className} text-white text-[40px] sm:text-[60px] md:text-[80px] mb-12`}>
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
