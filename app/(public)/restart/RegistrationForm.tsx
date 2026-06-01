"use client";

import { useState, useRef } from "react";
import { Check, Loader2, Mail, Calendar, Hash, ArrowRight, RefreshCw, Edit, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import * as htmlToImage from "html-to-image";

type GroupKey = "fsc-med" | "fsc-eng" | "ics";

// Centralized mock schedule data mapping
export const subjectSchedule = {
  "Physics": {
    date: "Thu, Jun 18",
    time: "09:00 AM - 12:00 PM",
    location: "Gromers Academy Hall A"
  },
  "Chemistry": {
    date: "Fri, Jun 19",
    time: "09:00 AM - 12:00 PM",
    location: "KIPS Academy Auditorium"
  },
  "Biology": {
    date: "Sat, Jun 20",
    time: "09:00 AM - 11:30 AM",
    location: "Base Academy Room 302"
  },
  "Mathematics": {
    date: "Sat, Jun 20",
    time: "12:00 PM - 02:30 PM",
    location: "Unique Academy Main Hall"
  },
  "Computer Science": {
    date: "Sat, Jun 20",
    time: "03:00 PM - 05:30 PM",
    location: "Unique Academy Comp Lab"
  },
  "Grand Finale": {
    date: "Sun, Jun 21",
    time: "10:00 AM - 01:00 PM",
    location: "Grand Auditorium Main Hall"
  }
};

export default function RegistrationForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    college: "",
    dob: "",
    rollNo: "",
    group: "" as GroupKey | "",
    subjects: [] as string[],
  });
  
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [passId, setPassId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [otpSuccessMsg, setOtpSuccessMsg] = useState("");
  
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Group subject lists
  const groupSubjects: Record<GroupKey, string[]> = {
    "fsc-med": ["Biology", "Physics", "Chemistry"],
    "fsc-eng": ["Mathematics", "Physics", "Chemistry"],
    "ics": ["Mathematics", "Physics", "Computer Science"],
  };

  // Group label displays
  const groupLabels: Record<GroupKey, string> = {
    "fsc-med": "FSc Pre-Medical",
    "fsc-eng": "FSc Pre-Engineering",
    "ics": "ICS (Computer Science)",
  };

  // When group changes, auto-select subjects
  const handleGroupSelect = (group: GroupKey) => {
    setFormData((prev) => ({
      ...prev,
      group,
      subjects: groupSubjects[group],
    }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setOtpSuccessMsg("");

    if (!formData.email) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    // Only validate full details on first-time registration submission
    if (!alreadyRegistered && (!formData.name || !formData.whatsapp || !formData.college || !formData.dob || !formData.rollNo || !formData.group)) {
      setErrorMsg("Please fill in all details and select your study group.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/restart/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name || "Participant",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      if (data.alreadyRegistered) {
        setAlreadyRegistered(true);
        // Pre-populate fields with existing data from server
        setFormData((prev) => ({
          ...prev,
          name: data.registration.name || prev.name,
          whatsapp: data.registration.whatsapp || prev.whatsapp,
          college: data.registration.college || prev.college,
          dob: data.registration.dob || prev.dob,
          rollNo: data.registration.rollNo || prev.rollNo,
          group: data.registration.group || prev.group,
          subjects: data.registration.subjects || prev.subjects,
        }));
        setOtpSuccessMsg(`Pass already registered. verification OTP sent to ${formData.email} to retrieve/update.`);
      } else {
        setOtpSuccessMsg(`Verification code sent to ${formData.email}`);
      }
      
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setOtpSuccessMsg("");

    if (!otp || otp.length < 5) {
      setErrorMsg("Please enter a valid verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/restart/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          otp,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setPassId(data.passId);
      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid or expired OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPass = async () => {
    if (!ticketRef.current) return;
    setDownloading(true);
    try {
      // Small pause to let rendering settle
      await new Promise((resolve) => setTimeout(resolve, 150));
      
      const dataUrl = await htmlToImage.toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2, // Sharp high-quality render
        style: {
          transform: 'none', // Reset rotation during capture
        }
      });
      
      const link = document.createElement("a");
      link.download = `Restart_Pass_${passId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Pass download error:", err);
      alert("Failed to auto-download. Please take a screenshot of your pass instead.");
    } finally {
      setDownloading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center">
        {/* Ticket Box */}
        <div 
          ref={ticketRef}
          className="w-full mx-auto p-6 sm:p-8 rounded-2xl border-2 shadow-[8px_8px_0px_rgba(0,0,0,0.45)] text-center relative rotate-1"
          style={{ backgroundColor: '#fcf8f2', borderColor: '#8b5a2e' }}
        >
          {/* Pushpin */}
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#d93838] rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.45)] flex items-center justify-center z-20 pointer-events-none">
            <div className="w-1.5 h-1.5 bg-[#ffa4a4] rounded-full" />
          </div>

          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(27, 53, 38, 0.1)', border: '1px solid #1b3526' }}>
            <Check className="w-6 h-6 text-[#1b3526]" />
          </div>
          
          <h3 
            className="text-2xl font-bold tracking-wide mb-1"
            style={{ fontFamily: "var(--font-chalkboard)", color: '#2a1405' }}
          >
            {alreadyRegistered ? "Pass Retrieved!" : "Pass Generated!"}
          </h3>
          
          <p className="text-neutral-600 text-xs mb-6 font-medium">
            Verified ticket has been sent to your email. Screenshot or download this pass.
          </p>
          
          {/* Lighter Cardboard Ticket */}
          <div 
            className="border rounded-xl p-5 text-left relative overflow-hidden shadow-inner bg-[url('/restart/cardboardtexture.jpg')] bg-cover"
            style={{ borderColor: '#d2bfa6' }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#1b3526]/5 rounded-bl-full pointer-events-none" />
            <div className="space-y-3.5 text-[#2a1405]">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold" style={{ color: '#8b5a2e' }}>Event</span>
                  <p className="text-base font-extrabold leading-tight">Restart Camp &apos;26</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-widest font-extrabold" style={{ color: '#8b5a2e' }}>Pass ID</span>
                  <p className="text-sm font-mono font-bold text-[#c27027]">{passId}</p>
                </div>
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-widest font-extrabold" style={{ color: '#8b5a2e' }}>Attendee</span>
                <p className="text-sm font-extrabold">{formData.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-[#8b5a2e]/20 pt-2.5">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold" style={{ color: '#8b5a2e' }}>Matric Roll No</span>
                  <p className="text-xs font-bold">{formData.rollNo}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold" style={{ color: '#8b5a2e' }}>Date of Birth</span>
                  <p className="text-xs font-bold">{formData.dob}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b border-[#8b5a2e]/20 pb-2.5">
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold" style={{ color: '#8b5a2e' }}>Study Group</span>
                  <p className="text-xs font-bold leading-tight">{formData.group ? groupLabels[formData.group] : ""}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold" style={{ color: '#8b5a2e' }}>WhatsApp</span>
                  <p className="text-xs font-bold">{formData.whatsapp}</p>
                </div>
              </div>

              <div>
                <span className="text-[9px] uppercase tracking-widest font-extrabold" style={{ color: '#8b5a2e' }}>Institute</span>
                <p className="text-xs font-bold">{formData.college}</p>
              </div>

              {/* Dynamic Schedule inside the pass */}
              <div className="border-t border-[#8b5a2e]/20 pt-3">
                <span className="text-[9px] uppercase tracking-widest font-extrabold block mb-1.5" style={{ color: '#8b5a2e' }}>Your Class Schedule</span>
                <div className="space-y-1.5 text-[11px] font-bold">
                  {formData.subjects.map((sub) => {
                    const sched = subjectSchedule[sub as keyof typeof subjectSchedule];
                    if (!sched) return null;
                    return (
                      <div key={sub} className="flex justify-between items-start bg-[#fcf8f2]/90 p-1.5 rounded-lg border border-[#c09975] leading-tight">
                        <div>
                          <span className="text-[#1b3526] font-extrabold">{sub}</span>
                          <p className="text-[9px] text-[#5a3a1d] font-bold">{sched.location}</p>
                        </div>
                        <div className="text-right text-[10px] text-[#2a1405] font-extrabold">
                          <div>{sched.date}</div>
                          <div className="text-[9px] text-[#5a3a1d] font-semibold">{sched.time}</div>
                        </div>
                      </div>
                    );
                  })}
                  {/* Grand Finale session */}
                  <div className="flex justify-between items-start bg-[#fefaf4] p-1.5 rounded-lg border-2 border-[#c27027] leading-tight">
                    <div>
                      <span className="text-[#c27027] font-extrabold">Grand Finale (Mandatory)</span>
                      <p className="text-[9px] text-[#2a1405] font-bold">{subjectSchedule["Grand Finale"].location}</p>
                    </div>
                    <div className="text-right text-[10px] text-[#2a1405] font-extrabold">
                      <div className="text-[#c27027]">{subjectSchedule["Grand Finale"].date}</div>
                      <div className="text-[9px] text-[#5a3a1d] font-semibold">{subjectSchedule["Grand Finale"].time}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 flex flex-col items-center border-t border-[#8b5a2e]/20">
                <span className="text-[9px] uppercase tracking-widest font-extrabold mb-2" style={{ color: '#8b5a2e' }}>Verification QR</span>
                <div className="bg-white p-2 rounded-lg border-2 border-[#8b5a2e]/40 shadow-sm">
                  <QRCodeSVG 
                    value={passId} 
                    size={110} 
                    bgColor="#ffffff" 
                    fgColor="#2a1405" 
                    level="H" 
                  />
                </div>
              </div>
            </div>
            
            {/* Ticket jagged edge styling */}
            <div className="absolute left-0 right-0 -bottom-2 flex justify-between px-4 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#fcf8f2] rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* NATIVE PASS DOWNLOAD BUTTON */}
        <button
          onClick={downloadPass}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-[#4a270f] text-[#ffffff] font-extrabold tracking-wider text-sm shadow-[4px_4px_0px_#0b1610] hover:bg-[#3d1c07] active:scale-95 transition-all duration-300 w-full cursor-pointer"
          style={{ 
            backgroundColor: '#2a1405'
          }}
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#ffffff]" />
              Saving Pass...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#ffffff]" />
              Download Pass (PNG)
            </>
          )}
        </button>

        {/* Change Group / Update details */}
        <button
          onClick={() => setStep(1)}
          className="w-full py-3.5 rounded-xl transition-all font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 border-2 active:scale-95 bg-[#fcf8f2] border-[#8b5a2e] text-[#2a1405] hover:bg-[#f4ebe1] cursor-pointer"
        >
          <Edit className="w-4 h-4" />
          Change Group / Edit Details
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Alert Error Box */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl border-2 border-red-300 bg-red-50 text-red-800 text-sm font-bold text-center">
          {errorMsg}
        </div>
      )}

      {/* Alert Success Box */}
      {otpSuccessMsg && (
        <div className="mb-6 p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-800 text-sm font-bold text-center">
          {otpSuccessMsg}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-5 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#2a1405' }}>Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setAlreadyRegistered(false); // Reset check if email is modified
                  }}
                  placeholder="name@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition placeholder-neutral-400 font-bold border-2 text-sm shadow-inner"
                  style={{ backgroundColor: '#fcf8f2', color: '#2a1405', borderColor: '#a47347' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#2a1405' }}>Full Name *</label>
              <input
                type="text"
                required={!alreadyRegistered}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 rounded-xl outline-none transition placeholder-neutral-400 font-bold border-2 text-sm shadow-inner"
                style={{ backgroundColor: '#fcf8f2', color: '#2a1405', borderColor: '#a47347' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#2a1405' }}>WhatsApp Number *</label>
              <input
                type="tel"
                required={!alreadyRegistered}
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="03xxxxxxxxx"
                className="w-full px-4 py-2.5 rounded-xl outline-none transition placeholder-neutral-400 font-bold border-2 text-sm shadow-inner"
                style={{ backgroundColor: '#fcf8f2', color: '#2a1405', borderColor: '#a47347' }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#2a1405' }}>Date of Birth *</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="date"
                  required={!alreadyRegistered}
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition font-bold border-2 text-sm shadow-inner"
                  style={{ backgroundColor: '#fcf8f2', color: '#2a1405', borderColor: '#a47347' }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#2a1405' }}>Current College / Institute *</label>
              <input
                type="text"
                required={!alreadyRegistered}
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. SE College Bahawalpur"
                className="w-full px-4 py-2.5 rounded-xl outline-none transition placeholder-neutral-400 font-bold border-2 text-sm shadow-inner"
                style={{ backgroundColor: '#fcf8f2', color: '#2a1405', borderColor: '#a47347' }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#2a1405' }}>Matriculation Roll No *</label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required={!alreadyRegistered}
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  placeholder="Enter matric roll number"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition placeholder-neutral-400 font-bold border-2 text-sm shadow-inner"
                  style={{ backgroundColor: '#fcf8f2', color: '#2a1405', borderColor: '#a47347' }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2" style={{ color: '#2a1405' }}>Select Study Group *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(groupSubjects) as GroupKey[]).map((groupKey) => {
                const isSelected = formData.group === groupKey;
                return (
                  <button
                    key={groupKey}
                    type="button"
                    onClick={() => handleGroupSelect(groupKey)}
                    className="py-3 px-4 rounded-xl border-2 text-xs font-extrabold transition flex flex-col items-center justify-center gap-1 shadow-sm hover:scale-[1.02] cursor-pointer"
                    style={{
                      backgroundImage: isSelected ? "none" : "url('/restart/cardboardtexture.jpg')",
                      backgroundSize: 'cover',
                      backgroundColor: isSelected ? '#1b3526' : '#fcf8f2',
                      borderColor: isSelected ? '#0f2016' : '#c09975',
                      color: isSelected ? '#ffffff' : '#2a1405'
                    }}
                  >
                    <span className="font-extrabold">{groupLabels[groupKey]}</span>
                    <span className="text-[9px] font-medium opacity-80">
                      ({groupSubjects[groupKey].join(", ")})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl transition-all font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 border-2 active:scale-95 hover:scale-[1.01] cursor-pointer mt-4"
            style={{
              backgroundColor: '#1b3526',
              color: '#ffffff',
              borderColor: '#0f2016',
              boxShadow: '4px 4px 0px #09130d'
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending Verification Code...
              </>
            ) : (
              <>
                {alreadyRegistered ? "Save Changes & Send Verification OTP" : "Send Verification OTP"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-6 text-left max-w-sm mx-auto p-6 rounded-2xl border-2 bg-[#fcf8f2] border-[#a47347]">
          <div className="text-center space-y-2">
            <h4 className="text-lg font-bold text-[#2a1405]">Verify Your Email</h4>
            <p className="text-xs text-neutral-600 font-semibold leading-relaxed">
              We sent a 6-digit verification code to <span className="font-extrabold text-[#c27027]">{formData.email}</span>.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5 text-[#2a1405] text-center">Enter 6-Digit OTP Code</label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full px-4 py-3 rounded-xl outline-none transition placeholder-neutral-400 font-extrabold text-xl text-center tracking-[8px] border-2 shadow-inner"
              style={{ backgroundColor: '#fcf8f2', color: '#2a1405', borderColor: '#a47347' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl transition-all font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 border-2 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: '#1b3526',
              color: '#ffffff',
              borderColor: '#0f2016',
              boxShadow: '4px 4px 0px #09130d'
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying OTP...
              </>
            ) : (
              alreadyRegistered ? "Verify & Save Changes" : "Verify & Generate Pass"
            )}
          </button>

          <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-[#8b5a2e]/20">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[#8b5a2e] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Details
            </button>
            <button
              type="button"
              onClick={handleSendOtp}
              className="text-[#1b3526] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Resend Code
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
