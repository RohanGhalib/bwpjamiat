import Image from "next/image";
import localFont from "next/font/local";
import type { Metadata } from "next";
import RegistrationForm from "./RegistrationForm";
import { ArrowRight, BookOpen, HelpCircle, MapPin, Sparkles } from "lucide-react";

const chalkboard = localFont({
  src: "../../../public/restart/chalkboard.ttf",
  variable: "--font-chalkboard",
});

export const metadata: Metadata = {
  title: "Restart Camp '26 | IJT Bahawalpur",
  description: "Join Restart Camp '26 in Bahawalpur - a premier 4-day intensive crash course for 1st-year science students. Pass your final exams, get guess papers, and learn from experts. Absolutely free!",
  keywords: ["Restart Camp", "Bahawalpur", "1st Year", "Science Students", "FSc Crash Course", "IJT Bahawalpur", "Guess Papers"],
};

// Classroom Blackboard Doodles in White Chalk Style
const BenzeneDoodle = () => (
  <div className="absolute top-[100vh] left-[5%] opacity-[0.12] rotate-[15deg] pointer-events-none select-none hidden xl:block z-0">
    <svg className="w-32 h-32 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" />
      <polygon points="50,22 74,36 74,64 50,78 26,64 26,36" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="50" y1="15" x2="50" y2="5" />
      <line x1="80" y1="32" x2="88" y2="28" />
      <line x1="80" y1="68" x2="88" y2="72" />
    </svg>
  </div>
);

const MathDoodle = () => (
  <div className="absolute top-[180vh] right-[5%] opacity-[0.12] -rotate-[10deg] pointer-events-none select-none hidden xl:block z-0">
    <svg className="w-40 h-40 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
      <line x1="10" y1="50" x2="90" y2="50" strokeWidth="1.5" />
      <line x1="50" y1="10" x2="50" y2="90" strokeWidth="1.5" strokeDasharray="2 2" />
      <path d="M 10 30 Q 30 10, 50 50 T 90 70" strokeWidth="2" />
      <circle cx="50" cy="50" r="25" strokeDasharray="4 4" />
      <text x="82" y="46" fill="currentColor" className="text-[8px] font-sans">x</text>
      <text x="54" y="18" fill="currentColor" className="text-[8px] font-sans">y</text>
    </svg>
  </div>
);

const PhysicsDoodle = () => (
  <div className="absolute top-[260vh] left-[6%] opacity-[0.15] rotate-[5deg] pointer-events-none select-none hidden xl:block z-0 text-white font-mono text-left space-y-1 border border-dashed border-white/20 p-4 rounded-lg bg-black/5" style={{ fontFamily: "var(--font-chalkboard)" }}>
    <p className="text-base font-bold text-white mb-1">Physics hacks:</p>
    <p className="text-xs">W = F . d</p>
    <p className="text-xs">V = I R</p>
    <p className="text-xs">p = m v</p>
    <p className="text-xs">KE = 1/2 mv²</p>
    <p className="text-xs">τ = r × F</p>
  </div>
);

const GeometryDoodle = () => (
  <div className="absolute top-[340vh] right-[6%] opacity-[0.12] rotate-[20deg] pointer-events-none select-none hidden xl:block z-0">
    <svg className="w-36 h-36 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="15,80 85,80 50,20" />
      <circle cx="50" cy="60" r="20" strokeDasharray="3 3" />
      <path d="M 50 20 L 50 80" strokeDasharray="1 1" />
      <line x1="15" y1="80" x2="30" y2="45" strokeWidth="1" />
    </svg>
  </div>
);

// Classroom Pushpin element for cards
const Pushpin = () => (
  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#d93838] rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.45)] flex items-center justify-center z-20 pointer-events-none">
    <div className="w-1.5 h-1.5 bg-[#ffa4a4] rounded-full" />
  </div>
);

