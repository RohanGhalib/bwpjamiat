"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function EventForm({ existingEvents }: { existingEvents: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    dateStr: '',
    location: '',
    imageUrl: '',
    isActive: true,
    duration: '',
    registrationLink: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'events'), formData);
      setFormData({ title: '', dateStr: '', location: '', imageUrl: '', isActive: true, duration: '', registrationLink: '', description: '' });
      router.refresh(); // Refresh Next.js cache so the server component repulls data
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add event.");
    }
    
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await deleteDoc(doc(db, 'events', id));
      router.refresh();
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete event.");
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-10">
      
      {/* Management Form */}
      <div className="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] h-fit">
        <h3 className="text-xl font-bold text-[#123962] mb-6">Create New Event</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
            <input 
               type="text" 
               required
               value={formData.title}
               onChange={e => setFormData({...formData, title: e.target.value})}
               className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
               placeholder="Annual Tarbiyati Convention BWP"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date & Time</label>
            <input 
               type="text" 
               required
               value={formData.dateStr}
               onChange={e => setFormData({...formData, dateStr: e.target.value})}
               className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
               placeholder="Nov 15 • 09:00 AM"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
            <input 
               type="text" 
               required
               value={formData.location}
               onChange={e => setFormData({...formData, location: e.target.value})}
               className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
               placeholder="IUB Main Auditorium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Image URL (Optional)</label>
            <input 
               type="url" 
               value={formData.imageUrl}
               onChange={e => setFormData({...formData, imageUrl: e.target.value})}
               className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
               placeholder="https://picsum.photos/seed/jamiatevent/600/800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration (Optional)</label>
            <input 
               type="text" 
               value={formData.duration}
               onChange={e => setFormData({...formData, duration: e.target.value})}
               className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
               placeholder="2 Hours"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registration Link (Optional)</label>
            <input 
               type="url" 
               value={formData.registrationLink}
               onChange={e => setFormData({...formData, registrationLink: e.target.value})}
               className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
               placeholder="https://forms.gle/..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
            <textarea 
               value={formData.description}
               onChange={e => setFormData({...formData, description: e.target.value})}
               className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all min-h-[120px]"
               placeholder="Event details..."
            ></textarea>
          </div>
          
          <button 
             type="submit" 
             disabled={loading}
             className="w-full mt-4 bg-[#123962] text-white rounded-xl font-bold py-4 hover:bg-[#1C7F93] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Publishing Event...' : 'Publish Event'}
          </button>
        </form>
      </div>

      {/* Existing Events Viewer */}
      <div className="lg:col-span-2 space-y-4">
         <h3 className="text-xl font-bold text-[#123962] mb-6">Live Events Directory</h3>
         {existingEvents.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-slate-100 flex flex-col justify-center items-center text-center">
               <p className="text-slate-400 font-medium">No active events found in the database.</p>
            </div>
         ) : (
            existingEvents.map(event => (
               <div key={event.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row gap-6 items-center justify-between group hover:border-[#1C7F93]/30 transition-colors">
                  <div className="flex-1">
                     <span className="inline-block px-2 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-md mb-2">Live</span>
                     <h4 className="text-lg font-bold text-[#123962]">{event.title}</h4>
                     <p className="text-sm text-slate-500 mt-1">{event.dateStr} &bull; {event.location}</p>
                     <p className="text-xs text-slate-400 mt-2 font-mono">ID: {event.id}</p>
                  </div>
                  <div className="flex-shrink-0">
                     <button 
                        onClick={() => handleDelete(event.id)}
                        className="p-3 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300"
                        title="Delete Event"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                     </button>
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
}
