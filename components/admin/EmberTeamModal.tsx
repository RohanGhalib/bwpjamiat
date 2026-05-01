"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { uploadFileDirectToR2 } from '@/lib/upload-client';
import toast from 'react-hot-toast';
import axios from 'axios';
import { EmberMember } from '@/lib/types';
import { revalidateTeam } from '@/app/actions/revalidate';

const departments = [
  "Leadership",
  "Executive Council",
  "Management",
  "Logistics",
  "Media",
  "Marketing & Branding",
  "Outreach",
  "Security",
  "Discipline"
];

const emptyForm = {
  name: '',
  role: '',
  department: 'Management',
  img: '',
  imageStoragePath: '',
  gender: 'boy' as 'boy' | 'girl',
  order: 0
};

interface EmberTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: EmberMember | null;
}

export default function EmberTeamModal({ isOpen, onClose, memberToEdit }: EmberTeamModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (memberToEdit) {
        setFormData({
          name: memberToEdit.name || '',
          role: memberToEdit.role || '',
          department: memberToEdit.department || 'Management',
          img: memberToEdit.img || '',
          imageStoragePath: (memberToEdit as any).imageStoragePath || '',
          gender: memberToEdit.gender || 'boy',
          order: memberToEdit.order || 0
        });
      } else {
        setFormData(emptyForm);
      }
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
    }
  }, [isOpen, memberToEdit]);

  useEffect(() => {
    if (!selectedImageFile) {
      setImagePreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImageFile);
    setImagePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(null);

    try {
      let img = formData.img.trim();
      let imageStoragePath = formData.imageStoragePath;

      if (selectedImageFile) {
        const response = await uploadFileDirectToR2({
          file: selectedImageFile,
          folder: 'ember/team',
          onProgress: (percentCompleted) => {
            setUploadProgress(percentCompleted);
          }
        });

        img = response.fileUrl;
        imageStoragePath = response.storagePath;
      }

      if (!img) {
        throw new Error('Please upload a profile picture.');
      }

      const payload = {
        ...formData,
        img,
        imageStoragePath,
        updatedAt: new Date().toISOString()
      };

      if (memberToEdit) {
        toast.loading('Updating member...', { id: 'save-member' });
        await updateDoc(doc(db, 'ember_team', memberToEdit.id), payload);
        toast.success('Member updated successfully!', { id: 'save-member' });

        // Cleanup old image if replaced
        if ((memberToEdit as any).imageStoragePath && (memberToEdit as any).imageStoragePath !== imageStoragePath) {
          try {
            await axios.post('/api/delete-file', { key: (memberToEdit as any).imageStoragePath });
          } catch (storageError) {
            console.warn('Could not remove replaced image.', storageError);
          }
        }
      } else {
        toast.loading('Adding member...', { id: 'save-member' });
        const teamCollection = collection(db, 'ember_team');
        const newMemberRef = doc(teamCollection);
        await setDoc(newMemberRef, {
          ...payload,
          createdAt: new Date().toISOString()
        });
        toast.success('Member added successfully!', { id: 'save-member' });
      }

      await revalidateTeam();
      router.refresh();
      onClose();
    } catch (error: any) {
      console.error("Error saving member: ", error);
      toast.error(`Failed to save member: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  if (!isOpen) return null;

  const previewImage = imagePreviewUrl || formData.img;

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

        <h3 className="text-2xl font-black text-[#123962] mb-2">{memberToEdit ? 'Edit Team Member' : 'Add New Member'}</h3>
        <p className="text-sm text-slate-500 mb-8">Set up profile details and assign to a department.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
                placeholder="Rohan Ghalib"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specific Role</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
                placeholder="Director Logistics"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all appearance-none"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gender Category</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.gender === 'boy'}
                    onChange={() => setFormData({ ...formData, gender: 'boy' })}
                    className="w-4 h-4 text-[#1C7F93] focus:ring-[#1C7F93]"
                  />
                  <span className="text-sm font-medium text-slate-700">Boy Team</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.gender === 'girl'}
                    onChange={() => setFormData({ ...formData, gender: 'girl' })}
                    className="w-4 h-4 text-[#1C7F93] focus:ring-[#1C7F93]"
                  />
                  <span className="text-sm font-medium text-slate-700">Girl Team</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Profile Picture</label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setSelectedImageFile(e.target.files?.[0] || null)}
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

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sort Order (Lower appears first)</label>
            <input
              type="number"
              value={formData.order}
              onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1C7F93] focus:ring-1 focus:ring-[#1C7F93] transition-all"
              placeholder="0"
            />
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
              {loading ? 'Saving...' : memberToEdit ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
