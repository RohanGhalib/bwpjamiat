"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { getEventState, type EventRecord } from '@/lib/event-utils';
import EventModal from './EventModal';
import toast from 'react-hot-toast';
import { deleteMediaFile } from '@/lib/media-client';

export default function EventForm({ existingEvents }: { existingEvents: EventRecord[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event: EventRecord) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (event: EventRecord) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;
    
    setDeletingId(event.id);
    toast.loading('Deleting event...', { id: 'delete-event' });

    try {
      await deleteDoc(doc(db, 'events', event.id));

      if (event.imageStoragePath) {
        try {
          await deleteMediaFile(event.imageStoragePath);
        } catch (storageError) {
          console.warn('Could not remove event poster.', storageError);
        }
      }

      toast.success('Event deleted successfully.', { id: 'delete-event' });
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting document: ", error);
      toast.error(`Failed to delete event: ${error.message || 'Unknown error'}`, { id: 'delete-event' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
        <div>
          <h3 className="text-xl font-bold text-[#123962]">Live Events Directory</h3>
          <p className="text-sm text-slate-500 mt-1">Manage your upcoming and past events.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-[#123962] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1C7F93] hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New Event
        </button>
      </div>

      {/* Events List */}
      <div className="grid lg:grid-cols-2 gap-6">
         {existingEvents.length === 0 ? (
            <div className="lg:col-span-2 bg-white rounded-3xl p-16 border border-slate-100 flex flex-col justify-center items-center text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-300">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                 </svg>
               </div>
               <h4 className="text-lg font-bold text-[#123962] mb-1">No Events Found</h4>
               <p className="text-slate-400 font-medium">Click the button above to create your first event.</p>
            </div>
         ) : (
            existingEvents.map(event => (
               <div key={event.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex gap-6 hover:border-[#1C7F93]/30 transition-all group">
                  
                  {/* Thumbnail */}
                  {event.imageUrl ? (
                    <div className="w-24 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 relative shadow-sm">
                      <img src={event.imageUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-32 rounded-2xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${getEventState(event) === 'past' ? 'bg-slate-100 text-slate-500' : 'bg-green-50 text-green-600'}`}>
                          {getEventState(event) === 'past' ? 'Finished' : 'Live'}
                        </span>
                        {event.eventCategory === 'dedicated' && (
                          <span className="inline-block ml-2 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-indigo-50 text-indigo-600">
                            Dedicated
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-[#123962] leading-tight line-clamp-2">{event.title}</h4>
                      <p className="text-sm text-slate-500 mt-2 font-medium">{event.dateStr} &bull; {event.location}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                      <button 
                        onClick={() => handleEdit(event)}
                        disabled={deletingId === event.id}
                        className="flex-1 py-2.5 text-[#123962] bg-[#123962]/5 hover:bg-[#1C7F93] hover:text-white rounded-xl transition-all duration-300 font-bold text-xs flex justify-center items-center gap-1.5 disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.112l-2.054.68m10.9-12.89l-10.9 10.9m10.9-12.89l-1.687-1.688m1.687 1.688L14.06 4.962m-10.9 12.89l1.688-1.688m-1.688 1.688L3 21l.68-2.054a4.5 4.5 0 011.112-1.89z" /></svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(event)}
                        disabled={deletingId === event.id}
                        className="py-2.5 px-4 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                        title="Delete Event"
                      >
                        {deletingId === event.id ? (
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

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        eventToEdit={editingEvent}
      />
    </div>
  );
}
