import { Suspense } from 'react';
import SiteStructureManager from '@/components/admin/SiteStructureManager';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminSiteStructurePage() {
  return (
    <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="mb-16">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Content Management System</h2>
          <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Site Structure</h1>
          <p className="text-slate-500 font-medium">Manage links, pages, redirects, and endpoint safety in one place.</p>
        </div>
        <Suspense fallback={<LoadingSpinner className="py-20" label="Loading site structure..." />}>
          <SiteStructureManager />
        </Suspense>
      </div>
    </div>
  );
}

