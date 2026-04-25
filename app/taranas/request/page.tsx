'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';

export default function RequestTarana() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    taranaTitle: '',
    artist: '',
    details: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.taranaTitle) {
       alert("Please fill in the required fields (Name, Tarana Title).");
       return;
    }
    
    setStatus('loading');
    try {
      await addDoc(collection(db, 'tarana_requests'), {
        ...formData,
        status: 'pending',
        submittedAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({
        name: '',
        contact: '',
        taranaTitle: '',
        artist: '',
        details: ''
      });
    } catch (error) {
      console.error("Error submitting request: ", error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-gradient-to-bl from-[#1C7F93]/10 to-transparent blur-[120px] rounded-bl-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr from-[#123962]/5 to-transparent blur-[100px] rounded-tr-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        <div className="mb-12">
          <Link href="/taranas" className="text-[#1C7F93] hover:underline mb-8 inline-block text-sm font-bold flex items-center gap-2 group">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
             Back to Gallery
          </Link>
          <div className="text-center max-w-2xl mx-auto mt-4">
            <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Suggest Audio</h2>
            <h1 className="text-4xl md:text-5xl font-black text-[#123962] mb-6 tracking-tight">Request A Tarana</h1>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">
              Can't find your favorite tarana? Let us know what you are looking for, and our media team will try to add it to the gallery.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(18,57,98,0.04)] border border-slate-50 relative overflow-hidden">
           {/* Decorative element */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1C7F93]/5 to-transparent rounded-bl-full"></div>

           {status === 'success' ? (
              <div className="bg-[#1C7F93]/5 border border-[#1C7F93]/10 text-[#1C7F93] px-6 py-12 rounded-3xl text-center flex flex-col items-center">
                 <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-[#1C7F93]/10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 text-[#1C7F93]"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                 </div>
                 <h4 className="font-extrabold text-2xl mb-3 text-[#123962]">Request Received!</h4>
                 <p className="text-slate-500 font-medium max-w-md mx-auto">JazakAllah Khair for your suggestion. Our team will review the request and add the tarana soon.</p>
                 <div className="mt-8 flex gap-4">
                   <button 
                     onClick={() => setStatus('idle')}
                     className="px-6 py-3 bg-white text-[#1C7F93] border border-slate-200 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all"
                   >
                     Submit Another
                   </button>
                   <Link href="/taranas" className="px-6 py-3 bg-[#123962] text-white rounded-full text-sm font-bold shadow-[0_4px_14px_rgba(18,57,98,0.2)] hover:shadow-[0_6px_20px_rgba(28,127,147,0.3)] transition-all">
                     Return to Gallery
                   </Link>
                 </div>
              </div>
           ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-[#123962] ml-4">Tarana Title / Keywords *</label>
                       <input 
                         type="text" name="taranaTitle" required value={formData.taranaTitle} onChange={handleChange}
                         className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
                         placeholder="e.g. Utho Talaba"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-[#123962] ml-4">Artist / Reciter (Optional)</label>
                       <input 
                         type="text" name="artist" value={formData.artist} onChange={handleChange}
                         className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
                         placeholder="If known"
                       />
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-[#123962] ml-4">Your Name *</label>
                       <input 
                         type="text" name="name" required value={formData.name} onChange={handleChange}
                         className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
                         placeholder="Your full name"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-[#123962] ml-4">Contact Info (Optional)</label>
                       <input 
                         type="text" name="contact" value={formData.contact} onChange={handleChange}
                         className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
                         placeholder="Phone or Email"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-[#123962] ml-4">Additional Details or YouTube Link (Optional)</label>
                    <textarea 
                      name="details" rows={4} value={formData.details} onChange={handleChange}
                      className="w-full bg-[#FAFCFF] border border-slate-100 rounded-[2rem] px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all resize-none"
                      placeholder="Paste a link to the audio if you have it..."
                    ></textarea>
                 </div>

                 {status === 'error' && (
                   <div className="text-red-500 text-sm font-bold ml-4">An error occurred. Please try again.</div>
                 )}

                 <button 
                   type="submit" 
                   disabled={status === 'loading'}
                   className="w-full md:w-auto md:px-12 relative py-4 bg-[#123962] text-white rounded-full font-bold shadow-[0_10px_30px_rgba(18,57,98,0.2)] hover:shadow-[0_20px_40px_rgba(28,127,147,0.3)] hover:-translate-y-1 transition-all duration-300 overflow-hidden group disabled:opacity-70 disabled:hover:translate-y-0 mt-4 block mx-auto"
                 >
                   <div className="absolute inset-0 bg-gradient-to-r from-[#1C7F93] to-[#123962] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                   <span className="relative z-10">{status === 'loading' ? 'Submitting Request...' : 'Submit Request'}</span>
                 </button>
              </form>
           )}
        </div>
      </div>
    </div>
  );
}
