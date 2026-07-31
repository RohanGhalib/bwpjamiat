"use client";

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  GraduationCap, 
  Building2, 
  Home, 
  HelpCircle, 
  ChevronDown, 
  AlertCircle, 
  Send, 
  QrCode, 
  Share2, 
  Cpu, 
  BookOpen, 
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Who is eligible to participate in the Summer Camp?",
    answer: "This summer camp is exclusively organized for male students (Boys) enrolled in 9th, 10th, FSc, ICS, University, or recent graduates across Bahawalpur."
  },
  {
    question: "What are the exact dates and daily timings?",
    answer: "The camp runs from 3rd August to 19th August (15 Days continuous learning), daily in the morning from 10:00 AM to 12:00 PM."
  },
  {
    question: "Where will the classes be conducted?",
    answer: "Sessions will take place physically at the Al-Khidmat Office, Bahawalpur."
  },
  {
    question: "What key skills will I learn during the 15 days?",
    answer: "You will gain practical expertise in Prompt Engineering (ChatGPT, Claude, Gemini) and mastering modern AI productivity tools for content creation, research, automated workflows, and problem solving."
  },
  {
    question: "Is there any registration or tuition fee?",
    answer: "No, the summer camp is a community learning initiative brought to you by Islami Jamiat-e-Talaba Bahawalpur and registration is completely free."
  },
  {
    question: "Do I need prior programming experience or a laptop?",
    answer: "No programming experience is needed! Bringing a laptop or smartphone will help you perform live hands-on practice during classes."
  }
];

