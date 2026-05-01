"use client";

import Image from "next/image";
import localFont from "next/font/local";

const dreamPlanner = localFont({
  src: "../../public/dreamplanner.otf",
  display: "swap",
});

export default function TeamCard({ name, role, img, delay = 0, size = "md", prominent = false, polished = false }: { name: string, role: string, img: string, delay?: number, size?: "sm" | "md" | "lg", prominent?: boolean, polished?: boolean }) {
  const sizeClasses = prominent ? "min-w-[300px] sm:min-w-[400px]" : size === "lg" ? "min-w-[280px]" : size === "sm" ? "min-w-[180px]" : "min-w-[220px]";
  
  return (
    <div 
      className="flex flex-col items-center group animate-fade-up w-full max-w-fit mx-auto" 
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`relative p-2 sm:p-4 rounded-xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:scale-[1.03] ${prominent ? "border-2 border-[var(--c-accent)]/30 group-hover:border-[var(--c-accent)]" : polished ? "border border-[var(--c-accent)]/20" : ""} ${sizeClasses}`}
        style={{
          background: prominent 
            ? "linear-gradient(135deg, #1a0f05 0%, #3d2710 50%, #1a0f05 100%)"
            : "linear-gradient(135deg, #5D3A1A 0%, #8B5E3C 25%, #4A2E15 50%, #C49A6C 75%, #5D3A1A 100%)",
          border: prominent ? "none" : polished ? "1px solid rgba(230, 106, 46, 0.3)" : "2px solid #3d2710"
        }}>
        {prominent && (
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--c-accent)]/20 via-transparent to-[var(--c-orange)]/20 rounded-xl pointer-events-none" />
        )}
        {polished && !prominent && (
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--c-accent)]/5 to-transparent rounded-xl pointer-events-none" />
        )}
        <div className="relative aspect-[4/5] w-full bg-[#1a0f05] rounded-lg overflow-hidden">
          <Image
            src={img}
            alt={name}
            fill
            className="object-cover sepia-[0.1] brightness-90 group-hover:brightness-105 group-hover:sepia-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        </div>
      </div>
      <div className="mt-8 text-center px-6">
        <h3 className={`${dreamPlanner.className} text-white ${prominent ? "text-4xl sm:text-5xl lg:text-6xl" : "text-2xl sm:text-3xl"} mb-2 group-hover:text-[var(--c-accent)] transition-colors duration-300`}>
          {name}
        </h3>
        <p className={`${prominent ? "text-sm sm:text-base lg:text-lg" : "text-[10px] sm:text-xs"} text-[var(--c-accent)] tracking-[0.2em] uppercase font-bold opacity-70 group-hover:opacity-100 transition-opacity`}>
          {role}
        </p>
      </div>
    </div>
  );
}
