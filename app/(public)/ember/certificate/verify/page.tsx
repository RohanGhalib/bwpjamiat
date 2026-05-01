"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import localFont from 'next/font/local';
import Link from 'next/link';
import { Suspense } from 'react';

const dreamPlanner = localFont({
  src: "../../../../../public/dreamplanner.otf",
  display: "swap",
});

function VerifyContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [certData, setCertData] = useState<any>(null);

  useEffect(() => {
    async function verify() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'certificate_requests', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCertData(docSnap.data());
        }
      } catch (error) {
        console.error("Verification error:", error);
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-16 h-16 border-4 border-[var(--c-accent)] border-t-transparent rounded-full animate-spin" />
        <p className={`${dreamPlanner.className} text-white text-2xl tracking-widest`}>VERIFYING AUTHENTICITY...</p>
      </div>
    );
  }

  if (!id || !certData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-24 h-24 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className={`${dreamPlanner.className} text-white text-5xl mb-4`}>VERIFICATION FAILED</h1>
        <p className="text-white/40 text-lg max-w-md">This certificate record could not be found or the ID is invalid.</p>
        <Link href="/ember" className="mt-12 text-[var(--c-accent)] hover:underline font-bold uppercase tracking-widest">Back to Ember Home</Link>
      </div>
    );
  }

  if (certData.status === 'rejected' || certData.status === 'blocked') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-fade-up">
        <div className="w-32 h-32 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(220,38,38,0.3)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-16 h-16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className={`${dreamPlanner.className} text-white text-5xl md:text-7xl mb-4 [text-shadow:4px_4px_0_#000]`}>CERTIFICATE REVOKED</h1>
        <p className="text-red-400 text-lg max-w-md font-bold uppercase tracking-widest border border-red-500/30 bg-red-500/10 px-6 py-3 rounded-full">
          This credential has been invalidated by administration.
        </p>
        <p className="text-white/40 mt-6 text-sm max-w-sm italic">
          If you believe this is an error, please contact the organizing committee.
        </p>
        <Link href="/ember" className="mt-12 text-[var(--c-accent)] hover:underline font-bold uppercase tracking-widest">Back to Ember Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 animate-fade-up">
      {/* Success Badge */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-32 h-32 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-16 h-16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className={`${dreamPlanner.className} text-white text-5xl md:text-7xl mb-4 [text-shadow:4px_4px_0_#000]`}>
          CERTIFICATE VERIFIED
        </h1>
        <p className={`${dreamPlanner.className} text-[var(--c-accent)] text-2xl tracking-[0.2em] uppercase`}>
          Authentic Ember'26 Credential
        </p>
      </div>

      {/* Details Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <img src="/logoinnovista.png" alt="" className="w-32" />
        </div>
        
        <div className="space-y-10">
          <div>
            <label className="text-[var(--c-accent)] text-[10px] font-black uppercase tracking-[0.3em] block mb-2">ISSUED TO</label>
            <p className={`${dreamPlanner.className} text-white text-4xl md:text-5xl`}>{certData.name}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="text-[var(--c-accent)] text-[10px] font-black uppercase tracking-[0.3em] block mb-2">DEPARTMENT</label>
              <p className={`${dreamPlanner.className} text-white text-2xl`}>{certData.department}</p>
            </div>
            <div>
              <label className="text-[var(--c-accent)] text-[10px] font-black uppercase tracking-[0.3em] block mb-2">EVENT</label>
              <p className={`${dreamPlanner.className} text-white text-2xl`}>EMBER'26</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6">
            <div>
              <label className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] block mb-1">CERTIFICATE ID</label>
              <p className="text-white/40 font-mono text-xs">{id.toUpperCase()}</p>
            </div>
            <div>
              <label className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] block mb-1">ISSUED DATE</label>
              <p className="text-white/40 font-mono text-xs">{new Date(certData.requestedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* External Verification Button */}
      <div className="flex flex-col items-center gap-6">
        <p className="text-white/40 text-sm text-center max-w-sm italic">
          Businesses or Universities requiring official direct verification from Ember'26 Organizing Committee can request a formal confirmation.
        </p>
        <a 
          href={`mailto:verify@bwpjamiat.org?subject=Official Verification Request - ${id}&body=I would like to request official verification for certificate ID: ${id} issued to ${certData.name}.`}
          className={`${dreamPlanner.className} bg-white text-[var(--c-navy-dark)] px-12 py-5 rounded-full text-2xl hover:bg-[var(--c-orange)] hover:text-white transition-all shadow-2xl hover:scale-105 flex items-center gap-3`}
        >
          REQUEST OFFICIAL VERIFICATION
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <main className="relative min-h-screen bg-[var(--c-navy-dark)] overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--c-orange)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[var(--c-accent)]/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 pt-32">
        <Suspense fallback={
          <div className="flex justify-center items-center py-40">
            <div className="w-12 h-12 border-4 border-[var(--c-accent)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <VerifyContent />
        </Suspense>
      </div>
    </main>
  );
}
