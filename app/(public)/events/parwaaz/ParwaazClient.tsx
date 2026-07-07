'use client';

import { useState } from 'react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  Building, 
  GraduationCap, 
  Compass,
  ArrowRight,
  CalendarDays
} from 'lucide-react';

const coolveticaFont = localFont({
  src: '../../../../public/fonts/coolvetica/Coolvetica Rg.otf',
  variable: '--font-coolvetica',
});

export default function ParwaazClient() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    lastInstitution: '',
    expectedField: '',
    city: 'Bahawalpur'
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailWarning, setEmailWarning] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setEmailWarning(false);

    // Simple validations
    if (!formData.name.trim()) return setError('Please enter your full name.');
    if (!formData.phone.trim()) return setError('Please enter your WhatsApp/phone number.');
    if (!formData.email.trim()) return setError('Please enter your email address.');
    if (!formData.gender) return setError('Please select your gender.');
    if (!formData.lastInstitution.trim()) return setError('Please specify your last educational institution.');
    if (!formData.expectedField) return setError('Please select your field of interest.');

    setStatus('loading');

    try {
      const response = await fetch('/api/events/parwaaz/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      if (data.emailWarning) {
        setEmailWarning(true);
      }

      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Server error. Please try again later.');
    }
  };

  const setError = (msg: string) => {
    setErrorMessage(msg);
    setStatus('error');
  };

  // Pre-configured Google Calendar template url
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Parwaaz+Career+Counselling+Seminar&dates=20260709T043000Z/20260709T063000Z&details=Confused+about+your+career+after+Intermediate?+This+seminar+is+for+you!+Join+us+for+expert+guidance+and+counselling.&location=E-Library,+Dring+Stadium,+Bahawalpur`;

  return (
    <div className={`min-h-screen bg-[#fafbfc] pt-32 pb-16 font-sans selection:bg-[#052c24] selection:text-white relative overflow-hidden ${coolveticaFont.variable}`}>
      
      {/* Background abstract gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#052c24]/5 to-transparent blur-[100px] rounded-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#eab308]/5 to-transparent blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Main Content Card Container */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(5,44,36,0.06)] border border-slate-100 overflow-hidden grid lg:grid-cols-12 min-h-[700px]">
          
          {/* Left Column: Flyer & Landing details */}
          <div className="lg:col-span-6 bg-[#031d18] text-white p-8 sm:p-12 relative flex flex-col justify-between overflow-hidden min-h-[500px] lg:min-h-auto">
            
            {/* Free Entry Floating Badge sticker */}
            <div className="absolute top-6 right-6 z-20 bg-emerald-500/90 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-emerald-400/30 flex items-center gap-1.5 select-none pointer-events-none">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Free Entry
            </div>

            {/* Noor Mahal Background Graphic */}
            <div className="absolute inset-0 opacity-[0.22] mix-blend-lighten pointer-events-none">
              <Image 
                src="/noor.png" 
                alt="Noor Mahal Background" 
                fill 
                className="object-cover object-bottom" 
                priority
              />
            </div>

            {/* Dark green overlay to enhance text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#021411]/90 via-[#031f1a]/85 to-[#021411]/95 z-0 pointer-events-none"></div>

            {/* Logo removed since it is present in layout header */}
            <div className="relative z-10 hidden sm:block h-6"></div>

            {/* Middle Row: Display Headings in "Coolvetica" Font */}
            <div className="relative z-10 my-10 text-center sm:text-left">
              
              {/* Event Title using the Coolvetica Font */}
              <h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none text-white tracking-wide font-black uppercase drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
                style={{ fontFamily: 'var(--font-coolvetica), sans-serif' }}
              >
                PARWAAZ
              </h1>

              {/* Seminar Subtitle */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#eab308] tracking-widest uppercase mt-2 mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                CAREER COUNSELLING SEMINAR
              </h2>

              {/* Tagline Card (Handwritten Styled Box) */}
              <p className="text-xs sm:text-sm text-slate-300 font-serif italic mb-2">
                completed inter and confused about career?
              </p>
              
              <div className="inline-block bg-[#eab308] text-black px-6 py-2.5 rounded-lg shadow-lg rotate-[-1.5deg] font-serif italic font-extrabold text-sm sm:text-base border border-amber-300/40 relative">
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-white/40 border border-white/10 rotate-45 pointer-events-none" />
                this seminar is for you!
              </div>

            </div>

            {/* Bottom Row: Date & Venue details */}
            <div className="relative z-10 border-t border-white/10 pt-6">
              
              {/* Flex information details */}
              <div className="space-y-4 mb-6 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#eab308] shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Date & Time</p>
                    <p className="text-sm font-bold text-white">Thursday, 9th July 2026</p>
                    <p className="text-xs text-slate-300">09:30 AM - 11:30 AM</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#eab308] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Venue</p>
                    <p className="text-sm font-bold text-white">E-Library, Dring Stadium</p>
                    <p className="text-xs text-slate-300">Bahawalpur, Punjab</p>
                  </div>
                </div>
              </div>

              {/* Action buttons on Visual Side */}
              <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-start">
                
                {/* Scroll to Registration Form Button (Mobile only) */}
                <a 
                  href="#registration-form"
                  className="lg:hidden inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#eab308] hover:bg-[#d9a307] text-[#031d18] font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                >
                  <ArrowRight className="w-4 h-4 text-[#031d18] stroke-[3]" />
                  Register Now
                </a>

                {/* Add to Calendar Button */}
                <a 
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 transition-all text-xs font-bold uppercase tracking-wider text-white"
                >
                  <CalendarDays className="w-4 h-4 text-[#eab308]" />
                  Add to Calendar
                </a>

              </div>

              {/* Social Mark */}
              <div className="mt-8 text-center sm:text-left">
                <span className="text-[10px] font-bold text-white/50 tracking-wider">
                  Follow us on Instagram: <strong className="text-white/80">@jamiat.bwp</strong>
                </span>
              </div>

            </div>

          </div>

          {/* Right Column: Form Panel */}
          <div id="registration-form" className="lg:col-span-6 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-slate-50/50 scroll-mt-20">
            
            {status === 'success' ? (
              
              // Success Screen Card
              <div className="animate-fade-up flex flex-col items-center text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center mb-6 shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                
                <h3 className="text-2xl font-black text-[#052c24] tracking-tight mb-2">Registration Complete!</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  JazakAllah Khair! Your seat has been successfully reserved for the Parwaaz Seminar. 
                  {emailWarning ? (
                    <span className="block mt-2 font-semibold text-amber-600">
                      Your details were saved successfully, but we had trouble sending the confirmation email. Please take a screenshot of this page.
                    </span>
                  ) : (
                    <span className="block mt-2">
                      A confirmation email containing all details has been sent to your email address: <strong className="text-slate-700 font-semibold">{formData.email}</strong>.
                    </span>
                  )}
                </p>

                {/* Receipt Card */}
                <div className="w-full bg-white border border-slate-100 rounded-2xl p-5 shadow-sm mb-8 text-left space-y-3">
                  <div className="flex justify-between text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Attendee</span>
                    <span className="text-slate-700 font-bold">{formData.name}</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Phone</span>
                    <span className="text-slate-700 font-semibold">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between text-xs border-b border-slate-50 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Date & Time</span>
                    <span className="text-[#052c24] font-bold">Thu, 9th July (09:30 AM - 11:30 AM)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Venue</span>
                    <span className="text-slate-700 font-semibold">E-Library, Dring Stadium</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 bg-[#052c24] hover:bg-[#031d18] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-[0_10px_20px_rgba(5,44,36,0.15)] transition-all"
                  >
                    Add to Calendar
                  </a>
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        gender: '',
                        lastInstitution: '',
                        expectedField: '',
                        city: 'Bahawalpur'
                      });
                    }}
                    className="flex-1 py-3.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                  >
                    Register Another
                  </button>
                </div>

              </div>

            ) : (

              // Form Section
              <div className="animate-fade-up">
                
                <div className="mb-8">
                  <h3 className="text-3xl font-black text-[#052c24] tracking-tight mb-2">Secure Your Seat</h3>
                  <p className="text-slate-500 text-sm font-medium">Please fill in your details accurately to register for the free career seminar.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#052c24] ml-3 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#052c24]" /> Full Name *
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={formData.name} 
                      onChange={handleInputChange}
                      placeholder="e.g. Muhammad Ahmad"
                      className="w-full bg-[#fcfdfe] border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#052c24]/20 focus:border-[#052c24] transition-all shadow-sm"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Phone/WhatsApp field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-[#052c24] ml-3 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#052c24]" /> WhatsApp Number *
                      </label>
                      <input 
                        type="tel" 
                        name="phone" 
                        required 
                        value={formData.phone} 
                        onChange={handleInputChange}
                        placeholder="0300 0000000"
                        className="w-full bg-[#fcfdfe] border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#052c24]/20 focus:border-[#052c24] transition-all shadow-sm"
                      />
                    </div>

                    {/* Email field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-[#052c24] ml-3 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#052c24]" /> Email Address *
                      </label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        value={formData.email} 
                        onChange={handleInputChange}
                        placeholder="ahmad@gmail.com"
                        className="w-full bg-[#fcfdfe] border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#052c24]/20 focus:border-[#052c24] transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Gender select */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-[#052c24] ml-3">Gender *</label>
                      <select 
                        name="gender" 
                        required 
                        value={formData.gender} 
                        onChange={handleInputChange}
                        className="w-full bg-[#fcfdfe] border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#052c24]/20 focus:border-[#052c24] transition-all shadow-sm appearance-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    {/* City field */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-[#052c24] ml-3">City/Area</label>
                      <input 
                        type="text" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleInputChange}
                        placeholder="Bahawalpur"
                        className="w-full bg-[#fcfdfe] border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#052c24]/20 focus:border-[#052c24] transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Last educational institution */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#052c24] ml-3 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#052c24]" /> Last Institution Attended *
                    </label>
                    <input 
                      type="text" 
                      name="lastInstitution" 
                      required 
                      value={formData.lastInstitution} 
                      onChange={handleInputChange}
                      placeholder="e.g. Govt. SE College Bahawalpur"
                      className="w-full bg-[#fcfdfe] border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#052c24]/20 focus:border-[#052c24] transition-all shadow-sm"
                    />
                  </div>

                  {/* Expected area of interest */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-[#052c24] ml-3 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#052c24]" /> What is your expected field of interest? *
                    </label>
                    <select 
                      name="expectedField" 
                      required 
                      value={formData.expectedField} 
                      onChange={handleInputChange}
                      className="w-full bg-[#fcfdfe] border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#052c24]/20 focus:border-[#052c24] transition-all shadow-sm appearance-none"
                    >
                      <option value="">Select Field</option>
                      <option value="Pre-Medical / Medicine">Pre-Medical / Medicine & Allied Sciences</option>
                      <option value="Pre-Engineering / Engineering">Pre-Engineering / Engineering & Tech</option>
                      <option value="ICS / Computer Science / IT">ICS / Computer Science / IT / Software</option>
                      <option value="I.Com / BBA / Commerce / Finance">I.Com / BBA / Commerce & Finance</option>
                      <option value="F.A / Arts / Humanities / Law">F.A / Arts / Humanities / Law</option>
                      <option value="CSS / Civil Services">CSS / Competitive Exams</option>
                      <option value="Other">Other / Unsure</option>
                    </select>
                  </div>

                  {/* Error display */}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-3.5 text-xs font-semibold animate-fade-up">
                      ⚠️ {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full relative py-4 px-6 bg-[#052c24] hover:bg-[#031d18] text-[#eab308] rounded-2xl font-bold uppercase tracking-widest text-xs shadow-[0_15px_30px_rgba(5,44,36,0.15)] hover:shadow-[0_20px_40px_rgba(5,44,36,0.25)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-75 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 cursor-pointer mt-8"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#eab308]" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Register For Free
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </>
                    )}
                  </button>

                </form>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
