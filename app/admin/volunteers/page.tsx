'use client';

import { useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  Trash2, 
  Search, 
  Building2, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  Users,
  Loader2,
  GraduationCap,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Eye,
  X,
  ExternalLink,
  SortAsc
} from 'lucide-react';
import Link from 'next/link';

type Volunteer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  className?: string;
  subject?: string;
  institution?: string;
  area: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  whyJoin?: string;
  howDidYouKnow?: string;
  role?: string;
  message?: string;
  submittedAt: any;
};

type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'institute_asc';

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'volunteers'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Volunteer[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({
          id: doc.id,
          name: data.name || 'N/A',
          phone: data.phone || '',
          email: data.email || '',
          className: data.className || '',
          subject: data.subject || '',
          institution: data.institution || '',
          area: data.area || '',
          address: data.address || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          whyJoin: data.whyJoin || '',
          howDidYouKnow: data.howDidYouKnow || '',
          role: data.role || '',
          message: data.message || '',
          submittedAt: data.submittedAt,
        } as Volunteer);
      });
      setVolunteers(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching volunteers: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete registration for "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'volunteers', id));
      if (selectedVolunteer?.id === id) {
        setSelectedVolunteer(null);
      }
    } catch (err) {
      console.error("Failed to delete volunteer record: ", err);
      alert("Failed to delete volunteer record.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
      if (isNaN(date.getTime())) return 'N/A';
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    } catch {
      return 'N/A';
    }
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      
      let interval = Math.floor(seconds / 31536000);
      if (interval >= 1) return `${interval}y ago`;
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) return `${interval}mo ago`;
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) return `${interval}d ago`;
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return `${interval}h ago`;
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return `${interval}m ago`;
      return 'Just now';
    } catch {
      return '';
    }
  };

  const processedVolunteers = useMemo(() => {
    let result = [...volunteers];

    // Filter
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.name.toLowerCase().includes(queryLower) ||
        v.phone.toLowerCase().includes(queryLower) ||
        v.email?.toLowerCase().includes(queryLower) ||
        v.institution?.toLowerCase().includes(queryLower) ||
        v.area.toLowerCase().includes(queryLower) ||
        v.className?.toLowerCase().includes(queryLower) ||
        v.subject?.toLowerCase().includes(queryLower) ||
        v.address?.toLowerCase().includes(queryLower) ||
        v.whyJoin?.toLowerCase().includes(queryLower) ||
        v.howDidYouKnow?.toLowerCase().includes(queryLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest' || sortBy === 'oldest') {
        const timeA = a.submittedAt?.seconds ? a.submittedAt.seconds * 1000 : (a.submittedAt ? new Date(a.submittedAt).getTime() : 0);
        const timeB = b.submittedAt?.seconds ? b.submittedAt.seconds * 1000 : (b.submittedAt ? new Date(b.submittedAt).getTime() : 0);
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      }
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name_desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'institute_asc') {
        return (a.institution || '').localeCompare(b.institution || '');
      }
      return 0;
    });

    return result;
  }, [volunteers, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAFCFF] pt-28 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Top Header Navigation */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link 
              href="/admin" 
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1C7F93] hover:text-[#123962] transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-[#123962] tracking-tight flex items-center gap-3">
              Volunteer Registrations
              <span className="text-sm font-bold bg-[#1C7F93]/10 text-[#1C7F93] px-3 py-1 rounded-full">
                {volunteers.length} Total
              </span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Review and manage incoming volunteer applications and student details.
            </p>
          </div>
        </div>

        {/* Search & Sort Toolbar */}
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-[0_10px_30px_rgba(18,57,98,0.03)] border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, email, institute..."
              className="w-full bg-[#FAFCFF] border border-slate-200 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs bg-slate-100 rounded-full p-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <SortAsc className="w-4 h-4 text-[#1C7F93]" />
              Sort By:
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#FAFCFF] border border-slate-200 text-[#123962] font-semibold text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_asc">Name (A to Z)</option>
              <option value="name_desc">Name (Z to A)</option>
              <option value="institute_asc">Institute (A to Z)</option>
            </select>
          </div>
        </div>

        {/* Content Table / Loading / Empty */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-[#1C7F93] animate-spin mb-4" />
            <p className="text-slate-500 font-medium text-sm">Loading registrations...</p>
          </div>
        ) : processedVolunteers.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center">
            <Users className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-[#123962] mb-1">No Volunteers Found</h3>
            <p className="text-slate-400 text-sm max-w-md">
              {searchQuery ? `No registrations matched "${searchQuery}". Try clearing your search.` : 'No volunteer registrations have been submitted yet.'}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-[#1C7F93]/10 text-[#1C7F93] font-bold text-xs rounded-full hover:bg-[#1C7F93]/20 transition-colors"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(18,57,98,0.03)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#FAFCFF] border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Volunteer Info</th>
                    <th className="py-4 px-6">Contact & Area</th>
                    <th className="py-4 px-6">Academic Info</th>
                    <th className="py-4 px-6">Submitted</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {processedVolunteers.map((vol) => (
                    <tr key={vol.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Name & Handles */}
                      <td className="py-4 px-6 align-top">
                        <div className="font-extrabold text-[#123962] text-base mb-1 flex items-center gap-2">
                          <User className="w-4 h-4 text-[#1C7F93] shrink-0" />
                          {vol.name}
                        </div>
                        {vol.email && (
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a href={`mailto:${vol.email}`} className="hover:underline hover:text-[#1C7F93] truncate max-w-[200px]">
                              {vol.email}
                            </a>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          {vol.instagram && (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full font-semibold">
                              <svg fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.344 3.608 1.32.977.974 1.258 2.241 1.32 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.367-.343 2.634-1.32 3.608-.975.976-2.242 1.258-3.608 1.32-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.344-3.608-1.32-.976-.974-1.258-2.241-1.32-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.367.344-2.634 1.32-3.608.974-.976 2.242-1.258 3.608-1.32 1.266-.058 1.646-.07 4.85-.07Zm0-2.163C8.741 0 8.333.014 7.053.072 5.093.161 3.424.636 2.052 2.008.68 3.38.204 5.05.115 7.009.057 8.29 0 8.697 0 11.956c0 3.259.057 3.667.115 4.947.089 1.959.565 3.629 1.937 5.001 1.372 1.372 3.041 1.847 5.001 1.937 1.28.058 1.687.072 4.947.072 3.26 0 3.668-.014 4.947-.072 1.96-.09 3.63-.565 5.002-1.937 1.372-1.372 1.847-3.042 1.937-5.001.058-1.28.072-1.688.072-4.947 0-3.26-.014-3.668-.072-4.947-.09-1.96-.565-3.63-1.937-5.002C20.631.636 18.961.161 17.002.072 15.722.014 15.314 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324Zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm3.948-9.066a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z"/></svg>
                              {vol.instagram.startsWith('@') ? vol.instagram : `@${vol.instagram}`}
                            </span>
                          )}
                          {vol.facebook && (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                              <svg fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                              FB Handle
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Contact & Location */}
                      <td className="py-4 px-6 align-top">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 text-sm mb-1">
                          <Phone className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <a 
                            href={`https://wa.me/${vol.phone.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-green-600 flex items-center gap-1"
                            title="Chat on WhatsApp"
                          >
                            {vol.phone}
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-[#1C7F93] shrink-0" />
                          <span className="font-semibold text-slate-600">{vol.area}</span>
                        </div>
                        {vol.address && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px]" title={vol.address}>
                            {vol.address}
                          </p>
                        )}
                      </td>

                      {/* Academics */}
                      <td className="py-4 px-6 align-top">
                        {vol.institution ? (
                          <div className="font-bold text-[#123962] text-sm flex items-center gap-1.5 mb-1">
                            <Building2 className="w-3.5 h-3.5 text-[#1C7F93] shrink-0" />
                            <span>{vol.institution}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No institute specified</span>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {vol.className && (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                              <GraduationCap className="w-3 h-3 text-slate-500" />
                              {vol.className}
                            </span>
                          )}
                          {vol.subject && (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-[#1C7F93]/10 text-[#1C7F93] px-2 py-0.5 rounded-md font-medium">
                              <BookOpen className="w-3 h-3" />
                              {vol.subject}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Submitted Time */}
                      <td className="py-4 px-6 align-top">
                        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {formatDate(vol.submittedAt)}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 shrink-0" />
                          {getTimeAgo(vol.submittedAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedVolunteer(vol)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1C7F93]/10 text-[#1C7F93] hover:bg-[#1C7F93] hover:text-white rounded-full text-xs font-bold transition-all shadow-sm"
                            title="View full responses and details"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Details
                          </button>
                          <button
                            onClick={() => handleDelete(vol.id, vol.name)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 md:p-8 relative">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedVolunteer(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6 pb-4 border-b border-slate-100">
              <span className="text-[10px] font-black text-[#1C7F93] tracking-widest uppercase">Volunteer Application</span>
              <h2 className="text-2xl font-black text-[#123962] mt-1">{selectedVolunteer.name}</h2>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Submitted: {formatDate(selectedVolunteer.submittedAt)} ({getTimeAgo(selectedVolunteer.submittedAt)})
              </div>
            </div>

            {/* Content Details Grid */}
            <div className="space-y-6">
              
              {/* Contact Information */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1C7F93]" /> Contact & Location
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 bg-[#FAFCFF] p-4 rounded-2xl border border-slate-100 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Phone Number</span>
                    <a 
                      href={`https://wa.me/${selectedVolunteer.phone.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-extrabold text-[#123962] hover:text-green-600 transition-colors flex items-center gap-1 mt-0.5"
                    >
                      {selectedVolunteer.phone}
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Email Address</span>
                    <span className="font-extrabold text-[#123962] mt-0.5 block">
                      {selectedVolunteer.email || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">City / Area</span>
                    <span className="font-bold text-slate-700 mt-0.5 block">{selectedVolunteer.area || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Complete Address</span>
                    <span className="font-semibold text-slate-700 mt-0.5 block">{selectedVolunteer.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Academics & Socials */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#1C7F93]" /> Academics & Social Handles
                </h4>
                <div className="grid sm:grid-cols-3 gap-4 bg-[#FAFCFF] p-4 rounded-2xl border border-slate-100 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Institute / University</span>
                    <span className="font-bold text-[#123962] mt-0.5 block">{selectedVolunteer.institution || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Class</span>
                    <span className="font-bold text-slate-700 mt-0.5 block">{selectedVolunteer.className || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Subject / Dept</span>
                    <span className="font-bold text-slate-700 mt-0.5 block">{selectedVolunteer.subject || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Instagram</span>
                    <span className="font-semibold text-pink-600 mt-0.5 block">{selectedVolunteer.instagram || 'N/A'}</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-xs text-slate-400 block font-medium">Facebook</span>
                    <span className="font-semibold text-blue-600 mt-0.5 block truncate">{selectedVolunteer.facebook || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Textarea Question 1 */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#1C7F93]" /> Why do you want to join IJT?
                </h4>
                <div className="bg-[#FAFCFF] p-4 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedVolunteer.whyJoin || selectedVolunteer.message || <span className="italic text-slate-400">No response provided</span>}
                </div>
              </div>

              {/* Textarea Question 2 */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#1C7F93]" /> How did you come to know about us?
                </h4>
                <div className="bg-[#FAFCFF] p-4 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedVolunteer.howDidYouKnow || <span className="italic text-slate-400">No response provided</span>}
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                onClick={() => handleDelete(selectedVolunteer.id, selectedVolunteer.name)}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-full transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Application
              </button>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="px-6 py-2 bg-[#123962] text-white hover:bg-[#1C7F93] font-bold text-xs rounded-full transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
