"use client";

import React, { forwardRef } from 'react';
import localFont from 'next/font/local';
import { QRCodeSVG } from 'qrcode.react';

const dreamPlanner = localFont({
  src: "../../public/dreamplanner.otf",
  display: "swap",
});

interface CertificateTemplateProps {
  name: string;
  department: string;
  role?: string;
  gender?: 'boy' | 'girl';
  id: string;
  type?: 'Appreciation' | 'Participation';
}

const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(({ name, department, role, gender, id, type }, ref) => {
  const verifyUrl = `https://bwpjamiat.org/ember/verify?id=${id}`;

  // Gender-based pronoun
  const pronoun = gender === 'boy' ? 'his' : gender === 'girl' ? 'her' : 'his/her';
  const position = role || 'Member';

  return (
    <div
      ref={ref}
      className="relative w-[1123px] h-[794px] bg-[#0a192f] overflow-hidden flex flex-col items-center justify-center p-4 pt-2 pb-12 text-center gap-2"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Background Image: Matching Hero Section exactly */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/emberbackground.jpg"
          alt=""
          className="w-full h-full object-cover blur-[8px] scale-105 opacity-60"
        />
        {/* Subtle gradient matching hero */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a192f]/20 to-[#0a192f]" />
      </div>

      {/* Background Ornament: Noor Mahal Vector (Very Subtle) */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.15] flex items-end justify-center overflow-hidden">
        <img src="/noor.png" alt="" className="w-full h-auto object-contain translate-y-40 scale-125 mix-blend-screen" />
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-6 border-[1px] border-white/10 z-20 pointer-events-none"></div>

      {/* Header: Logo Arrangement like Hero Section */}
      <div className="relative z-0 flex flex-col items-center pt-0">
        <div className="flex items-center gap-2 mb-1">
          <img src="/logoinnovista.png" alt="Innovista" className="h-30 w-auto object-contain" />
          <div className="w-[1px] h-12 bg-white/20" />
          <img src="/logotechzone.webp" alt="Jamiat" className="h-30 w-auto object-contain" />
        </div>

        <h1 className={`${dreamPlanner.className} text-white text-6xl leading-none tracking-tighter [text-shadow:10px_10px_0_#000]`}>
          EMBER'26
        </h1>
        <h2 className={`${dreamPlanner.className} text-[var(--c-accent)] text-2xl tracking-[0.1em] mt-0 [text-shadow:4px_4px_0_#000]`}>
          BAHAWALPUR
        </h2>
      </div>

      {/* Main Content */}
      <div className="relative z-30 flex flex-col items-center max-w-4xl">
        <h1 className={`${dreamPlanner.className} text-white text-4xl tracking-[0.2em] mb-0 [text-shadow:4px_4px_0_#000]`}>
          CERTIFICATE
        </h1>
        <div className="h-[2px] w-64 bg-gradient-to-r from-transparent via-[var(--c-orange)] to-transparent mb-1" />

        <p className="text-white/60 text-lg uppercase tracking-[0.2em] font-medium mb-1">
          This certificate is proudly awarded to
        </p>

        <h2 className={`${dreamPlanner.className} text-white text-5xl mb-1 px-10 pb-1 [text-shadow:0_0_30px_rgba(235,110,48,0.5)]`}>
          {name.toUpperCase()}
        </h2>

        <p className="text-white/80 text-2xl leading-relaxed max-w-3xl font-medium">
          for {pronoun} exceptional services as <span className="text-[var(--c-accent)] font-bold">{position}</span> in <br />
          <span className="text-white font-bold uppercase">{department} Department</span> at <span className="font-bold">Ember'26</span>, <br />
          South Punjab's largest hackathon for teenagers.
        </p>
      </div>

      {/* Footer Section */}
      <div className="relative z-30 w-full flex justify-between items-end px-12 mt-4">
        {/* Verification QR */}
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
          <div className="bg-white p-1 rounded-lg">
            <QRCodeSVG value={verifyUrl} size={80} level="H" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-[var(--c-accent)] tracking-widest uppercase mb-1">Authentic Credential</p>
            <p className="text-[8px] font-mono text-white/40 uppercase tracking-tighter">ID: {id.toUpperCase()}</p>
            <p className="text-[7px] text-white/20 font-bold mt-1">bwpjamiat.org/ember/verify</p>
          </div>
        </div>

        {/* Signature */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <svg width="200" height="70" viewBox="0 0 180 60" className="text-white">
              <path
                d="M20 45 C 30 35, 45 15, 55 25 C 65 35, 50 50, 70 45 C 90 40, 110 20, 120 25 C 130 30, 120 50, 140 45 C 160 40, 170 20, 175 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="w-56 h-[1px] bg-white/20 mt-[-10px]" />
          </div>
          <p className={`${dreamPlanner.className} text-white text-2xl`}>ROHAN GHALIB</p>
          <p className="text-[10px] text-[var(--c-accent)] font-bold uppercase tracking-widest">President Ember'26</p>
        </div>
      </div>
    </div>
  );
});

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;
