"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { EmberMember } from '@/lib/types';
import EmberTeamModal from './EmberTeamModal';
import Image from 'next/image';
import { revalidateTeam } from '@/app/actions/revalidate';

interface EmberTeamManagerProps {
  initialMembers: EmberMember[];
}

export default function EmberTeamManager({ initialMembers }: EmberTeamManagerProps) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<EmberMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  const departments = ["All", ...Array.from(new Set(initialMembers.map(m => m.department)))];

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         m.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'All' || m.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const handleDelete = async (member: EmberMember) => {
    if (!confirm(`Are you sure you want to remove ${member.name}?`)) return;

    toast.loading('Removing member...', { id: 'delete-member' });
    try {
      await deleteDoc(doc(db, 'ember_team', member.id));
      
      // Delete image from R2 if it exists
      if ((member as any).imageStoragePath) {
        try {
          await axios.post('/api/delete-file', { key: (member as any).imageStoragePath });
        } catch (e) {
          console.warn('Failed to delete image from storage', e);
        }
      }

      setMembers(members.filter(m => m.id !== member.id));
      toast.success('Member removed!', { id: 'delete-member' });
      await revalidateTeam();
      router.refresh();
    } catch (error) {
      toast.error('Failed to remove member.', { id: 'delete-member' });
    }
  };

  const handleEdit = (member: EmberMember) => {
    setMemberToEdit(member);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setMemberToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-1 gap-4 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1C7F93] transition-all"
            />
            <svg className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#1C7F93] transition-all appearance-none cursor-pointer"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAdd}
          className="w-full md:w-auto px-8 py-3 bg-[#123962] text-white rounded-2xl font-bold hover:bg-[#1C7F93] hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Member
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden mb-4 border-2 border-slate-50 group-hover:border-[#1C7F93]/20 transition-all">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-black text-[#123962] mb-1">{member.name}</h4>
              <p className="text-[10px] font-bold text-[#1C7F93] uppercase tracking-widest mb-3">{member.role}</p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold uppercase">{member.department}</span>
                <span className={`px-3 py-1 ${member.gender === 'boy' ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'} rounded-full text-[10px] font-bold uppercase`}>{member.gender}</span>
              </div>
              <div className="flex gap-2 w-full pt-4 border-t border-slate-50">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400 hover:text-[#123962] hover:bg-slate-50 rounded-xl transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member)}
                  className="flex-1 py-2 text-[11px] font-black uppercase tracking-wider text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-[#123962] text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              {member.order}
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 font-medium italic">No members found matching your criteria.</p>
          </div>
        )}
      </div>

      <EmberTeamModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setMemberToEdit(null);
        }}
        memberToEdit={memberToEdit}
      />
    </div>
  );
}
