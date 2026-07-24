"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Send, Download, Share2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import QRCode from "qrcode";

export default function QuranClubJoinPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    whatsapp: "",
    email: "",
    dob: "",
    address: "",
    college: "",
    degree: "",
    motivation: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [passId, setPassId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.firstName || !formData.lastName || !formData.whatsapp || !formData.email || !formData.college || !formData.degree) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/quran-club/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          occupation: "Student",
          interest: "Weekly Quran Tafseer Classes", // Default backend compatibility
          membershipFeeAccepted: true,
          committed: true
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setPassId(data.passId);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while submitting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Client-side canvas card generation and download
  const handleDownloadCard = async () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 800, 480);
      grad.addColorStop(0, "#4A0817"); 
      grad.addColorStop(1, "#120205"); 
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 480);

      // 2. Outlined border
      ctx.strokeStyle = "#A81829";
      ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, 788, 468);

      // 3. Load Brand Logos Concurrently
      const logoImg = new window.Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.src = "/quranclub/logoquranclub.png";

      const ijtLogoImg = new window.Image();
      ijtLogoImg.crossOrigin = "anonymous";
      ijtLogoImg.src = "/logo.png";

      await Promise.all([
        new Promise((resolve) => { logoImg.onload = resolve; logoImg.onerror = resolve; }),
        new Promise((resolve) => { ijtLogoImg.onload = resolve; ijtLogoImg.onerror = resolve; })
      ]);

      // Draw IJT logo in top-left area
      if (ijtLogoImg.complete && ijtLogoImg.naturalWidth > 0) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.arc(70, 75, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.drawImage(ijtLogoImg, 50, 55, 40, 40);
      }

      // Draw Quran Club logo centered
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, 240, 30, 320, 110);
      }

      // Decorative divider line
      ctx.fillStyle = "#A81829";
      ctx.fillRect(50, 155, 700, 2);

      // 4. Texts
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 20px sans-serif";
      ctx.fillText("MEMBER ACCESS CARD", 50, 200);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(`${formData.firstName} ${formData.lastName}`, 50, 255);

      ctx.fillStyle = "#F87171";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(`MEMBER ID: ${passId}`, 50, 305);

      ctx.fillStyle = "#E2E8F0";
      ctx.font = "16px sans-serif";
      ctx.fillText(`STUDY MAJOR: ${formData.degree}`, 50, 355);
      ctx.fillText(`COLLEGE: ${formData.college}`, 50, 395);

      // 5. QR Code Generation
      const qrUrl = `https://bwpjamiat.org/verify/quran-club/${passId}`;
      const qrDataUrl = await QRCode.toDataURL(qrUrl, {
        margin: 1,
        width: 140,
        color: { dark: "#FFFFFF", light: "#120205" }
      });

      const qrImg = new window.Image();
      qrImg.src = qrDataUrl;
      await new Promise((resolve) => {
        qrImg.onload = resolve;
      });

      ctx.drawImage(qrImg, 600, 200, 140, 140);

      // 6. Trigger Download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `quran_club_card_${passId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error drawing membership card canvas", err);
    }
  };

  const handleShareCard = async () => {
    const shareUrl = `https://bwpjamiat.org/verify/quran-club/${passId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Quran Club Membership Card",
          text: `Alhamdulillah! I joined the Quran Club. Check my verification here:`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Canceled share", err);
      }
    } else {
      // Fallback: Copy to Clipboard
      navigator.clipboard.writeText(shareUrl);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#09041b] text-white py-16 px-4 flex flex-col items-center justify-center font-sans relative overflow-hidden">
        {/* Background Graphic Texture (Landing Page Theme) */}
        <div className="absolute inset-0 -z-10 w-full h-full opacity-20 pointer-events-none">
          <Image
            src="/quranclub/bgquranclub.png"
            alt="Quran Club Background"
            fill
            className="object-cover object-center"
          />
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 -z-10 bg-black/40 pointer-events-none" />

        <div className="w-full max-w-2xl bg-gradient-to-b from-[#3D0613]/85 via-[#27040C]/90 to-[#150207]/95 border-2 border-[#A81829]/40 rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col items-center backdrop-blur-xl animate-page-reveal relative">
          
          {/* Success Icon */}
          <div className="w-14 h-14 bg-red-950/50 border border-red-500/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-red-400 animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-black text-white text-center tracking-tight mb-2 uppercase">
            Welcome to Quran Club!
          </h2>

          {/* Quranic Ayah about Guidance */}
          <div className="w-full max-w-lg mb-8 p-5 rounded-2xl bg-black/45 border border-[#A81829]/30 text-center shadow-lg">
            <p className="text-red-300 font-serif text-lg sm:text-2xl font-bold mb-2 leading-relaxed" dir="rtl">
              يَهْدِي مَن يَشَاءُ إِلَىٰ صِرَاطٍ مُّسْتَقِيمٍ
            </p>
            <p 
              className="text-red-100/90 text-base sm:text-lg leading-relaxed font-semibold"
              style={{ fontFamily: "var(--font-nastaliq)" }}
              dir="rtl"
            >
              &quot;اور اللہ جسے چاہتا ہے سیدھے راستے کی طرف ہدایت دیتا ہے۔&quot;
            </p>
            <span className="text-red-400/80 text-xs font-bold block mt-2.5 uppercase tracking-wider">[Surah Al-Baqarah 2:213]</span>
          </div>

          {/* High Quality Membership Card Preview */}
          <div className="relative w-full max-w-lg aspect-[1.66/1] rounded-3xl bg-gradient-to-br from-[#4A0817] via-[#2A050E] to-[#120205] border-4 border-[#A81829] shadow-[0_20px_50px_rgba(168,24,41,0.4)] hover:shadow-[0_25px_60px_rgba(168,24,41,0.6)] transition-all duration-500 p-5 overflow-hidden flex flex-col justify-between select-none mb-8">
            {/* Card Gloss Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none z-10" />

            {/* Top Brand & Organizer Logos */}
            <div className="flex justify-between items-center w-full px-2 mt-1 relative z-20">
              {/* IJT Organizer Logo */}
              <div className="relative w-8 h-8 flex items-center justify-center bg-white/10 rounded-full p-1 border border-white/20 shadow-inner shrink-0">
                <img
                  src="/logo.png"
                  alt="IJT Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Quran Club Brand Logo */}
              <div className="relative w-[180px] sm:w-[220px] h-[45px]">
                <img
                  src="/quranclub/logoquranclub.png"
                  alt="Quran Club Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Spacer/Balance */}
              <div className="w-8 h-8 opacity-0" />
            </div>

            {/* Card Info & QR Section */}
            <div className="flex justify-between items-end gap-4 mt-2 relative z-20">
              <div className="space-y-1 sm:space-y-1.5 text-left text-white max-w-[70%]">
                <span className="text-[9px] sm:text-[10px] tracking-[0.2em] font-black text-red-400 uppercase">Member Access Card</span>
                <h4 className="text-lg sm:text-2xl font-extrabold truncate text-white leading-tight">
                  {formData.firstName} {formData.lastName}
                </h4>
                <div className="font-mono text-[10px] sm:text-xs text-red-300 font-bold">
                  ID: {passId}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-300 space-y-1 font-medium leading-tight">
                  <div>MAJOR: {formData.degree}</div>
                  <div>COLLEGE: {formData.college}</div>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-[#120205] p-1.5 rounded-xl border border-[#A81829]/50 flex items-center justify-center shrink-0 shadow-lg">
                {/* Dynamic verification url qr code */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://bwpjamiat.org/verify/quran-club/${passId}`)}&color=ffffff&bgcolor=120205`}
                  alt="Verification QR Code"
                  className="w-[70px] sm:w-[90px] h-[70px] sm:h-[90px] object-contain"
                />
              </div>
            </div>
          </div>

          {/* Interactive Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-8">
            <button
              onClick={handleDownloadCard}
              className="px-6 py-4 rounded-2xl bg-[#A81829] hover:bg-[#8B1425] text-white font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-white" />
              Save Card as PNG
            </button>

            <button
              onClick={handleShareCard}
              className="px-6 py-4 rounded-2xl border border-red-500/30 hover:bg-white/5 text-red-200 font-extrabold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-red-300" />
              {shareSuccess ? "Link Copied!" : "Share Access Link"}
            </button>
          </div>

          <Link
            href="/quran-club"
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm font-bold transition duration-300"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Quran Club
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Top Centered Logo (Shifted down below navbar) */}
        <div className="flex flex-col items-center justify-center mb-10 pt-4 sm:pt-6">
          <Link href="/quran-club" className="block relative w-[280px] sm:w-[320px] aspect-[16/7]">
            <Image
              src="/quranclub/logoquranclub.png"
              alt="Quran Club Logo"
              fill
              priority
              className="object-contain"
            />
          </Link>
          <div className="h-[2px] w-24 bg-[#A81829] mt-4" />
        </div>

        {/* Header Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            Join Quran Club
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Please fill out your details to join us on this beautiful journey.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
          
          {/* SECTION 1: Personal Details */}
          <div>
            <h3 className="text-lg font-bold text-[#A81829] uppercase tracking-wider border-b border-slate-100 pb-2 mb-6">
              1. Personal Identification
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Muhammad"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-[#A81829] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Ali"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-[#A81829] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="e.g. 03001234567"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-[#A81829] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-[#A81829] focus:bg-white transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-[#A81829] focus:bg-white transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Permanent Address / Location *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street Address, Area, City"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-[#A81829] focus:bg-white transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Academic Details */}
          <div>
            <h3 className="text-lg font-bold text-[#A81829] uppercase tracking-wider border-b border-slate-100 pb-2 mb-6">
              2. Academic Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Institution / College *
                </label>
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. SE College / IUB / School Name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-[#A81829] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Subject / Major / Class *
                </label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. Computer Science, Biology, Pre-Engineering"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-[#A81829] focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Motivation */}
          <div>
            <h3 className="text-lg font-bold text-[#A81829] uppercase tracking-wider border-b border-slate-100 pb-2 mb-6">
              3. Interest & Motivation
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Why do you wish to join the Quran Club? *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  placeholder="Explain your goals, what you hope to achieve, and why you are applying."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-[#A81829] focus:bg-white transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Contribution Guidelines */}
          <div>
            <h3 className="text-lg font-bold text-[#A81829] uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
              4. Contribution Guidelines
            </h3>

            {/* Soft-Toned Guidelines Notice Box */}
            <div className="p-5 rounded-2xl bg-red-50 border border-[#A81829]/20 text-slate-800 space-y-3.5">
              <h4 className="text-sm font-bold text-[#A81829] uppercase tracking-wide">
                Quran Club Guidelines:
              </h4>
              <ul className="list-disc list-inside text-xs space-y-2 text-slate-700 font-medium">
                <li>
                  <span className="font-bold text-[#A81829]">Contribution:</span> To support study guides, circle materials, retreats, and dinners, a monthly contribution of <span className="font-bold text-slate-950">PKR 500</span> is requested.
                </li>
                <li>
                  <span className="font-bold text-[#A81829]">Attendance:</span> We look forward to seeing you regularly in our weekly Tafseer circles to reflect and grow together.
                </li>
              </ul>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Link
              href="/quran-club"
              className="text-slate-500 hover:text-slate-800 text-sm font-bold transition order-2 sm:order-1"
            >
              Cancel & Return
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#A81829] hover:bg-[#8B1425] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  Joining...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  Join Quran Club
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
