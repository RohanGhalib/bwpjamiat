"use client";

import { useState, useRef } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

// ── colour helpers ──────────────────────────────────────────────────────────

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    case b: h = ((r - g) / d + 4) / 6; break;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

async function extractGradientColors(file: File): Promise<{ gradientFrom: string; gradientTo: string }> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 50;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          resolve({ gradientFrom: '#123962', gradientTo: '#1C7F93' });
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const topData = ctx.getImageData(0, 0, size, size / 2).data;
        const bottomData = ctx.getImageData(0, size / 2, size, size / 2).data;

        const avg = (data: Uint8ClampedArray) => {
          let r = 0, g = 0, b = 0, count = 0;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
          }
          return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
        };

        const [r1, g1, b1] = avg(topData);
        const [r2, g2, b2] = avg(bottomData);

        const [h1, s1, l1] = rgbToHsl(r1, g1, b1);
        const [h2, s2, l2] = rgbToHsl(r2, g2, b2);

        // Boost saturation and ensure the lightness makes it rich/dark
        const gradientFrom = hslToHex(h1, Math.min(100, Math.max(60, s1 + 25)), Math.min(40, Math.max(15, l1 - 10)));
        const gradientTo = hslToHex((h2 + 25) % 360, Math.min(100, Math.max(60, s2 + 20)), Math.min(45, Math.max(18, l2 - 5)));

        URL.revokeObjectURL(objectUrl);
        resolve({ gradientFrom, gradientTo });
      } catch {
        URL.revokeObjectURL(objectUrl);
        resolve({ gradientFrom: '#123962', gradientTo: '#1C7F93' });
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ gradientFrom: '#123962', gradientTo: '#1C7F93' });
    };
    img.src = objectUrl;
  });
}

// ── types ────────────────────────────────────────────────────────────────────

interface StoredEvent {
  id: string;
  title?: string;
  dateStr?: string;
  eventDate?: string;
  location?: string;
  imageUrl?: string;
  isActive?: boolean;
  duration?: string;
  registrationLink?: string;
  description?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

// ── component ───────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: '',
  dateStr: '',
  eventDate: '',
  location: '',
  isActive: true,
  duration: '',
  registrationLink: '',
  description: '',
};

export default function EventForm({ existingEvents }: { existingEvents: StoredEvent[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(previewUrl);
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview('');
    setExistingImageUrl('');
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (event: StoredEvent) => {
    setEditingId(event.id);
    setFormData({
      title: event.title || '',
      dateStr: event.dateStr || '',
      eventDate: event.eventDate || '',
      location: event.location || '',
      isActive: event.isActive !== false,
      duration: event.duration || '',
      registrationLink: event.registrationLink || '',
      description: event.description || '',
    });
    setExistingImageUrl(event.imageUrl || '');
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = existingImageUrl;
      let gradientFrom = '';
      let gradientTo = '';

      if (imageFile) {
        // Extract gradient colours before uploading
        const colors = await extractGradientColors(imageFile);
        gradientFrom = colors.gradientFrom;
        gradientTo = colors.gradientTo;

        // Upload image to Firebase Storage
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `events/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const fileRef = storageRef(storage, fileName);
        const snapshot = await uploadBytes(fileRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const payload: Omit<StoredEvent, 'id'> = { ...formData, imageUrl };
      if (gradientFrom) payload.gradientFrom = gradientFrom;
      if (gradientTo) payload.gradientTo = gradientTo;

      if (editingId) {
        await updateDoc(doc(db, 'events', editingId), payload);
      } else {
        await addDoc(collection(db, 'events'), payload);
      }

      resetForm();
      router.refresh();
    } catch (error) {
      console.error("Error saving event: ", error);
      alert("Failed to save event.");
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteDoc(doc(db, 'events', id));
      if (editingId === id) resetForm();
      router.refresh();
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete event.");
    }
  };

  // Only allow blob: (local preview) or https:// (Firebase Storage) to prevent XSS via javascript: URLs
  const rawPreview = imagePreview || existingImageUrl;
  const previewSrc = rawPreview.startsWith('blob:') || rawPreview.startsWith('https://') ? rawPreview : '';

  return (
    <div className="grid lg:grid-cols-3 gap-10">

      {/* Management Form */}
      <div className="lg:col-span-1 bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] h-fit">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#123962]">
            {editingId ? 'Edit Event' : 'Create New Event'}
          </h3>
          {editingId && (
            <button onClick={resetForm} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
              placeholder="Annual Tarbiyati Convention BWP"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Date & Time</label>
            <input
              type="text"
              required
              value={formData.dateStr}
              onChange={e => setFormData({ ...formData, dateStr: e.target.value })}
              className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
              placeholder="Nov 15 • 09:00 AM"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Date (for sorting)</label>
            <input
              type="date"
              required
              value={formData.eventDate}
              onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
              className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
              placeholder="IUB Main Auditorium"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Event Poster {editingId ? '(leave empty to keep existing)' : ''}
            </label>
            {previewSrc && (
              <div className="mb-3 rounded-xl overflow-hidden h-36 bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewSrc} alt="Poster preview" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="flex flex-col items-center justify-center w-full h-28 bg-[#FAFCFF] border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#1C7F93] hover:bg-[#f0f8fa] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-slate-400 mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-xs font-semibold text-slate-500">
                {imageFile ? imageFile.name : 'Click to upload poster'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 10 MB</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration (Optional)</label>
            <input
              type="text"
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: e.target.value })}
              className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
              placeholder="2 Hours"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registration Link (Optional)</label>
            <input
              type="url"
              value={formData.registrationLink}
              onChange={e => setFormData({ ...formData, registrationLink: e.target.value })}
              className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
              placeholder="https://forms.gle/..."
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all min-h-[120px]"
              placeholder="Event details..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#123962] text-white rounded-xl font-bold py-4 hover:bg-[#1C7F93] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (editingId ? 'Saving Changes...' : 'Publishing Event...') : (editingId ? 'Save Changes' : 'Publish Event')}
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
            <div
              key={event.id}
              className={`bg-white rounded-2xl p-6 border shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col sm:flex-row gap-6 items-center justify-between group transition-colors ${editingId === event.id ? 'border-[#1C7F93]' : 'border-slate-100 hover:border-[#1C7F93]/30'}`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {event.imageUrl && (
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="inline-block px-2 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-md mb-2">Live</span>
                  <h4 className="text-lg font-bold text-[#123962] truncate">{event.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{event.dateStr} &bull; {event.location}</p>
                  <p className="text-xs text-slate-400 mt-1 font-mono">ID: {event.id}</p>
                </div>
              </div>
              <div className="flex-shrink-0 flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-3 text-[#1C7F93] bg-[#1C7F93]/10 hover:bg-[#1C7F93] hover:text-white rounded-xl transition-all duration-300"
                  title="Edit Event"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
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
