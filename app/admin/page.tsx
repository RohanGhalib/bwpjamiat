"use client";

import Link from 'next/link';
import { submitAdminLogout } from '@/app/actions/auth';

export default function AdminDashboard() {
  const handleLogout = async () => {
    await submitAdminLogout();
  };

  return (
    <div className="min-h-screen bg-transparent  pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0">
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="mb-16 flex items-start justify-between">
          <div>
            <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Command Center</h2>
            <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Admin Portal</h1>
            <p className="text-slate-500 font-medium">Manage the BWP Jamiat application content natively.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Events Manager Link */}
          <Link href="/admin/events" className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1C7F93]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#FAFCFF] rounded-xl flex items-center justify-center mb-6 text-[#1C7F93] border border-slate-100 group-hover:border-[#1C7F93]/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#123962] mb-2">Manage Events</h3>
            <p className="text-slate-500 text-sm font-medium">Add new conventions, delete past events, and update the upcoming schedule.</p>
          </Link>
          <Link href="/admin/taranas" className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1C7F93]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#FAFCFF] rounded-xl flex items-center justify-center mb-6 text-[#1C7F93] border border-slate-100 group-hover:border-[#1C7F93]/30 transition-colors">
              <svg fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm6-6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" clipRule="evenodd" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#123962] mb-2">Manage Taranas</h3>
            <p className="text-slate-500 text-sm font-medium">Add new taranas, delete old taranas, and update the upcoming taranas.</p>
          </Link>
          {/* Ember Team Link */}
          <Link href="/admin/ember" className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#E66A2E]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#FFF9F5] rounded-xl flex items-center justify-center mb-6 text-[#E66A2E] border border-slate-100 group-hover:border-[#E66A2E]/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.946 5.946 0 00-.94 3.197m0 0l.001.031c0 .225.012.447.038.666A11.944 11.944 0 0112 21c2.17 0 4.207-.576 5.963-1.584A6.062 6.062 0 0118 18.719m-12 0a5.971 5.971 0 00.941-3.197m0 0A5.995 5.995 0 0112 12.75a5.995 5.995 0 015.058 2.772m0 0a5.946 5.946 0 01.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#123962] mb-2">Manage Ember Team</h3>
            <p className="text-slate-500 text-sm font-medium">Add or remove members for the Ember'26 Hackathon team roster.</p>
          </Link>
          {/* Future CMS Modules */}
          <div className="group bg-slate-50/50 rounded-3xl p-8 border border-slate-100 flex flex-col justify-center items-center text-center opacity-70">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 text-slate-300 border border-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-400 mb-2">Articles CMS</h3>
            <p className="text-slate-400 text-sm">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
