"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  Users, 
  Building, 
  Calendar, 
  Phone, 
  Mail, 
  RefreshCw, 
  CheckCircle2, 
  X 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SummerRegistration {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  classLevel: string;
  institute: string;
  address: string;
  whyJoining: string;
  gender?: string;
  passId?: string;
  registeredAt?: string;
}

export default function AdminSummerSchoolManager() {
  const [registrations, setRegistrations] = useState<SummerRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReg, setSelectedReg] = useState<SummerRegistration | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/summerschool');
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations || []);
      } else {
        toast.error(data.error || 'Failed to load registrations');
      }
    } catch {
      toast.error('Network error loading registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/summerschool?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Registration deleted');
        setRegistrations(prev => prev.filter(r => r.id !== id));
        if (selectedReg?.id === id) setSelectedReg(null);
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch {
      toast.error('Error executing delete request');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredRegistrations = registrations.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.whatsapp?.toLowerCase().includes(q) ||
      r.institute?.toLowerCase().includes(q) ||
      r.classLevel?.toLowerCase().includes(q) ||
      r.passId?.toLowerCase().includes(q) ||
      r.address?.toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    if (registrations.length === 0) {
      toast.error('No data available to export');
      return;
    }

    const headers = ['Pass ID', 'Name', 'WhatsApp', 'Email', 'Class', 'Institute', 'Address', 'Why Joining', 'Registered At'];
    const rows = registrations.map(r => [
      `"${r.passId || ''}"`,
      `"${r.name || ''}"`,
      `"${r.whatsapp || ''}"`,
      `"${r.email || ''}"`,
      `"${r.classLevel || ''}"`,
      `"${r.institute || ''}"`,
      `"${r.address || ''}"`,
      `"${(r.whyJoining || '').replace(/"/g, '""')}"`,
      `"${r.registeredAt ? new Date(r.registeredAt).toLocaleString() : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Summer_School_Registrations_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV downloaded successfully!');
  };

  // Helper for WhatsApp link
  const formatWhatsappLink = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    let finalNum = cleaned;
    if (cleaned.startsWith('0')) {
      finalNum = '92' + cleaned.slice(1);
    }
    return `https://wa.me/${finalNum}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Navigation Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#10b981] hover:text-[#34d399] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Admin Command Center
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRegistrations}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl transition-all"
              title="Refresh Registrations"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={exportCSV}
              className="px-4 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/50"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
            Summer Camp Signups Portal
          </h1>
          <p className="text-slate-400 text-sm">
            AI & Prompt Engineering Camp (3–19 Aug) Participant Registrations
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Total Signups</p>
              <h3 className="text-2xl font-black text-white">{registrations.length}</h3>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Unique Institutes</p>
              <h3 className="text-2xl font-black text-white">
                {new Set(registrations.map(r => r.institute?.trim().toLowerCase()).filter(Boolean)).size}
              </h3>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-400">Latest Registration</p>
              <h3 className="text-sm font-bold text-white truncate max-w-[180px]">
                {registrations[0]?.registeredAt 
                  ? new Date(registrations[0].registeredAt).toLocaleDateString() 
                  : 'N/A'}
              </h3>
            </div>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl mb-8 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by student name, email, whatsapp, institute, or pass ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-white px-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Registrations Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-400" />
              Loading Summer Camp registrations...
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              No registrations found matching your query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-4">Pass ID / Date</th>
                    <th className="py-4 px-4">Student Name</th>
                    <th className="py-4 px-4">Contact</th>
                    <th className="py-4 px-4">Class & Institute</th>
                    <th className="py-4 px-4">Address</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs font-bold text-emerald-400 block">{reg.passId || 'N/A'}</span>
                        <span className="text-[11px] text-slate-500">
                          {reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <strong className="text-white font-bold block">{reg.name}</strong>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" /> {reg.email}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <a
                          href={formatWhatsappLink(reg.whatsapp)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          <Phone className="w-3 h-3" /> {reg.whatsapp}
                        </a>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-white font-medium block">{reg.classLevel}</span>
                        <span className="text-xs text-slate-400">{reg.institute}</span>
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-400 max-w-[180px] truncate">
                        {reg.address}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedReg(reg)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(reg.id)}
                            disabled={deletingId === reg.id}
                            className="p-2 bg-red-950/50 hover:bg-red-900/80 text-red-400 border border-red-900/50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
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
          )}
        </div>

      </div>

      {/* Details View Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedReg(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/60 inline-block mb-2">
                {selectedReg.passId}
              </span>
              <h3 className="text-2xl font-bold text-white">{selectedReg.name}</h3>
              <p className="text-xs text-slate-400">
                Registered on: {selectedReg.registeredAt ? new Date(selectedReg.registeredAt).toLocaleString() : 'N/A'}
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-300 border-t border-b border-slate-800 py-5 my-5">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 block">WhatsApp</span>
                <a 
                  href={formatWhatsappLink(selectedReg.whatsapp)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  {selectedReg.whatsapp}
                </a>
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-slate-400 block">Email</span>
                <span>{selectedReg.email}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block">Class / Grade</span>
                  <span className="font-semibold text-white">{selectedReg.classLevel}</span>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block">Institute</span>
                  <span className="font-semibold text-white">{selectedReg.institute}</span>
                </div>
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-slate-400 block">Address</span>
                <span>{selectedReg.address}</span>
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Why Joining</span>
                <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;{selectedReg.whyJoining}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedReg(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all"
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
