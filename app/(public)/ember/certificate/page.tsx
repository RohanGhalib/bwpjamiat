"use client";

import { useEffect, useState, useRef } from 'react';
import localFont from 'next/font/local';
import Link from 'next/link';
import toast from 'react-hot-toast';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import CertificateTemplate from '@/components/ember/CertificateTemplate';

const dreamPlanner = localFont({
  src: "../../../../public/dreamplanner.otf",
  display: "swap",
});

interface TeamMember {
  id: string;
  name: string;
  department: string;
  role?: string;
  gender?: 'boy' | 'girl';
  phoneHint?: string; // New field for the hint
}

type Step = 'search' | 'verify_phone' | 'verify_otp' | 'generating' | 'success' | 'already_generated';

export default function EmberCertificatePage() {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<Step>('search');

  const [searchResults, setSearchResults] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userInputPhone, setUserInputPhone] = useState('');
  const [userInputOtp, setUserInputOtp] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [generatedCertId, setGeneratedCertId] = useState('');
  const [existingCertDate, setExistingCertDate] = useState('');

  // 1. Secure Fuzzy Search Logic (Server-side)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 3) {
        setLoading(true);
        try {
          // The API now performs fuzzy substring matching on the server
          const res = await fetch(`/api/ember/search?q=${encodeURIComponent(searchTerm)}`);
          const data = await res.json();
          setSearchResults(data.results || []);
          setIsDropdownOpen(true);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
        setIsDropdownOpen(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleNameSelect = (member: TeamMember) => {
    setSelectedMember(member);
    setSearchTerm(member.name);
    setIsDropdownOpen(false);

    setSubmitting(true);
    setTimeout(() => {
      setStep('verify_phone');
      setSubmitting(false);
    }, 800);
  };

  // 2. Blind Identity Verification (Server-side)
  const handlePhoneVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/ember/verify-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: selectedMember.id, phone: userInputPhone })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Verification failed.");
        return;
      }

      if (data.already_generated) {
        setGeneratedCertId(data.certificateId);
        setExistingCertDate(data.date);
        setSelectedMember(data.member);
        setStep('already_generated');
      } else {
        setMaskedEmail(data.maskedEmail);
        setStep('verify_otp');
        toast.success("Verification code sent!");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // 3. OTP Validation & Record Creation
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/ember/validate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: selectedMember?.id, otp: userInputOtp })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Invalid OTP.");
        return;
      }

      setGeneratedCertId(data.certificateId);
      setSelectedMember(data.member);

      // Trigger PDF Generation
      await generatePDF(data.certificateId, data.member);
    } catch (error) {
      toast.error("Failed to validate code.");
    } finally {
      setSubmitting(false);
    }
  };

  const generatePDF = async (certId: string, member: TeamMember) => {
    setStep('generating');
    const toastId = toast.loading("Forging high-resolution credential...");

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!certificateRef.current) throw new Error("Template ref missing");

      const dataUrl = await htmlToImage.toPng(certificateRef.current, {
        quality: 1.0,
        pixelRatio: 3,
      });

      const pdf = new jsPDF('landscape', 'mm', 'a4');
      pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210);
      pdf.save(`Ember_Certificate_${member.name.replace(/\s+/g, '_')}.pdf`);

      toast.success("Certificate generated successfully!", { id: toastId });
      setStep('success');
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate PDF. You can try manual download below.", { id: toastId });
      setStep('success');
    }
  };

  const handleManualDownload = async () => {
    if (!selectedMember || !certificateRef.current) return;
    const toastId = toast.loading("Downloading certificate...");
    try {
      const dataUrl = await htmlToImage.toPng(certificateRef.current, {
        quality: 1.0,
        pixelRatio: 3,
      });
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210);
      pdf.save(`Ember_Certificate_${selectedMember.name.replace(/\s+/g, '_')}.pdf`);
      toast.success("Downloaded!", { id: toastId });
    } catch (error) {
      toast.error("Download failed. Try again.", { id: toastId });
    }
  };

  const resetFlow = () => {
    setStep('search');
    setSelectedMember(null);
    setSearchTerm('');
    setUserInputPhone('');
    setUserInputOtp('');
    setGeneratedCertId('');
    setMaskedEmail('');
    setExistingCertDate('');
    setSearchResults([]);
  };

  return (
    <main className="relative min-h-screen bg-[var(--c-navy-dark)] overflow-hidden font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--c-orange)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[var(--c-accent)]/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-16 animate-fade-up">
          <Link href="/ember" className={`${dreamPlanner.className} text-[var(--c-accent)] hover:text-white transition-colors text-xl tracking-widest flex items-center justify-center gap-2 mb-8 group`}>
            <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO EMBER
          </Link>
          <h1 className={`${dreamPlanner.className} text-white text-5xl md:text-7xl leading-tight mb-4 [text-shadow:4px_4px_0_#000]`}>
            {step === 'success' ? "CONGRATULATIONS!" : "GET YOUR CERTIFICATE"}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto uppercase tracking-widest">
            {step === 'success' ? "Your official credential is ready" : "Secure automated verification system"}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-fade-up min-h-[400px] flex flex-col justify-center">

          {step === 'search' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2 relative">
                <div className="flex justify-between items-end mb-2">
                  <label className={`${dreamPlanner.className} block text-[var(--c-accent)] text-2xl tracking-wider ml-2`}>SEARCH YOUR NAME</label>
                  {loading && <div className="w-5 h-5 border-2 border-[var(--c-orange)] border-t-transparent rounded-full animate-spin mb-2" />}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type any part of your name..."
                    value={searchTerm}
                    disabled={submitting}
                    onChange={e => setSearchTerm(e.target.value)}
                    onFocus={() => { if (searchResults.length > 0) setIsDropdownOpen(true); }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xl placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--c-orange)] transition-all"
                  />

                  {isDropdownOpen && searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-[#0a192f] border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden">
                      {searchResults.map(member => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => handleNameSelect(member)}
                          className="w-full text-left px-6 py-4 hover:bg-white/10 text-white transition-colors border-b border-white/5 last:border-0 group"
                        >
                          <div className="font-bold text-lg group-hover:text-[var(--c-orange)] transition-colors">{member.name}</div>
                          <div className="text-xs text-[var(--c-accent)] font-medium tracking-widest">{member.department.toUpperCase()}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchTerm.length >= 3 && !loading && searchResults.length === 0 && isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-[#0a192f] border border-white/10 rounded-2xl p-6 text-white/40 italic">
                      No results found. Please check your spelling.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'verify_phone' && selectedMember && (
            <form onSubmit={handlePhoneVerify} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-[var(--c-orange)]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--c-orange)]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
                </div>
                <h2 className={`${dreamPlanner.className} text-white text-3xl tracking-widest`}>VERIFY YOUR IDENTITY</h2>
                <p className="text-white/60 text-lg">
                  Please enter the phone number registered for <span className="text-white font-bold">{selectedMember.name}</span>.
                </p>
                {selectedMember.phoneHint && (
                  <div className="bg-white/5 py-3 px-6 rounded-xl inline-block border border-white/10">
                    <p className="text-[var(--c-accent)] font-mono text-xl tracking-widest">
                      ENDING WITH: <span className="text-white font-bold">{selectedMember.phoneHint}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  autoFocus
                  placeholder="03XX XXXXXXX"
                  value={userInputPhone}
                  onChange={e => setUserInputPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-center text-2xl tracking-[0.2em] placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--c-orange)] transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button type="button" onClick={resetFlow} className={`${dreamPlanner.className} px-8 py-4 bg-white/5 text-white/60 rounded-2xl text-xl tracking-widest hover:bg-white/10 transition-all`}>
                  WRONG NAME?
                </button>
                <button type="submit" disabled={submitting || userInputPhone.length < 10} className={`${dreamPlanner.className} px-12 py-4 bg-[var(--c-orange)] text-white rounded-2xl text-2xl tracking-widest hover:bg-[var(--c-accent)] transition-all disabled:opacity-50 shadow-xl`}>
                  {submitting ? "VERIFYING..." : "PROCEED"}
                </button>
              </div>
            </form>
          )}

          {step === 'verify_otp' && selectedMember && (
            <form onSubmit={handleOtpVerify} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </div>
                <h2 className={`${dreamPlanner.className} text-white text-3xl tracking-widest`}>ENTER CODE</h2>
                <p className="text-white/60 text-lg">
                  Verification code sent to: <br />
                  <span className="text-[var(--c-accent)] font-bold">{maskedEmail}</span>
                </p>
              </div>

              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  autoFocus
                  maxLength={6}
                  placeholder="000000"
                  value={userInputOtp}
                  onChange={e => setUserInputOtp(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-center text-4xl font-bold tracking-[0.4em] placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--c-orange)] transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button type="button" onClick={() => setStep('verify_phone')} className={`${dreamPlanner.className} px-8 py-4 bg-white/5 text-white/60 rounded-2xl text-xl tracking-widest hover:bg-white/10 transition-all`}>
                  BACK
                </button>
                <button type="submit" disabled={submitting || userInputOtp.length !== 6} className={`${dreamPlanner.className} px-12 py-4 bg-green-600 text-white rounded-2xl text-2xl tracking-widest hover:bg-green-700 transition-all disabled:opacity-50 shadow-xl`}>
                  {submitting ? "VALIDATING..." : "GENERATE NOW"}
                </button>
              </div>
            </form>
          )}

          {step === 'already_generated' && selectedMember && (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700 text-center py-6">
              <div className="w-24 h-24 bg-[var(--c-orange)]/20 text-[var(--c-orange)] rounded-full flex items-center justify-center mx-auto shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
              </div>
              <div className="space-y-4">
                <h2 className={`${dreamPlanner.className} text-white text-4xl tracking-widest`}>ALREADY ISSUED</h2>
                <p className="text-white/60 text-lg max-w-lg mx-auto">
                  A certificate for <span className="text-white font-bold">{selectedMember.name}</span> was already generated on <span className="text-[var(--c-accent)] font-bold">{new Date(existingCertDate).toLocaleDateString()}</span>.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={resetFlow} className={`${dreamPlanner.className} px-8 py-4 bg-white/5 text-white/60 rounded-2xl text-xl tracking-widest hover:bg-white/10 transition-all`}>
                  CANCEL
                </button>
                <button
                  onClick={() => generatePDF(generatedCertId, selectedMember)}
                  className={`${dreamPlanner.className} px-12 py-4 bg-[var(--c-orange)] text-white rounded-2xl text-2xl tracking-widest hover:bg-[var(--c-accent)] transition-all shadow-xl`}
                >
                  RE-DOWNLOAD CERTIFICATE
                </button>
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-1000 py-10">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-white/10 border-t-[var(--c-orange)] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white/20 animate-pulse"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </div>
              </div>
              <div className="text-center space-y-4">
                <h2 className={`${dreamPlanner.className} text-white text-4xl tracking-widest animate-pulse`}>FORGING YOUR CREDENTIAL</h2>
                <p className="text-white/60 text-lg max-sm mx-auto">Our systems are rendering your high-resolution participation record. Please do not close this window.</p>
              </div>
            </div>
          )}

          {step === 'success' && selectedMember && (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700 text-center py-6">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>

              <div className="space-y-4">
                <h2 className={`${dreamPlanner.className} text-white text-4xl tracking-widest`}>CERTIFICATE GENERATED!</h2>
                <p className="text-white/60 text-lg max-w-lg mx-auto">
                  Your official Ember'26 certificate has been downloaded. You can verify it using the details below.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8 bg-black/40 p-8 rounded-[2rem] border border-white/10 items-center">
                <div className="space-y-4 text-left">
                  <h4 className={`${dreamPlanner.className} text-[var(--c-accent)] text-xl tracking-widest`}>VERIFICATION LINK</h4>
                  <p className="text-white/80 font-mono text-sm break-all bg-white/5 p-4 rounded-xl border border-white/5">
                    bwpjamiat.org/ember/verify?id={generatedCertId}
                  </p>
                  <Link
                    href={`/ember/verify?id=${generatedCertId}`}
                    className="inline-block text-[var(--c-orange)] font-bold hover:underline"
                  >
                    VISIT VERIFICATION PAGE →
                  </Link>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white p-3 rounded-2xl">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://bwpjamiat.org/ember/verify?id=${generatedCertId}`} alt="Verification QR" className="w-32 h-32" />
                  </div>
                  <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">Scan to Verify Authenticity</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleManualDownload}
                  className="text-[var(--c-accent)] font-bold text-sm hover:underline flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  Didn't download? Click here to download manually
                </button>
              </div>

              <button
                onClick={resetFlow}
                className={`${dreamPlanner.className} px-12 py-5 bg-white/5 text-white/60 rounded-2xl text-xl tracking-widest hover:bg-white/10 transition-all`}
              >
                GENERATE ANOTHER?
              </button>
            </div>
          )}
        </div>

        <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none">
          {selectedMember && (
            <CertificateTemplate
              ref={certificateRef}
              name={selectedMember.name}
              department={selectedMember.department}
              role={selectedMember.role}
              gender={selectedMember.gender}
              id={generatedCertId || selectedMember.id}
              type={selectedMember.department === 'Participant' ? 'Participation' : 'Appreciation'}
            />
          )}
        </div>

        {step !== 'success' && (
          <div className="mt-12 text-center">
            <p className="text-white/20 text-xs italic">
              Official Ember'26 Credentialing System &bull; An Event By <a href="https://rohanghalib.com">Rohan Ghalib</a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
