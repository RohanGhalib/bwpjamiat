import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Aghaz For Medicos | IJT Bahawalpur",
  description:
    "Aghaz For Medicos: a refined launch experience for medical students guided by purpose, character, and service.",
  keywords: ["Aghaz", "Medicos", "IJT Bahawalpur", "Medical students", "Student movement"],
};

export default function AghazPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1a0e08] text-[#f6e7c8] selection:bg-[#E5B871] selection:text-[#1a0e08]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center scale-105"
        />
      </div>

      {/* Layered atmospheric overlays — cream halo top, oxblood depth bottom */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_8%,rgba(255,236,196,0.55),rgba(168,98,46,0.18)_38%,rgba(40,18,10,0.78)_82%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,244,220,0.05)_0%,rgba(96,46,22,0.25)_45%,rgba(22,10,5,0.7)_100%)]" />

      {/* Saffron glow — soft top spotlight */}
      <div className="pointer-events-none absolute left-1/2 top-[-8rem] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-[#f4c97a]/30 blur-[130px]" />

      {/* Emerald accent glow — bottom anchor */}
      <div className="pointer-events-none absolute right-[-10rem] bottom-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#1f5c4f]/35 blur-[140px]" />
      <div className="pointer-events-none absolute left-[-8rem] bottom-[-8rem] h-[26rem] w-[26rem] rounded-full bg-[#7a3a1e]/40 blur-[120px]" />

      {/* Conic shimmer — subtle */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[-15%] h-[120%] opacity-50 mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 110deg at 50% 0%, rgba(255,228,170,0.28), rgba(255,228,170,0) 24%, rgba(231,178,108,0.18) 38%, rgba(231,178,108,0) 56%, rgba(212,142,72,0.14) 76%, rgba(212,142,72,0) 100%)",
          filter: "blur(20px)",
        }}
      />

      {/* Faint star/grain texture via SVG noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.65'/></svg>\")",
        }}
      />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-24 sm:px-8">
        <div className="animate-page-reveal mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          {/* Top eyebrow — small bilingual mark */}
          <div className="mb-7 flex items-center gap-3 rounded-full border border-[#e5b871]/30 bg-[#1a0e08]/40 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[#f0c876]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#f0c876]">
              IJT Bahawalpur Presents
            </span>
          </div>

          {/* Arabic display calligraphy — sets cultural tone above the logo */}
          <p
            className="mb-2 text-3xl text-[#f4d49a]/85 sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-amiri), serif", letterSpacing: "0.02em" }}
            dir="rtl"
            lang="ar"
          >
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْم
          </p>

          {/* Logo with warm gold glow instead of harsh drop-shadow */}
          <div className="relative mt-2">
            <div className="absolute inset-0 -z-10 scale-90 rounded-full bg-[#f0c876]/25 blur-3xl" />
            <Image
              src="/logoaghaz.png"
              alt="Aghaz for Medicos"
              width={620}
              height={340}
              priority
              className="w-[280px] drop-shadow-[0_18px_40px_rgba(231,178,108,0.35)] sm:w-[400px] md:w-[500px]"
            />
          </div>

          {/* Ornamental separator */}
          <div className="mt-6 flex items-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#e5b871]/60" />
            <span className="text-[#e5b871]">◈</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#e5b871]/60" />
          </div>

          {/* Tagline — Urdu + English layered */}
          <p
            className="mt-6 max-w-2xl text-xl text-[#fce8c2] sm:text-2xl"
            style={{ fontFamily: "var(--font-nastaliq), serif", lineHeight: 2 }}
            dir="rtl"
            lang="ur"
          >
            مقصد، کردار اور خدمت کا نیا آغاز
          </p>
          <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-[#f6e7c8]/70 sm:text-base">
            A refined launch experience for medical students — guided by purpose, shaped by character, devoted to service.
          </p>

          {/* Glass panel with double-border ornament + CTAs */}
          <div className="relative mt-10 w-full max-w-2xl">
            {/* outer ornamental gold ring */}
            <div className="absolute -inset-1 rounded-[2.25rem] bg-gradient-to-br from-[#e5b871]/55 via-[#8b5a2e]/20 to-[#e5b871]/40 blur-[1px]" />
            <div className="relative rounded-[2rem] border border-[#e5b871]/40 bg-gradient-to-br from-[#2a160b]/80 via-[#1f0f07]/85 to-[#2a160b]/80 px-6 py-7 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:px-10 sm:py-9">
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#f0c876] via-[#d99a4f] to-[#a56327] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#1a0e08] shadow-[0_12px_30px_-8px_rgba(217,154,79,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-8px_rgba(217,154,79,0.85)] sm:w-auto"
                >
                  Stay Connected
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/events"
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#e5b871]/40 bg-[#e5b871]/5 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#f0c876] backdrop-blur-md transition-all duration-300 hover:border-[#e5b871]/70 hover:bg-[#e5b871]/12 sm:w-auto"
                >
                  Upcoming Updates
                </Link>
              </div>
            </div>
          </div>

          {/* Reveal note */}
          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#e5b871]/75">
            <span className="inline-block h-1 w-1 rounded-full bg-[#e5b871] align-middle" />
            <span className="ml-3 align-middle">More event details will be revealed soon</span>
            <span className="ml-3 inline-block h-1 w-1 rounded-full bg-[#e5b871] align-middle" />
          </p>
        </div>
      </section>
    </main>
  );
}
