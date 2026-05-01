"use client";

import React, { forwardRef } from 'react';
import localFont from 'next/font/local';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';

const dreamPlanner = localFont({
  src: "../../public/dreamplanner.otf",
  display: "swap",
});

interface CertificateTemplateProps {
  name: string;
  department: string;
  id: string;
  type?: 'Appreciation' | 'Participation';
}

const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(({ name, department, id, type }, ref) => {
  const verifyUrl = `https://bwpjamiat.org/ember/certificate/verify?id=${id}`;

  return (
    <div 
      ref={ref}
      className="relative w-[1123px] h-[794px] bg-gradient-to-br from-[var(--c-navy-dark)] via-[#0a192f] to-black overflow-hidden flex flex-col items-center justify-center p-16 text-center shadow-2xl"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Outer Border */}
      <div className="absolute inset-0 border-[24px] border-[var(--c-navy-dark)] pointer-events-none z-50"></div>
      <div className="absolute inset-0 border-[32px] border-[var(--c-orange)] pointer-events-none z-40 opacity-90"></div>
      
      {/* Background Ornaments */}
      <div className="absolute top-[-150px] right-[-150px] w-[500px] h-[500px] border-[60px] border-[var(--c-accent)]/5 rounded-full rotate-45" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] border-[60px] border-[var(--c-accent)]/5 rounded-full -rotate-45" />
      
      {/* Inner Elegant Border */}
      <div className="relative z-10 w-full h-full border-2 border-[var(--c-accent)]/30 p-12 flex flex-col items-center justify-between bg-black/20 backdrop-blur-sm shadow-inner">
        
        {/* Header Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <img
            src="/logoinnovista.png"
            alt="Innovista"
            className="h-20 w-auto object-contain"
          />
          <h2 className={`${dreamPlanner.className} text-[var(--c-accent)] text-3xl tracking-[0.3em] uppercase mt-2`}>
            EMBER'26 BAHAWALPUR
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-6">
          <h1 className={`${dreamPlanner.className} text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 text-7xl tracking-[0.15em] mb-2 drop-shadow-2xl`}>
            CERTIFICATE
          </h1>
          <h3 className={`${dreamPlanner.className} text-[var(--c-orange)] text-2xl tracking-[0.25em] uppercase drop-shadow-md`}>
            OF {type === 'Participation' ? 'PARTICIPATION' : 'APPRECIATION'}
          </h3>
          
          <div className="w-64 h-[2px] bg-gradient-to-r from-transparent via-[var(--c-accent)]/50 to-transparent my-6" />

          <p className="text-white/70 text-xl font-light tracking-widest uppercase text-sm mb-2">
            This is proudly presented to
          </p>
          
          <h2 className={`${dreamPlanner.className} text-white text-8xl my-6 [text-shadow:0_4px_20px_rgba(235,110,48,0.4)]`}>
            {name.toUpperCase()}
          </h2>

          <p className="text-white/60 text-xl font-medium tracking-wide max-w-2xl leading-relaxed">
            {type === 'Participation' ? (
              <>
                for their active involvement and successful completion of the <br/>
                challenges at South Punjab's First Teen Hackathon.
              </>
            ) : (
              <>
                for their exceptional contribution and dedicated service as part of the <br/>
                <span className="text-[var(--c-accent)] font-bold uppercase">{department}</span> department <br/>
                during South Punjab's First Teen Hackathon.
              </>
            )}
          </p>
        </div>

        {/* Footer Section */}
        <div className="w-full flex justify-between items-end px-10">
          {/* Verification QR */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <QRCodeSVG value={verifyUrl} size={100} level="H" />
            </div>
            <p className="text-[10px] text-white/40 font-bold tracking-tighter">
              SCAN TO VERIFY <br/> ID: {id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Signatures */}
          <div className="flex gap-20">
            <div className="flex flex-col items-center gap-2">
               <div className="w-48 h-[1px] bg-white/30" />
               <p className={`${dreamPlanner.className} text-white text-lg tracking-widest`}>ROHAN GHALIB</p>
               <p className="text-[10px] text-[var(--c-accent)] font-bold uppercase tracking-widest">President Ember'26</p>
            </div>
            <div className="flex flex-col items-center gap-2">
               <div className="w-48 h-[1px] bg-white/30" />
               <p className={`${dreamPlanner.className} text-white text-lg tracking-widest`}>TEAM INNOVISTA</p>
               <p className="text-[10px] text-[var(--c-accent)] font-bold uppercase tracking-widest">Organizing Committee</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;
