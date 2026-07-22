import Image from 'next/image';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Parwaaz - Coming Soon | IJT Bahawalpur',
  description: 'Parwaaz Career Counselling Seminar - Coming Soon. Stay tuned for career guidance, university admission advice, and expert mentoring.',
  path: '/parwaaz',
});

export default function ParwaazComingSoonPage() {
  return (
    <main className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden py-16 px-4">
      {/* Background Graphic Texture */}
      <div className="absolute inset-0 -z-10">
        <Image 
          src="/parwaaz/greenbg.png" 
          alt="Green Backdrop" 
          fill
          priority
          className="object-cover object-center scale-105"
        />
        {/* Subtle vignette/depth overlay */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      {/* Main Content Layout Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full animate-page-reveal">
        
        {/* Coming Soon Calligraphy Logo Graphic */}
        <div className="relative w-[290px] sm:w-[380px] md:w-[460px] aspect-[4/3] mb-4 flex items-center justify-center">
          <Image 
            src="/parwaaz/logoparwaaz.png" 
            alt="Parwaaz Coming Soon Logo" 
            fill
            priority
            className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
          />
        </div>

        {/* URL Text */}
        <div className="mb-6">
          <a 
            href="/parwaaz" 
            className="text-white hover:text-amber-200 text-lg sm:text-xl font-bold tracking-wider hover:underline transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          >
            bwpjamiat.org/parwaaz
          </a>
        </div>

        {/* Noor Mahal Outline Watermark */}
        <div className="relative w-[220px] sm:w-[280px] aspect-[3/1] opacity-75 mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
          <Image 
            src="/parwaaz/noormahalparwaz.png" 
            alt="Noor Mahal Watermark outline" 
            fill
            className="object-contain"
          />
        </div>

        {/* Social Marks */}
        <div className="flex items-center gap-3 text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          <div className="flex gap-2.5 items-center">
            {/* Instagram SVG Icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.344 3.608 1.32.977.974 1.258 2.241 1.32 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.367-.343 2.634-1.32 3.608-.975.976-2.242 1.258-3.608 1.32-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.344-3.608-1.32-.976-.974-1.258-2.241-1.32-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.367.344-2.634 1.32-3.608.974-.976 2.242-1.258 3.608-1.32 1.266-.058 1.646-.07 4.85-.07Zm0-2.163C8.741 0 8.333.014 7.053.072 5.093.161 3.424.636 2.052 2.008.68 3.38.204 5.05.115 7.009.057 8.29 0 8.697 0 11.956c0 3.259.057 3.667.115 4.947.089 1.959.565 3.629 1.937 5.001 1.372 1.372 3.041 1.847 5.001 1.937 1.28.058 1.687.072 4.947.072 3.26 0 3.668-.014 4.947-.072 1.96-.09 3.63-.565 5.002-1.937 1.372-1.372 1.847-3.042 1.937-5.001.058-1.28.072-1.688.072-4.947 0-3.26-.014-3.668-.072-4.947-.09-1.96-.565-3.63-1.937-5.002C20.631.636 18.961.161 17.002.072 15.722.014 15.314 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324Zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm3.948-9.066a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
            </svg>
            {/* Facebook SVG Icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-wider">/jamiatbwp</span>
        </div>

      </div>
    </main>
  );
}
