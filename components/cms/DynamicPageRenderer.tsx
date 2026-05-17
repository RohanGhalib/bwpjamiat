import Link from 'next/link';
import type { CmsPageRecord } from '@/lib/cms-types';

export default function DynamicPageRenderer({ page }: { page: CmsPageRecord }) {
  return (
    <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Dynamic Page</h2>
          <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">{page.title}</h1>
          {page.warning ? (
            <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              {page.warning}
            </p>
          ) : null}
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
          {page.contentHtml ? (
            <div
              className="prose max-w-none prose-slate"
              dangerouslySetInnerHTML={{ __html: page.contentHtml }}
            />
          ) : (
            <p className="text-slate-600 whitespace-pre-wrap">{page.contentText || 'No content has been added yet.'}</p>
          )}

          {page.type === 'event_dedicated' && page.eventRef ? (
            <Link
              href={`/events/${page.eventRef}`}
              className="inline-flex mt-8 px-6 py-3 bg-[#123962] text-white rounded-xl font-bold hover:bg-[#1C7F93] transition-colors"
            >
              View Event Details
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

