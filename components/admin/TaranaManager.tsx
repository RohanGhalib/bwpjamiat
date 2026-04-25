"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Tarana } from '@/lib/types';
import TaranaModal from './TaranaModal';
import toast from 'react-hot-toast';

export default function TaranaManager({ existingTaranas }: { existingTaranas: Tarana[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTarana, setEditingTarana] = useState<Tarana | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingTarana(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tarana: Tarana) => {
    setEditingTarana(tarana);
    setIsModalOpen(true);
  };

  const handleDelete = async (tarana: Tarana) => {
    if (!confirm(`Are you sure you want to delete "${tarana.title}"?`)) return;
    
    setDeletingId(tarana.id);
    toast.loading('Deleting tarana...', { id: 'delete-tarana' });

    try {
      await deleteDoc(doc(db, 'taranas', tarana.id));

      // Optionally, we could also delete the file from R2 here if we had its path.
      // Currently, audioUrl is the full public URL, we'd need to extract the path to use `/api/delete-file`.

      toast.success('Tarana deleted successfully.', { id: 'delete-tarana' });
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting document: ", error);
      toast.error(`Failed to delete tarana: ${error.message || 'Unknown error'}`, { id: 'delete-tarana' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div>
          <h3 className="text-xl font-bold text-[#123962]">Taranas Library</h3>
          <p className="text-sm text-slate-500 mt-1">Manage all available audio taranas.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-[#123962] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1C7F93] hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Tarana
        </button>
      </div>

      {/* List */}
      <div className="grid lg:grid-cols-2 gap-6">
         {existingTaranas.length === 0 ? (
            <div className="lg:col-span-2 bg-white rounded-3xl p-16 border border-slate-100 flex flex-col justify-center items-center text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-300">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                 </svg>
               </div>
               <h4 className="text-lg font-bold text-[#123962] mb-1">No Taranas Found</h4>
               <p className="text-slate-400 font-medium">Click the button above to add your first tarana.</p>
            </div>
         ) : (
            existingTaranas.map(tarana => (
               <div key={tarana.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex gap-6 hover:border-[#1C7F93]/30 transition-all group">
                  
                  <div className="w-20 h-20 rounded-2xl bg-[#1C7F93]/10 text-[#1C7F93] border border-[#1C7F93]/20 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {tarana.coverUrl ? (
                      <img src={tarana.coverUrl} alt={tarana.title} className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="text-lg font-bold text-[#123962] leading-tight">{tarana.title}</h4>
                      <p className="text-sm text-slate-500 mt-1 font-medium">{tarana.artist || 'Unknown Artist'} {tarana.duration ? `• ${tarana.duration}` : ''}</p>
                      
                      {tarana.tags && tarana.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {tarana.tags.map((tag, idx) => (
                            <span key={idx} className="text-[10px] font-bold text-[#1C7F93] bg-[#1C7F93]/10 px-2 py-1 rounded-md uppercase tracking-wider">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                      <button 
                        onClick={() => handleEdit(tarana)}
                        disabled={deletingId === tarana.id}
                        className="flex-1 py-2.5 text-[#123962] bg-[#123962]/5 hover:bg-[#1C7F93] hover:text-white rounded-xl transition-all duration-300 font-bold text-xs flex justify-center items-center gap-1.5 disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.112l-2.054.68m10.9-12.89l-10.9 10.9m10.9-12.89l-1.687-1.688m1.687 1.688L14.06 4.962m-10.9 12.89l1.688-1.688m-1.688 1.688L3 21l.68-2.054a4.5 4.5 0 011.112-1.89z" /></svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(tarana)}
                        disabled={deletingId === tarana.id}
                        className="py-2.5 px-4 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                        title="Delete Tarana"
                      >
                        {deletingId === tarana.id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
               </div>
            ))
         )}
      </div>

      <TaranaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        taranaToEdit={editingTarana}
      />
    </div>
  );
}
