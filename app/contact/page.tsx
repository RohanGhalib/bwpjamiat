'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function JoinUs() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    institution: '',
    area: '',
    role: 'volunteer',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.area) {
       alert("Please fill in the required fields (Name, Phone, Area).");
       return;
    }
    
    setStatus('loading');
    try {
      await addDoc(collection(db, 'volunteers'), {
        ...formData,
        submittedAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({
        name: '',
        phone: '',
        institution: '',
        area: '',
        role: 'volunteer',
        message: ''
      });
    } catch (error) {
      console.error("Error submitting form: ", error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-gradient-to-bl from-[#1C7F93]/10 to-transparent blur-[120px] rounded-bl-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr from-[#123962]/5 to-transparent blur-[100px] rounded-tr-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Be the Change</h2>
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-[#123962] mb-6 tracking-tight">Join The Revolution</h1>
          <p className="text-slate-500 font-medium leading-relaxed text-lg">
            Become a part of the largest student movement. Whether you want to volunteer, join our study circles, or simply stay updated through our community links, your journey starts here.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          
          {/* Volunteer Form Section */}
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(18,57,98,0.04)] border border-slate-50 relative overflow-hidden">
             
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1C7F93]/5 to-transparent rounded-bl-full"></div>

             <h3 className="text-2xl font-extrabold text-[#123962] mb-2">Register as a Volunteer</h3>
             <p className="text-slate-500 text-sm mb-8">Fill out the details below and a representative will get in touch with you shortly.</p>

             {status === 'success' ? (
                <div className="bg-[#1C7F93]/10 border border-[#1C7F93]/20 text-[#1C7F93] px-6 py-8 rounded-3xl text-center flex flex-col items-center">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-[#1C7F93]"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                   </div>
                   <h4 className="font-extrabold text-lg mb-2">Registration Complete!</h4>
                   <p className="text-sm">JazakAllah Khair for stepping up. We have received your details.</p>
                   <button 
                     onClick={() => setStatus('idle')}
                     className="mt-6 px-6 py-2 bg-white text-[#1C7F93] rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-shadow"
                   >
                     Submit Another
                   </button>
                </div>
             ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-[#123962] ml-4">Full Name *</label>
                         <input 
                           type="text" name="name" required value={formData.name} onChange={handleChange}
                           className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
                           placeholder="Muhammad Ali"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-[#123962] ml-4">Phone Number *</label>
                         <input 
                           type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                           className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
                           placeholder="0300 0000000"
                         />
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-[#123962] ml-4">Institution/University</label>
                         <input 
                           type="text" name="institution" value={formData.institution} onChange={handleChange}
                           className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
                           placeholder="IUB, GSC, etc."
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-[#123962] ml-4">City/Area *</label>
                         <input 
                           type="text" name="area" required value={formData.area} onChange={handleChange}
                           className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
                           placeholder="Bahawalpur"
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-[#123962] ml-4">I want to help with:</label>
                      <select 
                        name="role" value={formData.role} onChange={handleChange}
                        className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all appearance-none"
                      >
                         <option value="volunteer">General Volunteer</option>
                         <option value="dawah">Dawah & Outreach</option>
                         <option value="media">Media & Content</option>
                         <option value="events">Event Management</option>
                      </select>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-[#123962] ml-4">Additional Message (Optional)</label>
                      <textarea 
                        name="message" rows={4} value={formData.message} onChange={handleChange}
                        className="w-full bg-[#FAFCFF] border border-slate-100 rounded-[2rem] px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all resize-none"
                        placeholder="Tell us a bit about your skills or how you'd like to contribute..."
                      ></textarea>
                   </div>

                   {status === 'error' && (
                     <div className="text-red-500 text-sm font-bold ml-4">An error occurred. Please try again.</div>
                   )}

                   <button 
                     type="submit" 
                     disabled={status === 'loading'}
                     className="w-full relative px-8 py-4 bg-[#123962] text-white rounded-full font-bold shadow-[0_10px_30px_rgba(18,57,98,0.2)] hover:shadow-[0_20px_40px_rgba(28,127,147,0.3)] hover:-translate-y-1 transition-all duration-300 overflow-hidden group disabled:opacity-70 disabled:hover:translate-y-0"
                   >
                     <div className="absolute inset-0 bg-gradient-to-r from-[#1C7F93] to-[#123962] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                     <span className="relative z-10">{status === 'loading' ? 'Submitting...' : 'Submit Registration'}</span>
                   </button>
                </form>
             )}
          </div>

          {/* Connect Links Section */}
          <div className="lg:col-span-2 space-y-6">
             {/* Motivation piece */}
             <div className="bg-[#1C7F93]/5 border border-[#1C7F93]/10 rounded-[2.5rem] p-8 text-center">
                <svg className="w-8 h-8 text-[#1C7F93]/30 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path></svg>
                <p className="text-[#123962] font-medium text-sm leading-relaxed mb-4 italic">"And let there be [arising] from you a nation inviting to [all that is] good, enjoining what is right and forbidding what is wrong, and those will be the successful."</p>
                <span className="text-[9px] font-black tracking-widest text-[#1C7F93] uppercase">Al-Qur'an 3:104</span>
             </div>
             
             <div className="bg-[#123962] rounded-[2.5rem] p-8 shadow-[0_20px_40px_rgba(18,57,98,0.2)] relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full pointer-events-none"></div>
                <h3 className="text-2xl font-extrabold mb-2 relative z-10">Official Links</h3>
                <p className="text-white/70 text-sm mb-8 relative z-10">Connect with our official channels to receive real-time updates and literature.</p>

                <div className="space-y-4 relative z-10">
                   <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                         <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347l.001-.001ZM12 21a9 9 0 0 1-4.596-1.25l-.33-.195-3.411.895.91-3.326-.214-.341A8.995 8.995 0 0 1 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9ZM12 1.05A10.957 10.957 0 0 0 1.05 12c0 1.954.515 3.868 1.492 5.56L1 23l5.584-1.464A10.941 10.941 0 0 0 12 22.95a10.95 10.95 0 0 0 10.95-10.95A10.957 10.957 0 0 0 12 1.05Z"/></svg>
                      </div>
                      <div>
                         <h4 className="font-extrabold text-sm mb-0.5">WhatsApp Updates</h4>
                         <p className="text-[10px] text-white/50 uppercase tracking-widest">Join Community</p>
                      </div>
                   </a>

                   <a href="#" className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 bg-[#1877F2] rounded-xl flex items-center justify-center shrink-0">
                         <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </div>
                      <div>
                         <h4 className="font-extrabold text-sm mb-0.5">Facebook Page</h4>
                         <p className="text-[10px] text-white/50 uppercase tracking-widest">Follow for news</p>
                      </div>
                   </a>

                   <a href="#" className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shrink-0">
                         <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.344 3.608 1.32.977.974 1.258 2.241 1.32 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.367-.343 2.634-1.32 3.608-.975.976-2.242 1.258-3.608 1.32-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.344-3.608-1.32-.976-.974-1.258-2.241-1.32-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.367.344-2.634 1.32-3.608.974-.976 2.242-1.258 3.608-1.32 1.266-.058 1.646-.07 4.85-.07Zm0-2.163C8.741 0 8.333.014 7.053.072 5.093.161 3.424.636 2.052 2.008.68 3.38.204 5.05.115 7.009.057 8.29 0 8.697 0 11.956c0 3.259.057 3.667.115 4.947.089 1.959.565 3.629 1.937 5.001 1.372 1.372 3.041 1.847 5.001 1.937 1.28.058 1.687.072 4.947.072 3.26 0 3.668-.014 4.947-.072 1.96-.09 3.63-.565 5.002-1.937 1.372-1.372 1.847-3.042 1.937-5.001.058-1.28.072-1.688.072-4.947 0-3.26-.014-3.668-.072-4.947-.09-1.96-.565-3.63-1.937-5.002C20.631.636 18.961.161 17.002.072 15.722.014 15.314 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324Zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm3.948-9.066a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z"/></svg>
                      </div>
                      <div>
                         <h4 className="font-extrabold text-sm mb-0.5">Instagram</h4>
                         <p className="text-[10px] text-white/50 uppercase tracking-widest">Follow for coverage</p>
                      </div>
                   </a>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
