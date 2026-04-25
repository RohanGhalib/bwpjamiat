import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getTaranaById } from "@/lib/db";
import { absoluteUrl, siteConfig } from "@/lib/site";

type TaranaPageProps = {
  params: Promise<{ id: string }>;
};

function buildTaranaDescription(title: string, artist?: string, duration?: string) {
  const parts = [artist || "IJT Bahawalpur", duration].filter(Boolean);
  const suffix = parts.length > 0 ? ` by ${parts.join(" - ")}` : "";
  return `Listen to "${title}"${suffix} on ${siteConfig.name}.`;
}

export async function generateMetadata({ params }: TaranaPageProps): Promise<Metadata> {
  const { id } = await params;
  const tarana = await getTaranaById(id);

  if (!tarana) {
    return {
      title: `Tarana Not Found | ${siteConfig.name}`,
      description: "The requested tarana could not be found.",
    };
  }

  const pageUrl = absoluteUrl(`/taranas/${tarana.id}`);
  const imageUrl = tarana.coverUrl || absoluteUrl(siteConfig.defaultOgImage);
  const description = buildTaranaDescription(tarana.title, tarana.artist, tarana.duration);

  return {
    title: `${tarana.title} | ${siteConfig.name}`,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: tarana.title,
      description,
      url: pageUrl,
      siteName: siteConfig.name,
      locale: "en_PK",
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: tarana.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tarana.title,
      description,
      images: [imageUrl],
    },
    keywords: [tarana.title, tarana.artist, "IJT Bahawalpur tarana"].filter(Boolean) as string[],
  };
}

function TaranaPageFallback() {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(18,57,98,0.06)] overflow-hidden animate-pulse">
      <div className="grid md:grid-cols-[360px_1fr] gap-0">
        <div className="aspect-square bg-slate-200"></div>
        <div className="p-8 md:p-10">
          <div className="h-3 w-28 bg-slate-200 rounded-full mb-5"></div>
          <div className="h-12 w-3/4 bg-slate-200 rounded-2xl mb-4"></div>
          <div className="h-4 w-1/3 bg-slate-200 rounded-full mb-8"></div>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="h-24 bg-slate-100 rounded-2xl"></div>
            <div className="h-24 bg-slate-100 rounded-2xl"></div>
          </div>
          <div className="h-12 w-full bg-slate-100 rounded-xl mb-6"></div>
          <div className="flex gap-3">
            <div className="h-12 flex-1 bg-slate-200 rounded-full"></div>
            <div className="h-12 flex-1 bg-slate-100 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function TaranaContent({ params }: TaranaPageProps) {
  const { id } = await params;
  const tarana = await getTaranaById(id);

  if (!tarana) {
    notFound();
  }

  const openInGalleryUrl = `/taranas?play=${encodeURIComponent(tarana.id)}`;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(18,57,98,0.06)] overflow-hidden">
      <div className="grid md:grid-cols-[360px_1fr] gap-0">
        <div className="relative aspect-square bg-gradient-to-br from-[#123962] to-[#1C7F93]">
          {tarana.coverUrl ? (
            <Image
              src={tarana.coverUrl}
              alt={tarana.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 360px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/25">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24">
                <path d="M12 3a1 1 0 011 1v10.382A3.999 3.999 0 1111 11V6.618l6-1.5V4a1 1 0 112 0v8.382A3.999 3.999 0 1117 9V5.78l-4 1V16a4 4 0 11-1-13Z" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-8 md:p-10 flex flex-col">
          <span className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">
            Shared Tarana
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[#123962] tracking-tight mb-3">
            {tarana.title}
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.18em] text-xs mb-8">
            {tarana.artist || "IJT Bahawalpur"}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.18em] mb-2">Duration</p>
              <p className="text-lg font-bold text-[#123962]">{tarana.duration || "Unknown"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.18em] mb-2">Tags</p>
              <p className="text-lg font-bold text-[#123962]">
                {tarana.tags?.length ? tarana.tags.join(", ") : "Official Tarana"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <Link
              href={openInGalleryUrl}
              className="inline-flex items-center justify-center px-6 py-3 bg-[#123962] text-white rounded-full font-bold hover:bg-[#1C7F93] transition-all"
            >
              Listen Now
            </Link>
            <Link
              href="/taranas"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#123962] border border-slate-200 rounded-full font-bold hover:border-[#1C7F93]/30 hover:text-[#1C7F93] transition-all"
            >
              Browse Taranas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TaranaPage({ params }: TaranaPageProps) {
  return (
    <div className="min-h-screen bg-transparent pt-36 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-gradient-to-bl from-[#1C7F93]/10 to-transparent blur-[120px] rounded-bl-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <Link
          href="/taranas"
          className="inline-flex items-center gap-2 text-[#1C7F93] hover:text-[#123962] font-bold text-sm mb-8"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Taranas
        </Link>

        <Suspense fallback={<TaranaPageFallback />}>
          <TaranaContent params={params} />
        </Suspense>
      </div>
    </div>
  );
}
