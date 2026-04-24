"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Tarana } from '@/lib/types';
import toast from 'react-hot-toast';
import axios from 'axios';

const emptyForm = {
  title: '',
  artist: '',
  duration: '',
  tags: '',
  audioUrl: '',
};

interface TaranaModalProps {
  isOpen: boolean;
  onClose: () => void;
  taranaToEdit?: Tarana | null;
}

export default function TaranaModal({ isOpen, onClose, taranaToEdit }: TaranaModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (taranaToEdit) {
        setFormData({
          title: taranaToEdit.title || '',
          artist: taranaToEdit.artist || '',
          duration: taranaToEdit.duration || '',
          tags: taranaToEdit.tags?.join(', ') || '',
          audioUrl: taranaToEdit.audioUrl || '',
        });
      } else {
        setFormData(emptyForm);
      }
      setSelectedAudioFile(null);
      setUploadProgress(null);
    }
  }, [isOpen, taranaToEdit]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedAudioFile(file);

    if (file) {
      // Automatically detect and set the duration
      const objectUrl = URL.createObjectURL(file);
      const media = document.createElement(file.type.startsWith('video') ? 'video' : 'audio');
      media.src = objectUrl;
      
      media.onloadedmetadata = () => {
        const totalSeconds = Math.floor(media.duration);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        const formattedDuration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        setFormData(prev => ({ ...prev, duration: formattedDuration }));
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      // If no file selected and not editing, reset duration
      if (!taranaToEdit) {
        setFormData(prev => ({ ...prev, duration: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(null);

    try {
      let finalAudioUrl = formData.audioUrl;

      if (!taranaToEdit || selectedAudioFile) {
        if (!selectedAudioFile) {
          throw new Error('Please upload an audio or video file.');
        } else {
          const isVideo = selectedAudioFile.type.startsWith('video');
          const uploadData = new FormData();
          uploadData.append('file', selectedAudioFile);
          
          if (!isVideo) {
            uploadData.append('folder', 'taranas');
          }
          
          const endpoint = isVideo ? '/api/taranas/extract' : '/api/upload';
          
          const response = await axios.post(endpoint, uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
              }
            }
          });
          finalAudioUrl = response.data.fileUrl;
        }
      }

      if (!finalAudioUrl) {
        throw new Error('No audio URL found. Please provide an audio file.');
      }

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const payload = {
        title: formData.title,
        artist: formData.artist,
        duration: formData.duration,
        tags: tagsArray,
        audioUrl: finalAudioUrl,
        updatedAt: new Date().toISOString()
      };

      if (taranaToEdit) {
        toast.loading('Updating tarana...', { id: 'save-tarana' });
        await updateDoc(doc(db, 'taranas', taranaToEdit.id), payload);
        toast.success('Tarana updated successfully!', { id: 'save-tarana' });
      } else {
        toast.loading('Creating tarana...', { id: 'save-tarana' });
        await addDoc(collection(db, 'taranas'), {
          ...payload,
          createdAt: new Date().toISOString()
        });
        toast.success('Tarana created successfully!', { id: 'save-tarana' });
      }

      router.refresh();
      onClose();
    } catch (error: any) {
      console.error("Error saving tarana: ", error);
      toast.error(`Failed to save: ${error.response?.data?.error || error.message || 'Unknown error'}`, { id: 'save-tarana' });
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  if (!isOpen) return null;

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

        <h3 className="text-2xl font-black text-[#123962] mb-2">{taranaToEdit ? 'Edit Tarana' : 'Add New Tarana'}</h3>
        <p className="text-sm text-slate-500 mb-8">Manage the details and audio source for this Tarana.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
                placeholder="Jamiat Tarana"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Artist</label>
              <input
                type="text"
                value={formData.artist || ''}
                onChange={e => setFormData({ ...formData, artist: e.target.value })}
                className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
                placeholder="Rohan Ghalib"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags || ''}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
                placeholder="Urdu, Motivational"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Audio Source</label>
            
            <div>
              <input
                type="file"
                accept="audio/*, video/*"
                onChange={handleFileChange}
                required={!taranaToEdit}
                className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#1C7F93]/10 file:text-[#1C7F93] hover:file:bg-[#1C7F93]/20"
              />

              {uploadProgress !== null && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs font-bold text-[#1C7F93] mb-1">
                    <span>
                      {selectedAudioFile?.type.startsWith('video') && uploadProgress === 100 
                        ? 'Extracting Audio (Please wait...)' 
                        : 'Uploading...'}
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-[#1C7F93] h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
            
            {formData.duration && (
               <p className="text-xs font-bold text-[#1C7F93] mt-2">
                  Duration automatically detected: {formData.duration}
               </p>
            )}

            {taranaToEdit && taranaToEdit.audioUrl && !selectedAudioFile && (
              <p className="text-xs text-slate-500 mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <strong>Current Audio:</strong> {taranaToEdit.audioUrl.substring(0, 50)}...
              </p>
            )}
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
              className="flex-[2] bg-[#123962] text-white rounded-xl font-bold py-4 hover:bg-[#1C7F93] hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {loading ? 'Saving...' : taranaToEdit ? 'Save Changes' : 'Publish Tarana'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
