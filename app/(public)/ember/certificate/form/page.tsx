"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, orderBy, where } from 'firebase/firestore';
import localFont from 'next/font/local';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

const dreamPlanner = localFont({
  src: "../../../../../public/dreamplanner.otf",
  display: "swap",
});

interface TeamMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department: string;
}

export default function CertificateFormPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    name: '',
    email: '',
    phone: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const q = query(collection(db, 'ember_team'), orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        const memberData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TeamMember[];
        setMembers(memberData);
      } catch (error) {
        console.error("Error fetching members:", error);
        toast.error("Failed to load team members.");
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const selectedMember = members.find(m => m.id === formData.memberId);
      if (!selectedMember) throw new Error("Please select your name.");

      // Verification Logic
      const inputEmail = formData.email.trim().toLowerCase();
      const inputPhone = formData.phone.trim();
      const recordEmail = selectedMember.email?.trim().toLowerCase();
      const recordPhone = selectedMember.phone?.trim();

      if (!recordEmail || !recordPhone) {
        throw new Error("Your profile contact details are not set. Please contact the administrator.");
      }

      if (inputEmail !== recordEmail || inputPhone !== recordPhone) {
        throw new Error("Email or Phone number does not match our records for this name.");
      }

      // Store Request
      await addDoc(collection(db, 'certificate_requests'), {
        memberId: selectedMember.id,
        name: selectedMember.name,
        department: selectedMember.department,
        certificateType: selectedMember.department === 'Participant' ? 'Participation' : 'Appreciation',
        email: inputEmail,
        phone: inputPhone,
        status: 'pending',
        requestedAt: new Date().toISOString()
      });

      // Send Email Notification
      try {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: inputEmail,
            type: 'request_received',
            data: { name: selectedMember.name }
          })
        });
      } catch (err) {
        console.error("Failed to send email", err);
      }

      toast.success("Request submitted successfully! We will process your certificate soon.");
      setFormData({ memberId: '', name: '', email: '', phone: '' });
      setSearchTerm('');
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[var(--c-navy-dark)] overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--c-orange)]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[var(--c-accent)]/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
           <Link href="/ember" className={`${dreamPlanner.className} text-[var(--c-accent)] hover:text-white transition-colors text-xl tracking-widest flex items-center justify-center gap-2 mb-8 group`}>
             <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO EMBER
           </Link>
           <h1 className={`${dreamPlanner.className} text-white text-5xl md:text-7xl leading-tight mb-4 [text-shadow:4px_4px_0_#000]`}>
             GET YOUR CERTIFICATE
           </h1>
           <p className="text-white/60 text-lg max-w-2xl mx-auto">
             Enter your registered details to request your official Ember'26 participation certificate.
           </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2 relative">
              <label className={`${dreamPlanner.className} block text-[var(--c-accent)] text-2xl tracking-wider ml-2`}>SEARCH YOUR NAME</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Start typing your name..."
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(e.target.value.length > 0);
                    if(formData.memberId) setFormData({ ...formData, memberId: '', name: '' });
                  }}
                  onFocus={() => { if(searchTerm.length > 0) setIsDropdownOpen(true); }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--c-orange)] transition-all"
                />
                
                {isDropdownOpen && searchTerm.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-[#0a192f] border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden">
                    {members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                      <div className="px-6 py-4 text-white/40 italic">No exact match found.</div>
                    ) : (
                      members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map(member => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, memberId: member.id, name: member.name });
                            setSearchTerm(member.name);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-6 py-4 hover:bg-white/10 text-white transition-colors border-b border-white/5 last:border-0"
                        >
                          <div className="font-bold">{member.name}</div>
                          <div className="text-xs text-[var(--c-accent)]">{member.department}</div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {formData.name && (
                <p className="text-green-400 text-sm ml-2 font-medium flex items-center gap-2 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  Selected: {formData.name}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className={`${dreamPlanner.className} block text-[var(--c-accent)] text-2xl tracking-wider ml-2`}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="Your registered email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--c-orange)] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className={`${dreamPlanner.className} block text-[var(--c-accent)] text-2xl tracking-wider ml-2`}>PHONE NUMBER</label>
                <input
                  type="text"
                  required
                  placeholder="0300 0000000"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-lg placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--c-orange)] transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting || loading}
                className={`${dreamPlanner.className} w-full bg-[var(--c-orange)] hover:bg-[var(--c-accent)] text-white py-6 rounded-2xl text-3xl tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-[0_20px_40px_rgba(235,110,48,0.2)] flex items-center justify-center gap-4`}
              >
                {submitting ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    SUBMITTING...
                  </>
                ) : (
                  "GENERATE REQUEST"
                )}
              </button>
            </div>
          </form>

          {/* Note */}
          <div className="mt-12 p-6 bg-black/20 rounded-2xl border border-white/5 text-center">
            <p className="text-white/40 text-sm italic">
              * Certificates are verified manually. After submission, our team will review your request and send the official certificate to your email within 48 hours.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