export default function SummerSchoolPage() {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    classLevel: '',
    institute: '',
    address: '',
    whyJoining: '',
    isMale: false
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [passData, setPassData] = useState<{ passId: string; name: string } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.whatsapp.trim() || !formData.email.trim() || !formData.classLevel.trim() || !formData.institute.trim() || !formData.address.trim() || !formData.whyJoining.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!formData.isMale) {
      toast.error('This camp is strictly reserved for male students. Please confirm eligibility.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/summerschool/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      setSubmitted(true);
      setPassData({ passId: data.passId, name: formData.name });
      toast.success(data.message || 'Registration successful!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#070e1b] text-slate-100 font-sans selection:bg-[#10b981] selection:text-white relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-[#10b981]/15 via-[#065f46]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="container mx-auto px-4 py-12 lg:py-20 max-w-6xl">
        
        {/* Header Badge & Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#34d399] text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Islami Jamiat e Talaba Bahawalpur
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
            Summer Camp <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34d399] via-[#10b981] to-[#059669]">2026</span>
          </h1>

          <p className="text-lg sm:text-xl font-medium text-emerald-100/80 mb-8">
            Master Prompt Engineering & AI Tools in a 15-Day Intensive Hands-on Workshop
          </p>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0d192e]/80 border border-slate-800 p-4 rounded-2xl shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Calendar className="w-6 h-6 text-[#34d399] shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-slate-400">Starting Date</p>
                <p className="text-sm font-bold text-slate-200">3rd – 19th Aug</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Clock className="w-6 h-6 text-[#34d399] shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-slate-400">Timings</p>
                <p className="text-sm font-bold text-slate-200">10:00 – 12:00 AM</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <MapPin className="w-6 h-6 text-[#34d399] shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-slate-400">Venue</p>
                <p className="text-sm font-bold text-slate-200">Al-Khidmat Office</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <User className="w-6 h-6 text-[#34d399] shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-emerald-400">Eligibility</p>
                <p className="text-sm font-bold text-emerald-200">Boys Only</p>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Banner */}
        <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#0d2238] to-[#091726] p-6 rounded-3xl border border-slate-800 shadow-xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#34d399] shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Prompt Engineering</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Learn advanced prompting techniques for ChatGPT, Claude, & Gemini to solve complex tasks, generate code, write research, and automate tasks.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0d2238] to-[#091726] p-6 rounded-3xl border border-slate-800 shadow-xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#34d399] shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Expertise in AI Tools</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Hands-on practical training in cutting-edge AI media generators, productivity assistants, presentation builders, and workflow automation.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container / Pass Confirmation */}
        <div className="max-w-3xl mx-auto mb-20">
          {submitted && passData ? (
            /* Ticket Pass Confirmation Screen */
            <div className="bg-slate-900 border-2 border-[#10b981] rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-[#10b981]/20 rounded-full flex items-center justify-center text-[#34d399] mx-auto mb-4 border border-[#10b981]/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                Registration Confirmed!
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Welcome to Summer Camp 2026, {passData.name}!
              </h2>

              <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                Your entry pass ticket has been generated and sent to your email address. Please present this Pass ID upon entrance at Al-Khidmat Office.
              </p>

              {/* Pass Card Preview */}
              <div className="bg-[#0b1626] border border-emerald-500/30 rounded-2xl p-6 max-w-sm mx-auto mb-8 text-left relative shadow-inner">
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Pass ID</span>
                    <span className="text-lg font-mono font-bold text-[#34d399]">{passData.passId}</span>
                  </div>
                  <QrCode className="w-10 h-10 text-emerald-400 opacity-80" />
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <p><strong className="text-slate-400">Session:</strong> AI & Prompt Engineering Camp</p>
                  <p><strong className="text-slate-400">Dates:</strong> 3rd - 19th August (15 Days)</p>
                  <p><strong className="text-slate-400">Timings:</strong> 10:00 AM - 12:00 PM</p>
                  <p><strong className="text-slate-400">Venue:</strong> Al-Khidmat Office, Bahawalpur</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(passData.passId);
                    toast.success('Pass ID copied to clipboard!');
                  }}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/40"
                >
                  <Share2 className="w-4 h-4" /> Copy Pass ID
                </button>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      whatsapp: '',
                      email: '',
                      classLevel: '',
                      institute: '',
                      address: '',
                      whyJoining: '',
                      isMale: false
                    });
                  }}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all border border-slate-700"
                >
                  Register Another Student
                </button>
              </div>
            </div>
          ) : (
            /* Signup Form */
            <div className="bg-[#0b172a] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <Send className="w-6 h-6 text-[#34d399]" />
                  Summer School Registration Form
                </h2>
                <p className="text-slate-400 text-sm">
                  Fill out the form below to reserve your seat in the 15-day AI Summer Camp.
                </p>
              </div>

              {/* Only for Boys Alert Banner */}
              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200">
                  <strong className="font-bold text-amber-300">Boys Only Session:</strong> This specific summer camp batch is open strictly for male students across Bahawalpur.
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" /> Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Muhammad Ahmad"
                      required
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Number *
                    </label>
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="03001234567"
                      required
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-400" /> Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ahmad@example.com"
                      required
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {/* Class / Qualification */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Class / Grade *
                    </label>
                    <input
                      type="text"
                      name="classLevel"
                      value={formData.classLevel}
                      onChange={handleChange}
                      placeholder="e.g. 10th Class / 1st Year / BS CS"
                      required
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Institute */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" /> School / College / Institute *
                    </label>
                    <input
                      type="text"
                      name="institute"
                      value={formData.institute}
                      onChange={handleChange}
                      placeholder="e.g. SE College Bahawalpur"
                      required
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-emerald-400" /> Residential Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. Model Town B, Bahawalpur"
                      required
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                {/* Why joining */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Why do you want to join this AI camp? *
                  </label>
                  <textarea
                    name="whyJoining"
                    value={formData.whyJoining}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Briefly state your learning goals or motivation..."
                    required
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* Boys Only Eligibility Checkbox */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isMale"
                      checked={formData.isMale}
                      onChange={handleChange}
                      required
                      className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
                    />
                    <span className="text-xs text-slate-300 leading-relaxed">
                      I confirm that I am a <strong>male student</strong> and can physically attend the sessions at Al-Khidmat Office Bahawalpur from 3-19 August (10:00 AM - 12:00 PM). *
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-extrabold rounded-2xl text-base transition-all duration-300 shadow-xl shadow-emerald-950/60 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting Registration...
                    </span>
                  ) : (
                    <>
                      Submit Summer Camp Registration <Check className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto pt-8 border-t border-slate-800">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-[#34d399]" />
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-sm">Everything you need to know about the Summer Camp</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-[#0b172a] border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center gap-4 hover:bg-slate-900/50 transition-colors"
                >
                  <span className="font-semibold text-slate-200 text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-emerald-400 shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
