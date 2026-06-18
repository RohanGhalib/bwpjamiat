'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  Trash2, 
  Check, 
  RotateCcw, 
  ExternalLink, 
  Search, 
  Building2, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  ShieldAlert, 
  Filter, 
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

type Complaint = {
  id: string;
  isAnonymous: boolean;
  name: string | null;
  email: string | null;
  phone: string | null;
  gender: 'Male' | 'Female';
  institute: string;
  campus: string | null;
  details: string;
  proofs: string[];
  submittedAt: any;
  status: 'pending' | 'resolved';
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved'>('all');
  const [filterGender, setFilterGender] = useState<'all' | 'Male' | 'Female'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'complaints'), 
      orderBy('submittedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Complaint[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({
          id: doc.id,
          isAnonymous: data.isAnonymous || false,
          name: data.name || null,
          email: data.email || null,
          phone: data.phone || null,
          gender: data.gender || 'Male',
          institute: data.institute || '',
          campus: data.campus || null,
          details: data.details || '',
          proofs: data.proofs || [],
          submittedAt: data.submittedAt,
          status: data.status || 'pending',
        } as Complaint);
      });
      setComplaints(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching complaints: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: 'pending' | 'resolved') => {
    const nextStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
    try {
      await updateDoc(doc(db, 'complaints', id), {
        status: nextStatus
      });
    } catch (err) {
      console.error("Failed to update status: ", err);
      alert("Failed to update complaint status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this complaint? This cannot be undone.")) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'complaints', id));
    } catch (err) {
      console.error("Failed to delete complaint: ", err);
      alert("Failed to delete complaint.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    // Firestore timestamp
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Filter complaints logic
  const filteredComplaints = complaints.filter(c => {
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesGender = filterGender === 'all' || c.gender === filterGender;
    
    const term = searchQuery.toLowerCase();
    const matchesSearch = 
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.phone && c.phone.includes(term)) ||
      c.details.toLowerCase().includes(term) ||
      c.institute.toLowerCase().includes(term) ||
      (c.campus && c.campus.toLowerCase().includes(term));

    return matchesStatus && matchesGender && matchesSearch;
  });

  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-gradient-to-bl from-[#1C7F93]/5 to-transparent blur-[120px] rounded-bl-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr from-[#123962]/5 to-transparent blur-[100px] rounded-tr-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header Block */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Link 
              href="/admin" 
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#1C7F93] hover:underline mb-3 uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-4xl font-black text-[#123962] tracking-tight mb-2">Student Complaints Panel</h1>
            <p className="text-slate-500 font-medium text-sm">Monitor, process, and resolve student issues across Bahawalpur.</p>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-4">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-3 flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center font-bold text-lg">
                {pendingCount}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Pending</p>
                <p className="text-xs font-black text-[#123962]">Requires Action</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-3 flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center font-bold text-lg">
                {resolvedCount}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-green-600 tracking-wider">Resolved</p>
                <p className="text-xs font-black text-[#123962]">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-[0_10px_40px_rgba(18,57,98,0.02)] mb-8 flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-1">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search by details, institute, name, or phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full pl-11 pr-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all text-[#123962] font-medium"
              />
            </div>

            {/* Status Filter */}
            <div className="relative shrink-0">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-5 py-3 pr-10 text-xs font-bold text-[#123962] focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Status: Pending</option>
                <option value="resolved">Status: Resolved</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <Filter className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Gender Filter */}
            <div className="relative shrink-0">
              <select 
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value as any)}
                className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-5 py-3 pr-10 text-xs font-bold text-[#123962] focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] appearance-none"
              >
                <option value="all">All Genders</option>
                <option value="Male">Gender: Male</option>
                <option value="Female">Gender: Female</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>

        {/* Complaints Listing */}
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center p-32">
            <Loader2 className="w-10 h-10 text-[#1C7F93] animate-spin mb-4" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Syncing Complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-16 text-center shadow-[0_10px_40px_rgba(18,57,98,0.02)]">
            <CheckCircle2 className="w-16 h-16 text-[#1C7F93]/35 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#123962] mb-1">No Complaints Found</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
              Either no complaints have been registered yet, or no records match your selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredComplaints.map((c) => (
              <div 
                key={c.id}
                className={`bg-white rounded-[2rem] p-6 md:p-8 border shadow-[0_10px_40px_rgba(18,57,98,0.01)] transition-all relative overflow-hidden flex flex-col lg:flex-row gap-6 lg:gap-10 items-stretch ${
                  c.status === 'resolved' 
                    ? 'border-slate-100 opacity-80' 
                    : 'border-slate-100 hover:shadow-lg'
                }`}
              >
                {/* Left Side: General Info Badges, User Details & Institute */}
                <div className="lg:w-1/3 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-10 shrink-0">
                  <div className="space-y-4">
                    {/* Status & Date & Anonymity Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        c.status === 'resolved' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {c.status}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        c.isAnonymous 
                          ? 'bg-red-50 text-red-600 border border-red-100' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {c.isAnonymous ? 'Anonymous' : 'Standard'}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        c.gender === 'Male'
                          ? 'bg-[#123962]/5 text-[#123962]'
                          : 'bg-pink-50 text-pink-600 border border-pink-100'
                      }`}>
                        {c.gender}
                      </span>
                    </div>

                    {/* Submitter Name / Info Block */}
                    <div>
                      {c.isAnonymous ? (
                        <div className="flex items-center space-x-2 text-slate-400">
                          <ShieldAlert className="w-5 h-5 shrink-0" />
                          <span className="font-extrabold text-sm uppercase tracking-wide">Anonymous Submitter</span>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <h3 className="text-lg font-black text-[#123962] flex items-center gap-2">
                            <User className="w-4 h-4 text-[#1C7F93]" />
                            {c.name}
                          </h3>
                          <div className="space-y-1 text-xs text-slate-500 font-semibold">
                            <a href={`mailto:${c.email}`} className="flex items-center gap-2 hover:text-[#1C7F93] transition-colors">
                              <Mail className="w-3.5 h-3.5 shrink-0" />
                              <span className="break-all">{c.email}</span>
                            </a>
                            <a href={`tel:${c.phone}`} className="flex items-center gap-2 hover:text-[#1C7F93] transition-colors">
                              <Phone className="w-3.5 h-3.5 shrink-0" />
                              <span>{c.phone}</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Educational Institution Details */}
                  <div className="mt-6 space-y-2 pt-4 border-t border-slate-50">
                    <div className="flex items-start gap-2.5 text-[#123962]">
                      <Building2 className="w-4 h-4 text-[#1C7F93] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-extrabold leading-tight">{c.institute}</p>
                        {c.campus && (
                          <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#1C7F93]" />
                            {c.campus}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 pt-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(c.submittedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Details description & Proof images & Controls */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-6">
                    {/* Complaint Details Description */}
                    <div>
                      <h4 className="text-[10px] uppercase font-black text-[#1C7F93] tracking-widest mb-2">Query Details</h4>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-line break-words bg-[#FAFCFF] border border-slate-50 p-5 rounded-2xl">
                        {c.details}
                      </p>
                    </div>

                    {/* Proof Images attached */}
                    <div>
                      <h4 className="text-[10px] uppercase font-black text-[#1C7F93] tracking-widest mb-3">Proofs / Attached Images</h4>
                      {c.proofs.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No proof images attached.</p>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {c.proofs.map((url, idx) => (
                            <a 
                              key={idx}
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200/50 hover:border-[#1C7F93] transition-all bg-slate-50 shrink-0 block"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={url} 
                                alt={`Proof ${idx + 1}`} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ExternalLink className="w-3.5 h-3.5 text-white" />
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions / Control Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-50">
                    
                    {/* Mark status toggle button */}
                    <button
                      onClick={() => handleToggleStatus(c.id, c.status)}
                      className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                        c.status === 'resolved'
                          ? 'bg-[#123962] text-white hover:bg-[#123962]/90 shadow-[0_4px_12px_rgba(18,57,98,0.15)]'
                          : 'bg-green-600 text-white hover:bg-green-700 shadow-[0_4px_12px_rgba(22,163,74,0.2)]'
                      }`}
                    >
                      {c.status === 'resolved' ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reopen Complaint</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark as Resolved</span>
                        </>
                      )}
                    </button>

                    {/* Delete action button */}
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="flex items-center space-x-1 px-4 py-2.5 rounded-full text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Document</span>
                    </button>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
