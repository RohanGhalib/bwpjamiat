"use client";

import { useState } from "react";
import { submitAdminLogin } from "@/app/actions/auth";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    const success = await submitAdminLogin(password);
    
    if (success) {
      window.location.reload(); // Hard refresh to re-evaluate the Server Layout
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center font-sans">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_40px_rgba(18,57,98,0.05)] border border-slate-100 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1C7F93]/10 to-transparent rounded-bl-full z-0 pointer-events-none"></div>
        
        <div className="relative z-10 text-center mb-8">
           <div className="w-16 h-16 bg-[#FAFCFF] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#1C7F93] border border-slate-100 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
           </div>
           <h2 className="text-3xl font-black text-[#123962] tracking-tight">System Login</h2>
           <p className="text-slate-500 font-medium text-sm mt-2">Enter your credential to access the CMS.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div>
            <input 
               type="password" 
               value={password} 
               onChange={(e) => setPassword(e.target.value)} 
               className="w-full bg-[#FAFCFF] border border-slate-200 p-4 rounded-xl focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all text-center tracking-widest text-[#123962] font-black" 
               placeholder="••••••••••••" 
               required
            />
            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-wider text-center mt-3">Access Denied</p>}
          </div>
          <button 
             type="submit" 
             disabled={loading}
             className="w-full bg-[#123962] text-white p-4 rounded-xl font-extrabold hover:bg-[#1C7F93] transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "Verifying Keys..." : "Unlock Portal"}
          </button>
        </form>
      </div>
    </div>
  );
}
