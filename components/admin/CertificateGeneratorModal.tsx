"use client";

import React, { useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import CertificateTemplate from '@/components/ember/CertificateTemplate';
import toast from 'react-hot-toast';

interface CertificateRequest {
  id: string;
  name: string;
  department: string;
  email?: string;
  certificateType?: 'Appreciation' | 'Participation';
}

interface CertificateGeneratorModalProps {
  request: CertificateRequest;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CertificateGeneratorModal({ request, onClose, onSuccess }: CertificateGeneratorModalProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    if (!certificateRef.current) return null;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const dataUrl = await htmlToImage.toPng(certificateRef.current, {
      quality: 1.0,
      pixelRatio: 2, 
    });

    const pdf = new jsPDF('landscape', 'mm', 'a4');
    pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210);
    return pdf;
  };

  const downloadCertificate = async () => {
    setGenerating(true);
    const toastId = toast.loading("Generating PDF...");

    try {
      const pdf = await generatePDF();
      if (pdf) {
        pdf.save(`Ember_Certificate_${request.name.replace(/\s+/g, '_')}.pdf`);
      }
      toast.success("Certificate downloaded!", { id: toastId });
      onSuccess();
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate certificate.", { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const approveAndEmail = async () => {
    if (!request.email) {
      toast.error("No email address provided for this request.");
      return;
    }
    
    setGenerating(true);
    const toastId = toast.loading("Generating & Emailing PDF...");

    try {
      const pdf = await generatePDF();
      if (!pdf) throw new Error("PDF generation failed");
      
      const base64PDF = pdf.output('datauristring');
      
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: request.email,
          type: 'certificate_approved',
          data: {
             name: request.name,
             attachmentBase64: base64PDF
          }
        })
      });

      if (!res.ok) throw new Error("Email sending failed");

      toast.success("Certificate generated and emailed!", { id: toastId });
      onSuccess();
    } catch (error) {
      console.error("Email error:", error);
      toast.error("Failed to send email.", { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative max-w-[1200px] w-full flex flex-col items-center gap-8 py-10">
        
        {/* Controls */}
        <div className="flex gap-4 items-center bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          {request.email && (
            <button
              onClick={approveAndEmail}
              disabled={generating}
              className="px-6 py-3 bg-green-600/20 text-green-500 font-bold rounded-xl hover:bg-green-600/30 transition-all flex items-center gap-2 shadow-xl border border-green-500/20"
            >
              {generating ? "PROCESSING..." : "APPROVE & EMAIL"}
            </button>
          )}
          <button
            onClick={downloadCertificate}
            disabled={generating}
            className="px-8 py-3 bg-[#1C7F93] text-white font-bold rounded-xl hover:bg-[#1C7F93]/80 transition-all flex items-center gap-2 shadow-xl"
          >
            {generating ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            )}
            {generating ? "GENERATING..." : "DOWNLOAD PDF"}
          </button>
        </div>

        {/* Certificate Preview (Scale down for UI) */}
        <div className="scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-top shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
           <CertificateTemplate 
             ref={certificateRef}
             name={request.name}
             department={request.department}
             id={request.id}
             type={request.certificateType}
           />
        </div>

        {/* Hidden high-res version is the same ref, we just let it render full size in this container */}
      </div>
    </div>
  );
}
