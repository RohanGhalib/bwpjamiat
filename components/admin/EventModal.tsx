"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { fromDateTimeLocalValue, toDateTimeLocalValue, type EventRecord } from '@/lib/event-utils';
import { uploadFileDirectToR2 } from '@/lib/upload-client';
import toast from 'react-hot-toast';
import axios from 'axios';

const emptyForm = {
  title: '',
  dateStr: '',
  startsAt: '',
  location: '',
  imageUrl: '',
  imageStoragePath: '',
  isActive: true,
  duration: '',
  registrationLink: '',
  description: ''
};

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: EventRecord | null;
}

export default function EventModal({ isOpen, onClose, eventToEdit }: EventModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedPosterFile, setSelectedPosterFile] = useState<File | null>(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        setFormData({
          title: eventToEdit.title || '',
          dateStr: eventToEdit.dateStr || '',
          startsAt: toDateTimeLocalValue(eventToEdit.startsAt),
          location: eventToEdit.location || '',
          imageUrl: eventToEdit.imageUrl || '',
          imageStoragePath: eventToEdit.imageStoragePath || '',
          isActive: eventToEdit.isActive !== false,
          duration: eventToEdit.duration || '',
          registrationLink: eventToEdit.registrationLink || '',
          description: eventToEdit.description || ''
        });
      } else {
        setFormData(emptyForm);
      }
      setSelectedPosterFile(null);
      setPosterPreviewUrl(null);
    }
  }, [isOpen, eventToEdit]);

  useEffect(() => {
    if (!selectedPosterFile) {
      setPosterPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedPosterFile);
    setPosterPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedPosterFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(null);

    try {
      const normalizedStartsAt = fromDateTimeLocalValue(formData.startsAt);

      if (!normalizedStartsAt) {
        throw new Error('Please add a valid event date and time.');
      }

      let imageUrl = formData.imageUrl.trim();
      let imageStoragePath = formData.imageStoragePath;

      if (selectedPosterFile) {
        const response = await uploadFileDirectToR2({
          file: selectedPosterFile,
          onProgress: (percentCompleted) => {
            setUploadProgress(percentCompleted);
          }
        });

        imageUrl = response.fileUrl;
        imageStoragePath = response.storagePath;
      }

      if (!imageUrl) {
        throw new Error('Please upload a poster image or provide a fallback poster URL.');
      }

      const payload = {
        ...formData,
        startsAt: normalizedStartsAt,
        imageUrl,
        imageStoragePath,
        updatedAt: new Date().toISOString()
      };

      if (eventToEdit) {
        toast.loading('Updating event...', { id: 'save-event' });
        await updateDoc(doc(db, 'events', eventToEdit.id), payload);
        toast.success('Event updated successfully!', { id: 'save-event' });

        // Cleanup old image if replaced
        if (eventToEdit.imageStoragePath && eventToEdit.imageStoragePath !== imageStoragePath) {
          try {
            await axios.post('/api/delete-file', { key: eventToEdit.imageStoragePath });
          } catch (storageError) {
            console.warn('Could not remove replaced poster.', storageError);
          }
        }
      } else {
        toast.loading('Creating event...', { id: 'save-event' });
        await addDoc(collection(db, 'events'), {
          ...payload,
          createdAt: new Date().toISOString()
        });
        toast.success('Event created successfully!', { id: 'save-event' });
      }

      router.refresh();
      onClose();
    } catch (error: any) {
      console.error("Error saving event: ", error);
      toast.error(`Failed to save event: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  if (!isOpen) return null;

  const previewImage = posterPreviewUrl || formData.imageUrl;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl w-full max-w-2xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-2xl font-black text-[#123962] mb-2">{eventToEdit ? 'Edit Event' : 'Create New Event'}</h3>
        <p className="text-sm text-slate-500 mb-8">Fill in the details below. Posters are automatically optimized for display.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
                placeholder="Capture BWP 2.0"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Date</label>
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Start Date & Time</label>
              <input
                type="datetime-local"
                required
                value={formData.startsAt}
                onChange={e => setFormData({ ...formData, startsAt: e.target.value })}
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
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Poster Upload</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setSelectedPosterFile(e.target.files?.[0] || null)}
                  className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#1C7F93]/10 file:text-[#1C7F93] hover:file:bg-[#1C7F93]/20"
                />

                {uploadProgress !== null && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs font-bold text-[#1C7F93] mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-[#1C7F93] h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              {previewImage && (
                <div className="w-24 h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 relative group">
                  <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
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
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all min-h-[120px] resize-y"
              placeholder="Event details..."
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 text-slate-500 font-bold py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-[#123962] text-white rounded-xl font-bold py-4 hover:bg-[#1C7F93] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {loading ? 'Saving...' : eventToEdit ? 'Save Changes' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
