"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { 
  MapPin, 
  Calendar, 
  Users, 
  Gift, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Download, 
  Share2, 
  Mail, 
  AlertCircle,
  Coffee,
  HelpCircle,
  BookOpen
} from "lucide-react";
import QRCode from "qrcode";

const swizzer = localFont({
  src: "../../../public/fonts/uswa/Swizzer-regular.ttf",
  display: "swap",
});

const swizzerItalic = localFont({
  src: "../../../public/fonts/uswa/SwizzerItalic.ttf",
  display: "swap",
});

export default function UswaPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    whatsapp: "",
    email: "",
    city: "Bahawalpur",
    institution: "KIPS College",
    degree: "",
    academicYear: "",
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

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.whatsapp.trim() ||
      !formData.email.trim() ||
      !formData.institution.trim() ||
      !formData.degree.trim()
    ) {
      setErrorMsg("Please fill in all required fields marked with *");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/uswa/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit registration");
      }

      setPassId(data.passId);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while submitting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPass = async () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Background
      const grad = ctx.createLinearGradient(0, 0, 800, 480);
      grad.addColorStop(0, "#05290f");
      grad.addColorStop(0.6, "#031c0a");
      grad.addColorStop(1, "#010f05");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 480);

      // 2. Border
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, 790, 470);

      // 3. Header
      ctx.fillStyle = "#86efac";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("ISLAMI JAMIAT-E-TALABA BAHAWALPUR", 50, 50);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 28px sans-serif";
      ctx.fillText("USWA : THE PROPHETIC MINDSET", 50, 85);

      ctx.fillStyle = "#22c55e";
      ctx.fillRect(50, 105, 700, 2);

      // 4. Attendee Details
      ctx.fillStyle = "#86efac";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("OFFICIAL DELEGATE PASS", 50, 145);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(`${formData.firstName} ${formData.lastName}`, 50, 195);

      ctx.fillStyle = "#4ade80";
      ctx.font = "bold 20px monospace";
      ctx.fillText(`PASS ID: ${passId}`, 50, 240);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "16px sans-serif";
      ctx.fillText(`COLLEGE: ${formData.institution}`, 50, 285);
      ctx.fillText(`CLASS / PROGRAM: ${formData.degree}`, 50, 318);

      ctx.fillStyle = "#facc15";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("VENUE: KIPS COLLEGE, MODEL TOWN A", 50, 365);
      ctx.fillText("DATE: SUNDAY, 20TH SEPTEMBER (BOYS ONLY)", 50, 395);

      // 5. QR Code
      const qrUrl = `https://bwpjamiat.org/verify/uswa/${passId}`;
      const qrDataUrl = await QRCode.toDataURL(qrUrl, {
        margin: 1,
        width: 140,
        color: { dark: "#ffffff", light: "#031c0a" },
      });

      const qrImg = new window.Image();
      qrImg.src = qrDataUrl;
      await new Promise((resolve) => {
        qrImg.onload = resolve;
      });

      ctx.drawImage(qrImg, 590, 150, 150, 150);

      ctx.fillStyle = "#86efac";
      ctx.font = "11px sans-serif";
      ctx.fillText("Show pass at entry gate", 595, 325);

      // 6. Download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `USWA_Pass_${passId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating pass card image", err);
    }
  };

  const handleShare = async () => {
    const shareUrl = "https://bwpjamiat.org/uswa";
    if (navigator.share) {
      try {
        await navigator.share({
          title: "USWA - The Prophetic Mindset Summit",
          text: `Join USWA: The Prophetic Mindset Summit at KIPS College Bahawalpur on Sunday 20th Sept! Register free:`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Canceled share", err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#031406] text-white font-sans selection:bg-lime-500 selection:text-black overflow-x-hidden scroll-smooth">
      {/* ── TOP HERO BANNER (Faithful Mobile-First Poster Design) ── */}
      <div className="relative w-full overflow-hidden flex flex-col items-center justify-start pb-12 pt-6 px-4">
        {/* Watercolor Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/uswa/bg.png"
            alt="USWA Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#031406] pointer-events-none" />
        </div>

        {/* Mosque Layer (Positioned behind content, tinted green) */}
        <div className="absolute bottom-0 inset-x-0 w-full h-[52%] max-h-[520px] pointer-events-none z-10 flex items-end justify-center overflow-hidden">
          <div className="relative w-full max-w-[700px] h-full opacity-40 sm:opacity-55 mix-blend-overlay">
            <Image
              src="/uswa/mosque.png"
              alt="Mosque Silhouette"
              fill
              priority
              className="object-contain object-bottom"
            />
          </div>
        </div>

        {/* Poster Brand Content */}
        <div className="relative z-20 flex flex-col items-center text-center w-full max-w-lg mx-auto pt-2">
          {/* Top Jamiat Shield Badge */}
          <div className="relative w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 mb-2 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
            <Image
              src="/logo.png"
              alt="Islami Jamiat-e-Talaba Badge"
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* Title: USWA */}
          <h1 
            className={`${swizzer.className} text-[5.5rem] xs:text-[7rem] sm:text-[9.5rem] leading-[0.82] tracking-tight text-[#05220c] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] select-none`}
            style={{
              textShadow: "0 0 1px rgba(0,0,0,0.6)",
            }}
          >
            USWA
          </h1>

          {/* Subtitle: THE PROPHETIC MINDSET */}
          <h2 
            className={`${swizzerItalic.className} text-xl xs:text-2xl sm:text-4xl italic tracking-wider text-[#05220c] uppercase leading-none mt-1 select-none font-bold`}
          >
            THE PROPHETIC MINDSET
          </h2>

          {/* Highlight Badge: SESSIONS . QUIZ . REFRESHMENTS */}
          <div className="mt-4 px-4 py-1.5 rounded-full bg-black/80 border border-lime-400/40 backdrop-blur-md shadow-lg">
            <p className="text-[10px] xs:text-xs sm:text-sm font-black tracking-[0.2em] text-white uppercase">
              SESSIONS <span className="text-lime-400">•</span> QUIZ <span className="text-lime-400">•</span> REFRESHMENTS
            </p>
          </div>

          {/* 1-Day Summit Description */}
          <div className="mt-4 px-3 max-w-sm">
            <p className="text-white text-sm xs:text-base sm:text-lg font-bold leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
              A 1-Day Summit on the <br />
              Life &amp; Legacy of <br />
              <span className="text-lime-300">Prophet Muhammad (SAW)</span>
            </p>
          </div>

          {/* Mobile Key Details Grid (Location, Date, Boys Only, Free of Cost) */}
          <div className="w-full grid grid-cols-2 gap-2.5 xs:gap-3 mt-6 text-left">
            {/* Left Box: Venue & Date */}
            <div className="bg-black/75 border border-lime-500/30 rounded-2xl p-3 backdrop-blur-md flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-[9px] xs:text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
                  LOCATION
                </span>
                <p className="text-xs xs:text-sm font-black text-lime-400 leading-tight">
                  KIPS COLLEGE
                </p>
                <p className="text-[10px] xs:text-xs font-bold text-lime-300">
                  MODEL TOWN A
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                  SUNDAY
                </span>
                <p className="text-xs xs:text-sm font-black text-white">
                  20TH SEPT
                </p>
              </div>
            </div>

            {/* Right Box: Audience & Fee */}
            <div className="bg-black/75 border border-lime-500/30 rounded-2xl p-3 backdrop-blur-md flex flex-col justify-between shadow-lg text-right">
              <div>
                <span className="text-[9px] xs:text-[10px] uppercase tracking-widest text-slate-400 font-bold block">
                  AUDIENCE
                </span>
                <p className="text-base xs:text-xl font-black text-lime-400 leading-none">
                  BOYS
                </p>
                <p className="text-[10px] xs:text-xs font-bold text-white uppercase tracking-wider">
                  ONLY
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-base xs:text-xl font-black text-lime-400 leading-none">
                  FREE
                </p>
                <p className="text-[9px] xs:text-[10px] font-bold text-white uppercase tracking-wider">
                  OF COST
                </p>
              </div>
            </div>
          </div>

          {/* Primary Mobile CTA Button */}
          <div className="w-full mt-6">
            <a
              href="#register"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-lime-500 via-emerald-400 to-green-500 hover:from-lime-400 hover:to-emerald-300 text-black font-black text-sm xs:text-base uppercase tracking-wider shadow-[0_10px_28px_rgba(34,197,94,0.5)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>REGISTER FOR PASS (FREE)</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </a>
            <p className="text-[10px] text-lime-200/80 text-center font-medium mt-2">
              ⚡ Pass ID will be dispatched directly to your email
            </p>
          </div>

          {/* Organizer & Partner Strip (Matching Poster Footer) */}
          <div className="w-full bg-black/90 border border-white/10 rounded-2xl p-3.5 mt-6 flex items-center justify-between text-xs backdrop-blur-md">
            <div className="text-left">
              <span className="text-[9px] font-black tracking-widest text-lime-400 block uppercase">SIGNUP NOW</span>
              <span className="font-extrabold text-white text-xs xs:text-sm">bwpjamiat.org/uswa</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Quran Club Brand Logo */}
              <div className="relative w-20 h-6">
                <Image
                  src="/quranclub/logoquranclub.png"
                  alt="Quran Club Logo"
                  fill
                  className="object-contain"
                />
              </div>

              {/* KIPS Badge */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-white/20">
                <div className="w-5 h-5 rounded bg-white/10 text-lime-400 font-bold text-[9px] flex items-center justify-center">
                  K
                </div>
                <div className="text-left leading-tight text-[9px] font-bold text-white">
                  <span>KIPS</span>
                  <span className="block text-[7px] text-slate-400">COLLEGE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SIGNUP FORM SECTION (Structured like Quran Club Join Form) ── */}
      <div id="register" className="w-full bg-slate-50 text-slate-900 py-12 px-4 scroll-mt-6 border-t-4 border-lime-500">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Free Delegate Registration
            </div>
            <h2 className="text-2xl xs:text-3xl font-black text-slate-900 tracking-tight uppercase">
              Register For USWA Summit
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Please enter your details below. Your official entry pass will be generated and emailed to you.
            </p>
          </div>

          {/* SUBMITTED SUCCESS VIEW */}
          {submitted ? (
            <div className="bg-gradient-to-b from-[#0b3815] via-[#06290e] to-[#021808] text-white border-2 border-lime-500 rounded-3xl p-6 sm:p-8 shadow-2xl animate-page-reveal text-center">
              <div className="w-14 h-14 bg-lime-500/20 border-2 border-lime-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-lime-400" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight mb-1">
                Registration Confirmed!
              </h3>
              <p className="text-lime-300 text-xs sm:text-sm font-semibold mb-4">
                Alhamdulillah, your delegate seat is reserved.
              </p>

              {/* Quranic Ayah */}
              <div className="bg-black/50 border border-lime-500/30 rounded-2xl p-4 mb-6">
                <p className="text-lime-300 font-serif text-lg sm:text-xl font-bold mb-1" dir="rtl">
                  لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ
                </p>
                <p 
                  className="text-lime-100/90 text-xs sm:text-sm font-medium leading-relaxed"
                  style={{ fontFamily: "var(--font-nastaliq)" }}
                  dir="rtl"
                >
                  &quot;درحقیقت تمہارے لیے رسول اللہ کی ذات میں ایک بہترین اور کامل نمونہ ہے۔&quot;
                </p>
              </div>

              {/* Pass Identifier Card */}
              <div className="bg-black/60 border border-lime-400/40 rounded-2xl p-5 mb-6 text-left space-y-2">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-[10px] text-lime-400 font-bold uppercase tracking-widest">Entry Pass ID</span>
                  <span className="font-mono font-black text-sm text-lime-300">{passId}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-200">
                  <span className="text-slate-400">Delegate:</span>
                  <span className="font-bold">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-200">
                  <span className="text-slate-400">College:</span>
                  <span className="font-bold">{formData.institution}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-200">
                  <span className="text-slate-400">Venue:</span>
                  <span className="font-bold text-lime-300">KIPS College, Model Town A</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-200">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-bold text-lime-300">Sunday, 20th September</span>
                </div>
              </div>

              {/* Email Notice Box */}
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3.5 mb-6 flex items-start gap-2.5 text-left text-xs text-emerald-200">
                <Mail className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Official Pass Sent Via Email</span>
                  <span>We have sent your confirmation and entrance instructions to <strong>{formData.email}</strong>. Please check your inbox and spam folder.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleDownloadPass}
                  className="w-full py-3.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs xs:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-black" />
                  Save Pass Image to Phone (PNG)
                </button>

                <button
                  onClick={handleShare}
                  className="w-full py-3.5 rounded-xl border border-lime-500/40 hover:bg-white/5 text-lime-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-lime-300" />
                  {shareSuccess ? "Link Copied!" : "Invite Friends / Share Link"}
                </button>
              </div>
            </div>
          ) : (
            /* APPLICATION FORM (Structured like Quran Club Signup) */
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Section 1: Personal Details */}
              <div>
                <h3 className="text-xs font-black text-emerald-700 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                  1. Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Muhammad"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Ali"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="03001234567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Email Address (For Pass) *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      City / Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Model Town / Bahawalpur"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Profile */}
              <div>
                <h3 className="text-xs font-black text-emerald-700 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                  2. Academic Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Institution / College *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="e.g. KIPS College, Punjab College, IUB, SE College"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Degree / Program *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      placeholder="e.g. FSc, ICS, BSCS, BBA"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Academic Year / Class
                    </label>
                    <input
                      type="text"
                      value={formData.academicYear}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                      placeholder="e.g. 1st Year, 2nd Year"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating Pass &amp; Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Registration &amp; Receive Pass</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-500 mt-2 font-medium">
                  Free Admission • Boys Only • Pass emailed immediately upon submit
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── FOOTER (Mobile-Friendly) ── */}
      <footer className="w-full py-8 text-center text-xs text-lime-200/60 uppercase tracking-widest border-t border-lime-500/20 bg-black">
        <p className="mb-1 text-[11px]">© 2026 USWA Summit • Organized by Islami Jamiat-e-Talaba Bahawalpur</p>
        <p className="text-[10px] text-lime-400/50">bwpjamiat.org • Venue: KIPS College, Model Town A</p>
      </footer>
    </main>
  );
}