export default function RestartPage() {
  return (
    <main 
      className={`relative min-h-screen w-full text-white selection:bg-[#2a1405] selection:text-[#fcf8f2] ${chalkboard.variable} scroll-smooth`}
    >
      {/* Background Image - Fixed position for blackboard */}
      <div className="fixed inset-0 -z-20">
        <Image
          src="/restart/bg-green.jpg"
          alt="Chalkboard Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Classroom Doodles in Background */}
      <BenzeneDoodle />
      <MathDoodle />
      <PhysicsDoodle />
      <GeometryDoodle />

      {/* Top Books (Hanging from screen top) - Visible on both desktop and mobile, scaled up and shifted partially off-screen */}
      <div 
        className="absolute -top-10 sm:-top-14 md:-top-18 lg:-top-24 left-0 right-0 h-40 sm:h-52 md:h-64 lg:h-80 w-full -z-10 bg-[url('/restart/books.png')] bg-bottom bg-repeat-x bg-[length:auto_100%] opacity-95 pointer-events-none" 
      />

      {/* Hero Section - Centered with max-w-xl so it contains only the logo and intro without full screen width */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto h-auto pt-32 sm:pt-44 md:pt-64 lg:pt-72 pb-16">
        {/* "zero se karen" text */}
        <p 
          className="text-2xl sm:text-3xl md:text-4xl text-white tracking-wide -rotate-[3deg] mb-0 drop-shadow-md"
          style={{ fontFamily: "var(--font-chalkboard)" }}
        >
          zero se karen
        </p>

        {/* Logo Card */}
        <div className="relative flex items-center justify-center w-[250px] sm:w-[350px] md:w-[450px] z-10 -mt-1 sm:-mt-2 mb-0">
          <Image 
            src="/restart/logorestart.png" 
            alt="RESTART Logo" 
            width={600} 
            height={240} 
            className="w-full h-auto drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)]"
            style={{ height: 'auto' }}
            priority
          />
        </div>

        {/* "Camp for 1st year students" */}
        <p 
          className="text-xl sm:text-2xl md:text-3xl text-white tracking-wide -rotate-[2deg] -mt-1 sm:-mt-2 drop-shadow-md z-10"
          style={{ fontFamily: "var(--font-chalkboard)" }}
        >
          Camp for 1st year students
        </p>

        {/* Urdu Text */}
        <p
          className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl text-white drop-shadow-lg"
          style={{ fontFamily: "var(--font-nastaliq), 'Jameel Noori Nastaleeq', 'Urdu Typesetting', serif", lineHeight: 1.6 }}
          dir="rtl"
          lang="ur"
        >
          جلد آ رہا ہے۔۔
        </p>

        {/* Hero CTA Button (Cardboard taped sign) */}
        <div className="mt-8 z-10">
          <a
            href="#register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border-2 border-[#8b5a2e]/60 text-[#2a1405] font-chalkboard tracking-widest text-sm shadow-[4px_4px_0px_#0b1610] relative -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 font-extrabold"
            style={{ 
              backgroundImage: "url('/restart/cardboardtexture.jpg')", 
              backgroundSize: 'cover' 
            }}
          >
            {/* Tapes on corners */}
            <div className="absolute -top-2 -left-3 w-8 h-4 bg-white/20 border border-white/5 rotate-[-30deg] pointer-events-none" />
            <div className="absolute -top-2 -right-3 w-8 h-4 bg-white/20 border border-white/5 rotate-[30deg] pointer-events-none" />
            
            Register Now
            <ArrowRight className="w-4 h-4 text-[#8b5a2e] stroke-[3]" />
          </a>
        </div>
      </section>

      {/* Section 2: The "What Is It?" Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 sm:py-24">
        {/* Cardboard Texture Backdrop */}
        <div className="bg-[url('/restart/cardboardtexture.jpg')] bg-cover border-2 border-[#8b5a2e]/60 text-[#2a1608] rounded-2xl p-8 sm:p-12 shadow-[8px_8px_0px_#0b1610] relative rotate-1">
          <Pushpin />
          
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl text-[#2a1405] tracking-wide mb-6 drop-shadow-sm text-center font-bold"
            style={{ fontFamily: "var(--font-chalkboard)" }}
          >
            Wasted the whole year? Tension Nai.
          </h2>
          
          <p className="text-[#3b2314] text-base sm:text-lg leading-relaxed mb-8 text-center max-w-2xl mx-auto font-medium">
            We know the syllabus is huge and time is out. Restart Camp isn&apos;t about teaching you the whole book; it&apos;s about hacking the exam. We have gathered the top industry-expert teachers in the city to teach you only the highest-yield questions, the repeating numericals, and the exact paper presentation techniques that guarantee a passing grade.
          </p>

          <div className="border-t border-[#8b5a2e]/30 pt-8 max-w-xl mx-auto">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#5a3a1d] font-bold mb-4 text-center">What You Will Master:</h3>
            <ul className="space-y-3.5">
              {[
                "Targeted 80/20 Study Strategy.",
                "Focus on Physics, Chemistry, and Mathematics.",
                "Learn how to secure partial credit and master the MCQs."
              ].map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[#2a1608] font-bold">
                  <span className="w-5 h-5 rounded-full bg-[#8b5a2e]/20 border border-[#8b5a2e] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-3 h-3 text-[#2a1608]" />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: The Roadmap */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <h2 
          className="text-4xl sm:text-5xl text-white tracking-wide mb-12 drop-shadow-md text-center"
          style={{ fontFamily: "var(--font-chalkboard)" }}
        >
          The Survival Strategy
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "Step 1",
              title: "Isolate the Weakness.",
              desc: "One dedicated day per science subject. Come for what you need.",
              rotate: "-rotate-1"
            },
            {
              step: "Step 2",
              title: "The Expert Hack.",
              desc: "Bahawalpur's famous teachers break down past paper patterns live.",
              rotate: "rotate-1"
            },
            {
              step: "Step 3",
              title: "The Final Bypass.",
              desc: "Mastering exam psychology, time management, and anxiety control.",
              rotate: "-rotate-2"
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className={`bg-[url('/restart/cardboardtexture.jpg')] bg-cover border-2 border-[#8b5a2e]/60 text-[#2a1608] rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_#0b1610] flex flex-col hover:scale-[1.02] transition-transform relative ${item.rotate}`}
            >
              <Pushpin />
              <span className="text-xs uppercase tracking-widest text-[#8b5a2e] font-extrabold mb-2 text-center">
                {item.step}
              </span>
              <h3 
                className="text-xl sm:text-2xl font-bold mb-3 text-[#2a1405] text-center"
                style={{ fontFamily: "var(--font-chalkboard)" }}
              >
                {item.title}
              </h3>
              <p className="text-[#3b2314] text-sm leading-relaxed text-center font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: The 4-Day Schedule Matrix */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <h2 
          className="text-4xl sm:text-5xl text-white tracking-wide mb-12 drop-shadow-md text-center"
          style={{ fontFamily: "var(--font-chalkboard)" }}
        >
          The Camp Itinerary
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              day: "Day 1",
              focus: "Physics (Numericals & Long Questions)",
              venue: "Gromers Academy",
              session: "Surviving the Paper & Overcoming Anxiety.",
              featured: false,
              rotate: "-rotate-1"
            },
            {
              day: "Day 2",
              focus: "Chemistry (Equations & Organic Reactions)",
              venue: "KIPS Academy",
              session: "Academic Honesty & Student Ethics.",
              featured: false,
              rotate: "rotate-[1.5deg]"
            },
            {
              day: "Day 3",
              focus: "Mathematics (Complex Numbers, Functions, Quadratics)",
              venue: "Base / Unique Academy",
              session: "Building a Support Network.",
              featured: false,
              rotate: "-rotate-[1.5deg]"
            },
            {
              day: "Day 4",
              focus: "The Grand Finale & Secret Recipe Distribution",
              venue: "Grand Auditorium Main Hall",
              session: "Time Management & Official IJT Soft Launch.",
              featured: true,
              rotate: "rotate-[2deg]"
            }
          ].map((card, idx) => {
            if (card.featured) {
              return (
                <div 
                  key={idx} 
                  className={`bg-[#fcf8f2] border-2 border-[#a47347] text-neutral-800 rounded-2xl p-6 flex flex-col justify-between shadow-[8px_8px_0px_#0b1610] relative scale-105 transition-all z-10 ${card.rotate}`}
                >
                  <Pushpin />
                  <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-red-600 text-white text-[9px] uppercase tracking-widest font-extrabold shadow-md">
                    Closing & Secret Gift
                  </span>
                  
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#c27027]">
                      {card.day}
                    </span>
                    <h3 
                      className="text-lg sm:text-xl font-bold mt-2 mb-4 text-[#2a1405] leading-tight min-h-[50px]"
                      style={{ fontFamily: "var(--font-chalkboard)" }}
                    >
                      {card.focus}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#a47347]/20 text-xs sm:text-sm font-semibold">
                    <div className="flex items-start gap-2 text-neutral-600">
                      <MapPin className="w-4 h-4 text-[#c27027] flex-shrink-0 mt-0.5" />
                      <span>{card.venue}</span>
                    </div>
                    <div className="flex items-start gap-2 text-neutral-600">
                      <BookOpen className="w-4 h-4 text-[#c27027] flex-shrink-0 mt-0.5" />
                      <span>{card.session}</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={idx} 
                className={`bg-[url('/restart/cardboardtexture.jpg')] bg-cover border-2 border-[#8b5a2e]/60 text-[#2a1608] rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform shadow-[6px_6px_0px_#0b1610] relative ${card.rotate}`}
              >
                <Pushpin />
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#8b5a2e]">
                    {card.day}
                  </span>
                  
                  <h3 
                    className="text-lg sm:text-xl font-bold mt-2 mb-4 text-[#2a1405] leading-tight min-h-[50px]"
                    style={{ fontFamily: "var(--font-chalkboard)" }}
                  >
                    {card.focus}
                  </h3>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#8b5a2e]/30 text-xs sm:text-sm font-semibold">
                  <div className="flex items-start gap-2 text-[#3b2314]">
                    <MapPin className="w-4 h-4 text-[#8b5a2e] flex-shrink-0 mt-0.5" />
                    <span>{card.venue}</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#3b2314]">
                    <BookOpen className="w-4 h-4 text-[#8b5a2e] flex-shrink-0 mt-0.5" />
                    <span>{card.session}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 5: The "Secret Recipe" */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="bg-[url('/restart/cardboardtexture.jpg')] bg-cover border-2 border-[#8b5a2e]/60 text-[#2a1608] rounded-2xl p-8 sm:p-12 shadow-[8px_8px_0px_#0b1610] relative rotate-1 text-center">
          <Pushpin />
          
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl text-[#2a1405] tracking-wide mb-6 font-bold"
            style={{ fontFamily: "var(--font-chalkboard)" }}
          >
            Unlock &quot;Baba Ka Chamatkar&quot; (Day 4 Exclusive)
          </h2>

          <p className="text-[#3b2314] text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto font-medium">
            You cannot buy this in the market. On Day 4, every attendee unlocks the physical &quot;Secret Recipe&quot; printed guide. Crafted by Bahawalpur&apos;s elite teachers, this booklet contains the definitive guess papers and bypass methods for the 2023 National Curriculum.
          </p>

          <div className="inline-block px-5 py-3.5 rounded-xl bg-red-600 text-white text-xs sm:text-sm font-bold shadow-[3px_3px_0px_#120700] border border-[#120700]">
            Note: The printed guide and the E-Certificate are strictly reserved for students who attend the Day 4 closing ceremony.
          </div>
        </div>
      </section>

      {/* Section 6: Venues & Partners */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 
          className="text-3xl sm:text-4xl text-white tracking-wide mb-4 drop-shadow-md"
          style={{ fontFamily: "var(--font-chalkboard)" }}
        >
          Neutral Grounds. Universal Access.
        </h2>
        
        <p className="text-gray-300 text-sm sm:text-base mb-10 max-w-xl mx-auto">
          Hosted in collaboration with the city&apos;s premier educational institutes.
        </p>

        {/* Partner Grid - Mini cardboards with textures */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {["Gromers Academy", "KIPS Academy", "Base / Unique Academy"].map((partner, idx) => (
            <div 
              key={idx} 
              className={`bg-[url('/restart/cardboardtexture.jpg')] bg-cover border border-[#8b5a2e]/60 text-[#2a1608] rounded-xl p-5 shadow-[4px_4px_0px_#0b1610] flex items-center justify-center min-h-[80px] relative ${idx % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
            >
              <span className="text-[#2a1405] text-sm font-bold tracking-wider">{partner}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: FAQ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <h2 
          className="text-4xl text-white tracking-wide mb-12 drop-shadow-md text-center"
          style={{ fontFamily: "var(--font-chalkboard)" }}
        >
          FAQ
        </h2>

        <div className="space-y-6">
          {[
            {
              q: "Is this really free?",
              a: "Yes. No hidden charges. Just bring your focus.",
              rotate: "-rotate-0.5"
            },
            {
              q: "Do I have to attend all 4 days?",
              a: "You can attend the days for the subjects you are failing, but Day 4 is mandatory to receive the physical Secret Recipe notes and E-Certificate.",
              rotate: "rotate-1"
            },
            {
              q: "Do I need to be a student of these specific academies to enter?",
              a: "No. This camp is universal. Students from any college or academy in Bahawalpur are welcome.",
              rotate: "-rotate-1"
            }
          ].map((faq, idx) => (
            <div 
              key={idx} 
              className={`bg-[url('/restart/cardboardtexture.jpg')] bg-cover border-2 border-[#8b5a2e]/60 text-[#2a1608] rounded-xl p-6 sm:p-8 shadow-[6px_6px_0px_#0b1610] relative ${faq.rotate}`}
            >
              <Pushpin />
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-[#8b5a2e] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#2a1405] mb-2">{faq.q}</h3>
                  <p className="text-[#3b2314] text-sm sm:text-base leading-relaxed font-medium">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 8: Final CTA & Form */}
      <section id="register" className="relative z-10 max-w-3xl mx-auto px-6 py-16 sm:py-24 text-center">
        <h2 
          className="text-3xl sm:text-5xl text-white tracking-wide mb-8 drop-shadow-md"
          style={{ fontFamily: "var(--font-chalkboard)" }}
        >
          Apna Time Aayega. But only if you act now.
        </h2>

        {/* Large Cardboard Container for Form with texture */}
        <div className="bg-[url('/restart/cardboardtexture.jpg')] bg-cover border-2 border-[#8b5a2e]/60 p-8 sm:p-12 rounded-[32px] shadow-[10px_10px_0px_#0b1610] relative -rotate-1 mb-16">
          <Pushpin />
          <RegistrationForm />
        </div>
      </section>

      {/* Bottom Books (Top half visible) - Absolute bottom of the page, visible on both desktop and mobile, scaled up and shifted partially off-screen */}
      <div 
        className="absolute -bottom-10 sm:-bottom-14 md:-bottom-18 lg:-bottom-24 left-0 right-0 h-40 sm:h-52 md:h-64 lg:h-80 w-full -z-10 bg-[url('/restart/books.png')] bg-top bg-repeat-x bg-[length:auto_100%] opacity-95 pointer-events-none" 
      />

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-xs tracking-widest text-gray-400/60 uppercase border-t border-white/5 bg-black/10">
        <p className="mb-2">Copyright 2026 Restart Camp. Organized by Islami Jamiat e Talaba.</p>
        <p className="text-[10px] text-gray-500/40">Terms and conditions apply.</p>
      </footer>
    </main>
  );
}

// Inline Checkmark icon
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
