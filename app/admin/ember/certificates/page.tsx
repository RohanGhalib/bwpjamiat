"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import localFont from 'next/font/local';
import toast from 'react-hot-toast';
import CertificateGeneratorModal from '@/components/admin/CertificateGeneratorModal';
import { EmberMember } from '@/lib/types';

const dreamPlanner = localFont({
  src: "../../../../public/dreamplanner.otf",
  display: "swap",
});

interface CertificateRequest {
  id: string;
  memberId: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  status: 'pending' | 'sent' | 'rejected' | 'blocked';
  certificateType?: 'Appreciation' | 'Participation';
  requestedAt: string;
}

export default function AdminCertificatesPage() {
  const [activeTab, setActiveTab] = useState<'participants' | 'requests'>('participants');
  
  // Data states
  const [requests, setRequests] = useState<CertificateRequest[]>([]);
  const [participants, setParticipants] = useState<EmberMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<CertificateRequest | null>(null);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Partial<EmberMember> | null>(null);
  
  // Rejection states
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [requestToReject, setRequestToReject] = useState<CertificateRequest | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqSnap, partSnap] = await Promise.all([
        getDocs(query(collection(db, 'certificate_requests'), orderBy('requestedAt', 'desc'))),
        getDocs(query(collection(db, 'ember_team'), orderBy('name', 'asc')))
      ]);

      setRequests(reqSnap.docs.map(d => ({ id: d.id, ...d.data() })) as CertificateRequest[]);
      setParticipants(partSnap.docs.map(d => ({ id: d.id, ...d.data() })) as EmberMember[]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Certificate Request Actions ---
  const handleStatusUpdate = async (id: string, status: 'sent' | 'rejected' | 'blocked') => {
    try {
      await updateDoc(doc(db, 'certificate_requests', id), { status });
      toast.success(`Certificate ${status === 'rejected' || status === 'blocked' ? 'blocked' : 'updated'}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const submitRejection = async () => {
    if (!requestToReject) return;
    try {
      await updateDoc(doc(db, 'certificate_requests', requestToReject.id), { 
        status: 'rejected',
        rejectionNote: rejectionNote 
      });
      
      if (requestToReject.email) {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: requestToReject.email,
            type: 'certificate_rejected',
            data: { name: requestToReject.name, note: rejectionNote }
          })
        });
      }

      toast.success("Request rejected and email sent.");
      setRejectionModalOpen(false);
      setRequestToReject(null);
      setRejectionNote('');
      fetchData();
    } catch(err) {
      toast.error("Failed to reject request.");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteDoc(doc(db, 'certificate_requests', id));
      toast.success("Record deleted.");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete record.");
    }
  };

  // --- Participant CRUD Actions ---
  const handleSaveParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant?.name || !editingParticipant?.department) {
      toast.error("Name and Department are required.");
      return;
    }
    
    try {
      const data = {
        name: editingParticipant.name,
        email: editingParticipant.email || '',
        phone: editingParticipant.phone || '',
        department: editingParticipant.department,
        role: editingParticipant.role || editingParticipant.department,
        gender: editingParticipant.gender || 'boy',
        order: editingParticipant.order || 999,
        img: editingParticipant.img || '/person.png'
      };

      if (editingParticipant.id) {
        await updateDoc(doc(db, 'ember_team', editingParticipant.id), data);
        toast.success("Participant updated!");
      } else {
        await addDoc(collection(db, 'ember_team'), data);
        toast.success("Participant added!");
      }
      setIsParticipantModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to save participant.");
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    if (!confirm("Are you sure you want to delete this person? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, 'ember_team', id));
      toast.success("Participant deleted.");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete participant.");
    }
  };

  const handleGenerateDirectly = async (participant: EmberMember) => {
    // 1. Create a verified record in certificate_requests
    try {
      const type = participant.department === 'Participant' ? 'Participation' : 'Appreciation';
      const docRef = await addDoc(collection(db, 'certificate_requests'), {
        memberId: participant.id,
        name: participant.name,
        department: participant.department,
        certificateType: type,
        email: participant.email || '',
        phone: participant.phone || '',
        status: 'sent', // Mark as sent since we are generating it now
        requestedAt: new Date().toISOString()
      });

      // 2. Open Modal
      setSelectedRequest({
        id: docRef.id,
        memberId: participant.id,
        name: participant.name,
        department: participant.department,
        certificateType: type,
        email: participant.email || '',
        phone: participant.phone || '',
        status: 'sent',
        requestedAt: new Date().toISOString()
      });
      
      // Refresh list behind the scenes
      fetchData();
    } catch (error) {
      toast.error("Failed to initialize certificate generation.");
    }
  };

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Administration</h2>
            <h1 className="text-5xl font-black text-[#123962] mb-4 tracking-tight">Ember Roster</h1>
            <p className="text-slate-500 font-medium">Manage team members, participants, and their certificates.</p>
          </div>
          <div className="flex gap-2">
             <button 
               onClick={() => { setEditingParticipant({}); setIsParticipantModalOpen(true); }}
               className="bg-[#1C7F93] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#123962] transition-colors flex items-center gap-2"
             >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
               </svg>
               Add Member
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('participants')}
            className={`pb-4 px-4 font-bold tracking-wide transition-colors ${activeTab === 'participants' ? 'text-[#1C7F93] border-b-2 border-[#1C7F93]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            PEOPLE & CONTACTS ({participants.length})
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`pb-4 px-4 font-bold tracking-wide transition-colors ${activeTab === 'requests' ? 'text-[#1C7F93] border-b-2 border-[#1C7F93]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            CERTIFICATE RECORDS ({requests.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-[#123962] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            
            {/* PARTICIPANTS TAB */}
            {activeTab === 'participants' && (
              <div className="flex flex-col">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center">
                   <div className="relative w-full max-w-md">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                     </svg>
                     <input 
                       type="text" 
                       placeholder="Search by name, email, or department..." 
                       value={searchTerm}
                       onChange={e => setSearchTerm(e.target.value)}
                       className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all text-sm"
                     />
                   </div>
                </div>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="w-full text-left relative">
                    <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                      <tr>
                        <th className="px-8 py-4">Name & Dept</th>
                        <th className="px-8 py-4">Contact</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredParticipants.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-8 py-4">
                            <div className="font-black text-[#123962] text-lg">{p.name}</div>
                            <div className="text-xs font-bold text-[#1C7F93] uppercase tracking-wider">{p.department}</div>
                          </td>
                          <td className="px-8 py-4">
                            <div className="text-sm font-medium text-slate-600">{p.email || <span className="text-slate-300 italic">No Email</span>}</div>
                            <div className="text-xs text-slate-400">{p.phone || <span className="text-slate-300 italic">No Phone</span>}</div>
                          </td>
                          <td className="px-8 py-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleGenerateDirectly(p)}
                              className="px-4 py-2 bg-[#1C7F93]/10 text-[#1C7F93] hover:bg-[#1C7F93]/20 font-bold text-xs rounded-lg transition-all"
                            >
                              GENERATE CERT
                            </button>
                            <button
                              onClick={() => { setEditingParticipant(p); setIsParticipantModalOpen(true); }}
                              className="p-2 text-slate-400 hover:text-[#123962] hover:bg-slate-200 rounded-lg transition-all"
                              title="Edit Details"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.112l-2.83.828.828-2.83a4.5 4.5 0 011.112-1.89l12.813-12.814z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteParticipant(p.id)}
                              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredParticipants.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-medium">
                            No people found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CERTIFICATE RECORDS TAB */}
            {activeTab === 'requests' && (
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left relative">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                    <tr>
                      <th className="px-8 py-4">Recipient</th>
                      <th className="px-8 py-4">Contact</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Date</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-8 py-4">
                          <div className="font-black text-[#123962] text-lg">{req.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-[#1C7F93] uppercase tracking-wider">{req.department}</span>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                              req.certificateType === 'Participation' 
                              ? 'border-blue-200 text-blue-500 bg-blue-50' 
                              : 'border-amber-200 text-amber-500 bg-amber-50'
                            }`}>
                              {req.certificateType || 'Appreciation'}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="text-sm font-medium text-slate-600">{req.email || '-'}</div>
                          <div className="text-xs text-slate-400">{req.phone || '-'}</div>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            req.status === 'sent' ? 'bg-green-100 text-green-600' :
                            (req.status === 'rejected' || req.status === 'blocked') ? 'bg-red-100 text-red-600' :
                            'bg-amber-100 text-amber-600'
                          }`}>
                            {req.status === 'rejected' ? 'BLOCKED' : req.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-sm text-slate-400">
                          {new Date(req.requestedAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-4 text-right space-x-2 whitespace-nowrap">
                          {req.status !== 'rejected' && req.status !== 'blocked' && (
                            <>
                              <button
                                onClick={() => setSelectedRequest(req)}
                                className="p-2 text-[#1C7F93] hover:bg-[#1C7F93]/10 rounded-lg transition-all"
                                title="Download/Regenerate Certificate"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                              </button>
                              {req.status === 'pending' && (
                                <button
                                  onClick={() => handleStatusUpdate(req.id, 'sent')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                  title="Mark as Sent"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setRequestToReject(req);
                                  setRejectionNote('');
                                  setRejectionModalOpen(true);
                                }}
                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                                title="Reject / Block Request"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteRequest(req.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Record Completely"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">
                          No certificate records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generator Modal */}
      {selectedRequest && (
        <CertificateGeneratorModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSuccess={() => {
            if(selectedRequest.status === 'pending') {
              handleStatusUpdate(selectedRequest.id, 'sent');
            }
            setSelectedRequest(null);
          }}
        />
      )}

      {/* Add/Edit Participant Modal */}
      {isParticipantModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setIsParticipantModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-black text-[#123962] mb-6">
              {editingParticipant?.id ? 'Edit Person' : 'Add Person'}
            </h2>
            
            <form onSubmit={handleSaveParticipant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name *</label>
                <input 
                  required
                  type="text" 
                  value={editingParticipant?.name || ''}
                  onChange={e => setEditingParticipant({...editingParticipant, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1C7F93] transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Department *</label>
                  <input 
                    required
                    type="text"
                    placeholder="Participant, Technical, etc."
                    value={editingParticipant?.department || ''}
                    onChange={e => setEditingParticipant({...editingParticipant, department: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1C7F93] transition-all"
                  />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</label>
                   <select 
                     value={editingParticipant?.gender || 'boy'}
                     onChange={e => setEditingParticipant({...editingParticipant, gender: e.target.value as 'boy'|'girl'})}
                     className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1C7F93] transition-all bg-white"
                   >
                     <option value="boy">Boy</option>
                     <option value="girl">Girl</option>
                   </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                <input 
                  type="email" 
                  value={editingParticipant?.email || ''}
                  onChange={e => setEditingParticipant({...editingParticipant, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1C7F93] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={editingParticipant?.phone || ''}
                  onChange={e => setEditingParticipant({...editingParticipant, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1C7F93] transition-all"
                />
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-[#1C7F93] text-white py-4 rounded-xl font-bold tracking-widest hover:bg-[#123962] transition-colors shadow-lg"
                >
                  SAVE RECORD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModalOpen && requestToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <h2 className="text-2xl font-black text-red-600 mb-2">Reject Request</h2>
            <p className="text-sm text-slate-500 mb-6">
              Rejecting this request will invalidate it and send an email to <strong>{requestToReject.name}</strong> with your note.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Reason / Note *</label>
                <textarea 
                  required
                  rows={4}
                  value={rejectionNote}
                  onChange={e => setRejectionNote(e.target.value)}
                  placeholder="e.g. Your name does not match our records."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => {
                    setRejectionModalOpen(false);
                    setRequestToReject(null);
                  }}
                  className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={submitRejection}
                  disabled={!rejectionNote.trim()}
                  className="flex-1 bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
                >
                  CONFIRM REJECT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
