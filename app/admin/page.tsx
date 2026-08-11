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
          {/* Email Sender Link */}
          <Link href="/admin/email" className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1C7F93]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#FAFCFF] rounded-xl flex items-center justify-center mb-6 text-[#1C7F93] border border-slate-100 group-hover:border-[#1C7F93]/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#123962] mb-2">Email Sender</h3>
            <p className="text-slate-500 text-sm font-medium">Compose and send custom emails to anyone from info@bwpjamiat.org.</p>
          </Link>
          <Link href="/admin/site-structure" className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#123962]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#FAFCFF] rounded-xl flex items-center justify-center mb-6 text-[#123962] border border-slate-100 group-hover:border-[#123962]/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#123962] mb-2">Site Structure</h3>
            <p className="text-slate-500 text-sm font-medium">Control nav visibility, dynamic endpoints, and redirects with printed-link safety warnings.</p>
          </Link>
          {/* Complaints Manager Link */}
          <Link href="/admin/complaints" className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#FFF9F9] rounded-xl flex items-center justify-center mb-6 text-red-500 border border-slate-100 group-hover:border-red-500/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.3c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#123962] mb-2">Student Complaints</h3>
            <p className="text-slate-500 text-sm font-medium">View and manage student queries, complaints, details, gender, and proof images.</p>
          </Link>
          {/* Quran Club Link */}
          <Link href="/admin/quran-club" className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#A81829]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#FFF9F9] rounded-xl flex items-center justify-center mb-6 text-[#A81829] border border-slate-100 group-hover:border-[#A81829]/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#A81829] mb-2">Manage Quran Club</h3>
            <p className="text-slate-500 text-sm font-medium">Review and approve member applications, and send weekly session notifications via WhatsApp.</p>
          </Link>
          {/* Summer School Link */}
          <Link href="/admin/summerschool" className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#10b981]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#F0FDF4] rounded-xl flex items-center justify-center mb-6 text-[#10b981] border border-slate-100 group-hover:border-[#10b981]/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A.75.75 0 0 1 1 7.858a.75.75 0 0 1 .316-.621l10-6.25a.75.75 0 0 1 .834 0l10 6.25a.75.75 0 0 1 .316.621.75.75 0 0 1-.58.762c-.868.21-1.756.48-2.658.813m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#123962] mb-2">Summer School Signups</h3>
            <p className="text-slate-500 text-sm font-medium">View, search, filter, and export student registrations for the AI Summer Camp (3-19 Aug).</p>
          </Link>
          {/* Volunteer Registrations Link */}
          <Link href="/admin/volunteers" className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1C7F93]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="w-12 h-12 bg-[#FAFCFF] rounded-xl flex items-center justify-center mb-6 text-[#1C7F93] border border-slate-100 group-hover:border-[#1C7F93]/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#123962] mb-2">Volunteer Registrations</h3>
            <p className="text-slate-500 text-sm font-medium">View, search, filter, and manage volunteer applications and student details.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
