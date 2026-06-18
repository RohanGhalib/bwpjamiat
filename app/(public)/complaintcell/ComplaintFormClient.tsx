'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Upload, 
  Trash2, 
  Loader2, 
  Check, 
  ShieldAlert, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  FileText,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

type ImageUploadStatus = {
  id: string;
  name: string;
  url?: string;
  loading: boolean;
  error?: boolean;
};

export default function ComplaintFormClient() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    institute: '',
    customInstitute: '',
    campus: '',
    details: ''
  });
  
  const [uploadedImages, setUploadedImages] = useState<ImageUploadStatus[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const newUploads: ImageUploadStatus[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      loading: true
    }));

    setUploadedImages(prev => [...prev, ...newUploads]);

    files.forEach(async (file, idx) => {
      const uploadId = newUploads[idx].id;
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'complaints');

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        setUploadedImages(prev => 
          prev.map(img => 
            img.id === uploadId 
              ? { ...img, url: data.fileUrl, loading: false } 
              : img
          )
        );
      } catch (err) {
        console.error('Error uploading file:', err);
        setUploadedImages(prev => 
          prev.map(img => 
            img.id === uploadId 
              ? { ...img, loading: false, error: true } 
              : img
          )
        );
      }
    });
  };

  const removeUploadedImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!isAnonymous) {
      if (!formData.name || !formData.email || !formData.phone) {
        setErrorMessage('Please fill in your name, email, and phone number.');
        setStatus('error');
        return;
      }
    }

    if (!formData.gender) {
      setErrorMessage('Please select your gender.');
      setStatus('error');
      return;
    }

    if (!formData.institute) {
      setErrorMessage('Please select your educational institution.');
      setStatus('error');
      return;
    }

    if (formData.institute === 'Other (Please Specify)' && !formData.customInstitute) {
      setErrorMessage('Please specify your institute name.');
      setStatus('error');
      return;
    }

    if (formData.institute === 'Islamia University Bahawalpur' && !formData.campus) {
      setErrorMessage('Please select your IUB campus.');
      setStatus('error');
      return;
    }

    if (!formData.details) {
      setErrorMessage('Please provide details of your query or complaint.');
      setStatus('error');
      return;
    }

    // Ensure all images are done uploading
    const stillUploading = uploadedImages.some(img => img.loading);
    if (stillUploading) {
      setErrorMessage('Please wait for images to finish uploading.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const proofs = uploadedImages
        .filter(img => !img.error && img.url)
        .map(img => img.url as string);

      const resolvedInstitute = formData.institute === 'Other (Please Specify)' 
        ? formData.customInstitute 
        : formData.institute;

      const resolvedCampus = formData.institute === 'Islamia University Bahawalpur'
        ? formData.campus
        : null;

      await addDoc(collection(db, 'complaints'), {
        isAnonymous,
        name: isAnonymous ? null : formData.name,
        email: isAnonymous ? null : formData.email,
        phone: isAnonymous ? null : formData.phone,
        gender: formData.gender,
        institute: resolvedInstitute,
        campus: resolvedCampus,
        details: formData.details,
        proofs: proofs,
        submittedAt: serverTimestamp(),
        status: 'pending'
      });

      setStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        gender: '',
        institute: '',
        customInstitute: '',
        campus: '',
        details: ''
      });
      setUploadedImages([]);
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setErrorMessage('Failed to submit complaint. Please try again later.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative overflow-hidden">
      {/* Background Ambient Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-gradient-to-bl from-[#1C7F93]/10 to-transparent blur-[120px] rounded-bl-full -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr from-[#123962]/5 to-transparent blur-[100px] rounded-tr-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Student Helpline</h2>
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-[#123962] mb-6 tracking-tight">Student Complaint Cell</h1>
          <p className="text-slate-500 font-medium leading-relaxed text-lg">
            Are you facing issues with administration, fees, infrastructure, transport, or academic harassment? Submit your complaints here. We will stand by you and raise your voice.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          
          {/* Form Section */}
          <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgba(18,57,98,0.04)] border border-slate-50 relative overflow-hidden">
            {/* Decorative Top Gradient Circle */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#1C7F93]/5 to-transparent rounded-bl-full pointer-events-none"></div>

            {status === 'success' ? (
              <div className="bg-[#1C7F93]/5 border border-[#1C7F93]/20 text-center py-12 px-6 rounded-[2rem] flex flex-col items-center animate-fade-up">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#1C7F93] to-[#123962] rounded-full flex items-center justify-center mb-6 shadow-md text-white">
                  <Check className="w-10 h-10" strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black text-[#123962] mb-3">JazakAllah Khair!</h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto text-sm leading-relaxed mb-8">
                  Your complaint/query has been logged successfully. The Jamiat Student Welfare team will review the details and take the necessary steps to resolve your issue.
                </p>

                {/* Call to Action: Join Jamiat / Volunteer */}
                <div className="w-full max-w-md bg-gradient-to-r from-[#123962] to-[#1C7F93] text-white p-8 rounded-[2rem] shadow-lg mb-8 relative overflow-hidden text-left">
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-tl-full pointer-events-none"></div>
                  <h4 className="text-lg font-extrabold mb-2">Be a Voice of Change</h4>
                  <p className="text-white/80 text-xs mb-6 leading-relaxed">
                    Join the student revolution to protect student rights, improve education standards, and invite to the path of righteousness.
                  </p>
                  <Link 
                    href="/contact" 
                    className="inline-block w-full text-center bg-white text-[#123962] hover:bg-slate-100 px-6 py-3 rounded-full font-bold text-sm shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Register as a Volunteer
                  </Link>
                </div>

                {/* Social Channels Call to Action */}
                <div className="text-left w-full max-w-md border-t border-slate-100 pt-6">
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-4 text-center">Follow our official channels</p>
                  <div className="grid grid-cols-2 gap-4">
                    <a 
                      href="https://instagram.com/jamiatstories" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shrink-0 text-white">
                        <svg fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                      </div>
                      <div>
                        <h5 className="font-extrabold text-xs text-[#123962]">Instagram</h5>
                        <p className="text-[9px] text-slate-400">@jamiatstories</p>
                      </div>
                    </a>
                    <a 
                      href="https://www.facebook.com/profile.php?id=61584553894384" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-[#1877F2] rounded-xl flex items-center justify-center shrink-0 text-white">
                        <svg fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                      </div>
                      <div>
                        <h5 className="font-extrabold text-xs text-[#123962]">Facebook</h5>
                        <p className="text-[9px] text-slate-400">Jamiat Page</p>
                      </div>
                    </a>
                  </div>
                </div>

                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-8 text-xs font-bold text-[#1C7F93] hover:underline"
                >
                  Submit Another Complaint
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="flex justify-between items-center mb-2 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-black text-[#123962]">Submit Complaint</h3>
                    <p className="text-xs text-slate-500">Provide details about your query below</p>
                  </div>
                  {/* Anonymous Submit Toggle */}
                  <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1C7F93] relative"></div>
                    <span className="text-xs font-extrabold text-[#123962]">Submit Anonymously</span>
                  </label>
                </div>

                {isAnonymous && (
                  <div className="bg-[#123962]/5 border border-[#123962]/10 rounded-2xl p-4 flex items-start space-x-3 text-[#123962]">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed font-medium">
                      <strong>Anonymity Enabled:</strong> Your name, email, and phone number are hidden. Note that we will not be able to update you on progress directly. Please provide detailed proofs below.
                    </div>
                  </div>
                )}

                {/* Personal Information (Only if NOT anonymous) */}
                {!isAnonymous && (
                  <div className="space-y-6 animate-fade-up">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#123962] ml-4 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Full Name *
                      </label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleInputChange}
                        className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
                        placeholder="Muhammad Ali"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#123962] ml-4 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> Email Address *
                        </label>
                        <input 
                          type="email" 
                          name="email" 
                          required 
                          value={formData.email} 
                          onChange={handleInputChange}
                          className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
                          placeholder="ali@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#123962] ml-4 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" /> Phone Number *
                        </label>
                        <input 
                          type="tel" 
                          name="phone" 
                          required 
                          value={formData.phone} 
                          onChange={handleInputChange}
                          className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
                          placeholder="0300 0000000"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Gender (Always Required) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#123962] ml-4 flex items-center gap-1.5">
                    Gender *
                  </label>
                  <div className="flex gap-4 ml-4">
                    <label className="flex items-center space-x-2 cursor-pointer text-sm font-semibold text-[#123962]">
                      <input 
                        type="radio" 
                        name="gender" 
                        value="Male" 
                        checked={formData.gender === 'Male'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#1C7F93] border-slate-200 focus:ring-[#1C7F93]" 
                      />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer text-sm font-semibold text-[#123962]">
                      <input 
                        type="radio" 
                        name="gender" 
                        value="Female" 
                        checked={formData.gender === 'Female'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#1C7F93] border-slate-200 focus:ring-[#1C7F93]" 
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                {/* Institute Section */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#123962] ml-4 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> Institution *
                    </label>
                    <div className="relative">
                      <select 
                        name="institute" 
                        required
                        value={formData.institute} 
                        onChange={handleInputChange}
                        className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all appearance-none text-[#123962]"
                      >
                        <option value="">Select Institution</option>
                        <option value="Islamia University Bahawalpur">Islamia University Bahawalpur</option>
                        <option value="Government Sadiq Egerton College (SE College)">Government Sadiq Egerton College (SE College)</option>
                        <option value="Government Sadiq College Women University (GSCWU)">Government Sadiq College Women University (GSCWU)</option>
                        <option value="Quaid-e-Azam Medical College (QAMC)">Quaid-e-Azam Medical College (QAMC)</option>
                        <option value="Other (Please Specify)">Other (Please Specify)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Campus Selection (Conditional on IUB) */}
                  {formData.institute === 'Islamia University Bahawalpur' && (
                    <div className="space-y-2 animate-fade-up">
                      <label className="text-xs font-bold text-[#123962] ml-4 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Campus *
                      </label>
                      <div className="relative">
                        <select 
                          name="campus" 
                          required
                          value={formData.campus} 
                          onChange={handleInputChange}
                          className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all appearance-none text-[#123962]"
                        >
                          <option value="">Select Campus</option>
                          <option value="Baghdad Campus">Baghdad Campus</option>
                          <option value="Railway Campus">Railway Campus</option>
                          <option value="Old Campus">Old Campus</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Custom Institute (Conditional on "Other") */}
                  {formData.institute === 'Other (Please Specify)' && (
                    <div className="space-y-2 animate-fade-up">
                      <label className="text-xs font-bold text-[#123962] ml-4 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" /> Specify Institute Name *
                      </label>
                      <input 
                        type="text" 
                        name="customInstitute" 
                        required 
                        value={formData.customInstitute} 
                        onChange={handleInputChange}
                        className="w-full bg-[#FAFCFF] border border-slate-100 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
                        placeholder="Type Institute Name"
                      />
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#123962] ml-4 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Query/Complaint Details *
                  </label>
                  <textarea 
                    name="details" 
                    rows={5} 
                    required
                    value={formData.details} 
                    onChange={handleInputChange}
                    className="w-full bg-[#FAFCFF] border border-slate-100 rounded-[2rem] px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all resize-none"
                    placeholder="Provide description of the issue you are facing, including dates and relevant departments if applicable..."
                  ></textarea>
                </div>

                {/* File Upload Zone */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#123962] ml-4">Attach Images as Proof (Optional)</label>
                  
                  <div className="relative border border-dashed border-slate-200 hover:border-[#1C7F93]/50 bg-[#FAFCFF] hover:bg-slate-50 rounded-[2.5rem] p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <div className="w-12 h-12 rounded-full bg-[#1C7F93]/10 text-[#1C7F93] flex items-center justify-center mb-2">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-extrabold text-[#123962] mb-0.5">Click or drag images to upload</p>
                    <p className="text-[10px] text-slate-400">PNG, JPG, JPEG up to 5MB each</p>
                  </div>

                  {/* Upload List & Thumbnails */}
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                      {uploadedImages.map((img) => (
                        <div key={img.id} className="relative group aspect-square bg-[#FAFCFF] border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                          {img.loading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70">
                              <Loader2 className="w-6 h-6 text-[#1C7F93] animate-spin" />
                              <span className="text-[9px] text-slate-400 mt-1">Uploading...</span>
                            </div>
                          ) : img.error ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-500 p-2 text-center">
                              <AlertCircle className="w-5 h-5 mb-1" />
                              <span className="text-[9px] font-bold">Failed</span>
                            </div>
                          ) : (
                            <>
                              {/* Thumbnail preview */}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={img.url} 
                                alt={img.name} 
                                className="w-full h-full object-cover" 
                              />
                              <button
                                type="button"
                                onClick={() => removeUploadedImage(img.id)}
                                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105 active:scale-95 shadow-md"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error Banner */}
                {status === 'error' && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-3 rounded-full text-xs font-semibold flex items-center space-x-2 animate-fade-up">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage || 'An error occurred. Please verify form details.'}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full relative px-8 py-4 bg-[#123962] text-white rounded-full font-bold shadow-[0_10px_30px_rgba(18,57,98,0.2)] hover:shadow-[0_20px_40px_rgba(28,127,147,0.3)] hover:-translate-y-1 transition-all duration-300 overflow-hidden group disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1C7F93] to-[#123962] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting Complaint...
                      </>
                    ) : (
                      'Submit Complaint'
                    )}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Callouts Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Islamic Quote Callout */}
            <div className="bg-[#1C7F93]/5 border border-[#1C7F93]/10 rounded-[2.5rem] p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-16 h-16 bg-[#1C7F93]/5 rounded-br-full pointer-events-none"></div>
              <svg className="w-8 h-8 text-[#1C7F93]/20 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path></svg>
              <p className="text-[#123962] font-medium text-sm leading-relaxed mb-4 italic">
                "And help one another in goodness and piety, and do not help one another in sin and aggression..."
              </p>
              <span className="text-[9px] font-black tracking-widest text-[#1C7F93] uppercase">Al-Qur'an 5:2</span>
            </div>

            {/* Helpline Contacts */}
            <div className="bg-[#123962] rounded-[2.5rem] p-8 shadow-[0_20px_40px_rgba(18,57,98,0.2)] relative overflow-hidden text-white">
              {/* Top ambient color-shift circle */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full pointer-events-none"></div>
              <h3 className="text-2xl font-extrabold mb-2 relative z-10">Jamiat Helpline</h3>
              <p className="text-white/70 text-xs mb-8 relative z-10">
                Have urgent issues requiring immediate human assistance? Reach out to our district coordinators.
              </p>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 bg-[#1C7F93]/20 rounded-xl flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#1C7F93]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">District In-charge</h4>
                    <p className="text-[10px] text-white/55">IJT Bahawalpur Office</p>
                  </div>
                </div>

                <a 
                  href="https://instagram.com/jamiatstories" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shrink-0 text-white">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs">Jamiat Stories</h4>
                    <p className="text-[10px] text-white/55">Follow us on Instagram</p>
                  </div>
                </a>

                <a 
                  href="https://www.facebook.com/profile.php?id=61584553894384" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 bg-[#1877F2] rounded-xl flex items-center justify-center shrink-0 text-white">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs">Jamiat Bahawalpur</h4>
                    <p className="text-[10px] text-white/55">Connect on Facebook</p>
                  </div>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
