"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/aghaz', label: 'Aghaz' },
  { href: '/taranas', label: 'Taranas' },
  { href: '/literature', label: 'Literature' },
  { href: '/articles', label: 'Articles' },
  { href: '/events', label: 'Events' },
  { href: '/lms', label: 'LMS' },
];

type Rgb = [number, number, number];

type NavTint = {
  gradientA: string;
  gradientB: string;
  accent: string;
};

const defaultTint: NavTint = {
  gradientA: 'rgb(28 74 159)',
  gradientB: 'rgb(16 130 146)',
  accent: 'rgb(191 146 78)',
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toRgb(value: Rgb) {
  return `rgb(${value[0]} ${value[1]} ${value[2]})`;
}

function adjustColor(rgb: Rgb, delta: number): Rgb {
  return [
    clamp(rgb[0] + delta, 0, 255),
    clamp(rgb[1] + delta, 0, 255),
    clamp(rgb[2] + delta, 0, 255),
  ];
}

function parseRgb(input: string): Rgb | null {
  const match = input.match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;
  const channels = match[1]
    .split(',')
    .slice(0, 3)
    .map((part) => Number(part.trim()));
  if (channels.length !== 3 || channels.some((channel) => Number.isNaN(channel))) return null;
  return [channels[0], channels[1], channels[2]];
}

function hasVisibleBackground(color: string) {
  return !/rgba\([^)]*,\s*0\s*\)$/i.test(color) && color !== 'transparent';
}

function parseObjectPosition(position: string): { x: number; y: number } {
  const tokens = position.split(' ').filter(Boolean);
  const rawX = tokens[0] ?? '50%';
  const rawY = tokens[1] ?? '50%';

  const toRatio = (token: string, isY: boolean) => {
    if (token.endsWith('%')) {
      const value = Number(token.replace('%', ''));
      if (!Number.isNaN(value)) return clamp(value / 100, 0, 1);
    }
    if (token === 'left' || token === 'top') return 0;
    if (token === 'center') return 0.5;
    if (token === 'right' || token === 'bottom') return 1;
    return isY ? 0.5 : 0.5;
  };

  return { x: toRatio(rawX, false), y: toRatio(rawY, true) };
}

function sampleImagePixel(img: HTMLImageElement, clientX: number, clientY: number, ctx: CanvasRenderingContext2D) {
  if (!img.complete || !img.naturalWidth || !img.naturalHeight) return null;

  const rect = img.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;

  const style = getComputedStyle(img);
  const objectFit = style.objectFit || 'fill';
  const objectPosition = parseObjectPosition(style.objectPosition || '50% 50%');

  let drawWidth = rect.width;
  let drawHeight = rect.height;
  let offsetX = 0;
  let offsetY = 0;

  if (objectFit === 'cover' || objectFit === 'contain') {
    const scale =
      objectFit === 'cover'
        ? Math.max(rect.width / img.naturalWidth, rect.height / img.naturalHeight)
        : Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight);

    drawWidth = img.naturalWidth * scale;
    drawHeight = img.naturalHeight * scale;
    offsetX = (rect.width - drawWidth) * objectPosition.x;
    offsetY = (rect.height - drawHeight) * objectPosition.y;
  }

  const pixelX = clamp((clientX - rect.left - offsetX) * (img.naturalWidth / drawWidth), 0, img.naturalWidth - 1);
  const pixelY = clamp((clientY - rect.top - offsetY) * (img.naturalHeight / drawHeight), 0, img.naturalHeight - 1);

  try {
    ctx.clearRect(0, 0, 1, 1);
    ctx.drawImage(img, Math.floor(pixelX), Math.floor(pixelY), 1, 1, 0, 0, 1, 1);
    const data = ctx.getImageData(0, 0, 1, 1).data;
    return [data[0], data[1], data[2]] as Rgb;
  } catch {
    return null;
  }
}

function mixColors(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function luminance(rgb: Rgb) {
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
}

function buildTintFromBase(base: Rgb): NavTint {
  const deep = adjustColor(base, -34);
  const soft = adjustColor(base, 24);
  const accent = adjustColor(base, 52);

  return {
    gradientA: toRgb(mixColors(deep, base, 0.55)),
    gradientB: toRgb(mixColors(base, soft, 0.5)),
    accent: toRgb(accent),
  };
}

function HeaderContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [navTint, setNavTint] = useState<NavTint>(defaultTint);
  const [sampledBase, setSampledBase] = useState<Rgb>([120, 140, 165]);
  const headerRef = useRef<HTMLElement | null>(null);
  const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastSampleRef = useRef<number>(0);
  const pathname = usePathname();

  useEffect(() => {
    if (!sampleCanvasRef.current) {
      sampleCanvasRef.current = document.createElement('canvas');
      sampleCanvasRef.current.width = 1;
      sampleCanvasRef.current.height = 1;
    }

    const sampleBehindHeader = () => {
      const header = headerRef.current;
      const canvas = sampleCanvasRef.current;
      if (!header || !canvas) return;

      const rect = header.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const samplePoints = [0.2, 0.5, 0.8].map((ratio) => ({
        x: rect.left + rect.width * ratio,
        y: rect.top + rect.height * 0.55,
      }));

      const samples: Rgb[] = [];

      for (const point of samplePoints) {
        const elements = document.elementsFromPoint(point.x, point.y);

        for (const element of elements) {
          if (header.contains(element)) continue;
          if (!(element instanceof HTMLElement)) continue;

          if (element instanceof HTMLImageElement) {
            const imageColor = sampleImagePixel(element, point.x, point.y, ctx);
            if (imageColor) {
              samples.push(imageColor);
              break;
            }
          }

          const background = getComputedStyle(element).backgroundColor;
          if (!hasVisibleBackground(background)) continue;

          const parsed = parseRgb(background);
          if (parsed) {
            samples.push(parsed);
            break;
          }
        }
      }

      if (!samples.length) {
        setNavTint(defaultTint);
        setSampledBase([120, 140, 165]);
        return;
      }

      const average: Rgb = [
        Math.round(samples.reduce((sum, color) => sum + color[0], 0) / samples.length),
        Math.round(samples.reduce((sum, color) => sum + color[1], 0) / samples.length),
        Math.round(samples.reduce((sum, color) => sum + color[2], 0) / samples.length),
      ];

      setNavTint(buildTintFromBase(average));
      setSampledBase(average);
    };

    const requestSample = () => {
      const now = Date.now();
      if (now - lastSampleRef.current < 120) return;
      lastSampleRef.current = now;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(sampleBehindHeader);
    };

    requestSample();
    const timeoutId = window.setTimeout(requestSample, 140);
    window.addEventListener('scroll', requestSample, { passive: true });
    window.addEventListener('resize', requestSample);

    return () => {
      window.removeEventListener('scroll', requestSample);
      window.removeEventListener('resize', requestSample);
      window.clearTimeout(timeoutId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pathname]);

  const navShadow = useMemo(
    () => `0 12px 38px color-mix(in srgb, ${navTint.gradientA} 20%, rgba(0,0,0,0.2) 80%)`,
    [navTint]
  );

  const isDarkBackdrop = useMemo(() => luminance(sampledBase) < 128, [sampledBase]);
  const textPrimaryClass = isDarkBackdrop ? 'text-[#f7f4ec]' : 'text-[#123962]';
  const textSecondaryClass = isDarkBackdrop ? 'text-[#e8dcc8]/85' : 'text-slate-500';
  const hoverBgClass = isDarkBackdrop ? 'hover:bg-white/10' : 'hover:bg-slate-100/60';
  const mobileHoverBgClass = isDarkBackdrop ? 'hover:bg-white/12' : 'hover:bg-slate-100';
  const mobileDividerClass = isDarkBackdrop ? 'border-white/20' : 'border-slate-100';
  const dropdownDividerClass = isDarkBackdrop ? 'border-white/20' : 'border-slate-200/50';
  const brandSubClass = isDarkBackdrop ? 'text-[#edd9b8]' : 'text-[#1C7F93]';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 p-4 font-sans max-w-6xl mx-auto">
      <header
        ref={headerRef}
        className={`relative rounded-2xl overflow-hidden border bg-white/45 backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-colors duration-300 ${isDarkBackdrop ? 'bg-black/44' : 'bg-white/45'} ${isOpen ? (isDarkBackdrop ? 'bg-black/60' : 'bg-white/60') : ''}`}
        style={{
          boxShadow: navShadow,
          borderColor: `color-mix(in srgb, ${navTint.accent} 42%, transparent)`,
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background: `linear-gradient(115deg, color-mix(in srgb, ${navTint.gradientA} 32%, transparent), color-mix(in srgb, ${navTint.gradientB} 26%, transparent) 52%, color-mix(in srgb, ${navTint.accent} 20%, transparent))`,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-20 h-52 w-52 rounded-full blur-3xl nav-color-shift"
          style={{
            background: `radial-gradient(circle at 50% 50%, color-mix(in srgb, ${navTint.accent} 36%, transparent), transparent 66%)`,
          }}
        />
        <div className="px-6 py-3 flex items-center justify-between relative z-10">
          <Link href="/" className="flex items-center space-x-3 group" onClick={() => setIsOpen(false)}>
            <div className="relative w-11 h-11 overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
               <Image src="/logo.png" alt="IJT Logo" fill sizes="44px" className="object-contain" priority />
            </div>
            <div>
              <h1 className={`font-extrabold text-[15px] sm:text-lg tracking-tight ${textPrimaryClass}`}>Islami Jamiat-e-Talaba</h1>
              <p className={`text-[10px] uppercase font-black tracking-[0.2em] opacity-80 mt-0.5 ${brandSubClass}`}>Bahawalpur</p>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-semibold">
            {navLinks.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                    active
                      ? `${isDarkBackdrop ? 'text-[#f4deb6]' : 'text-[#1C7F93]'} font-extrabold`
                      : `${textSecondaryClass} ${hoverBgClass} ${isDarkBackdrop ? 'hover:text-[#fff8ea]' : 'hover:text-[#123962]'}`
                  }`}
                >
                  {label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2.5px] rounded-full"
                      style={{ backgroundColor: isDarkBackdrop ? 'rgb(244 222 182)' : 'rgb(28 127 147)' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href="/ahbab-link" className={`hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-extrabold transition-colors ${isActive('/ahbab-link') ? (isDarkBackdrop ? 'text-[#f4deb6]' : 'text-[#1C7F93]') : `${textPrimaryClass} ${isDarkBackdrop ? 'hover:text-[#f4deb6]' : 'hover:text-[#1C7F93]'}`}`}>
              Ahbab Login
            </Link>
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-[#1C7F93] to-[#2669A9] text-white rounded-full shadow-[0_4px_14px_0_rgba(28,127,147,0.39)] hover:shadow-[0_6px_20px_rgba(28,127,147,0.23)] hover:bg-[rgba(28,127,147,0.9)] transition-all duration-300 font-bold text-sm transform hover:-translate-y-0.5"
            >
              Join IJT
            </Link>
            <button 
              className={`lg:hidden p-2 rounded-full transition-colors focus:outline-none cursor-pointer relative z-20 ${textPrimaryClass} ${isDarkBackdrop ? 'hover:bg-white/15' : 'hover:bg-slate-100/80'}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div 
          className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
             isOpen ? `max-h-[500px] opacity-100 border-t ${dropdownDividerClass}` : 'max-h-0 opacity-0 border-transparent'
          }`}
        >
          <nav className="flex flex-col space-y-1.5 px-6 py-5 text-sm font-semibold">
            {navLinks.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  onClick={() => setIsOpen(false)}
                  href={href}
                  className={`rounded-xl px-4 py-3 transition-colors flex items-center gap-2 ${
                    active
                      ? `${isDarkBackdrop ? 'bg-[#f2ddb8]/15 text-[#f2ddb8]' : 'bg-[#1C7F93]/8 text-[#1C7F93]'} font-extrabold`
                      : `${textSecondaryClass} ${mobileHoverBgClass} ${isDarkBackdrop ? 'hover:text-[#fff8ea]' : 'hover:text-[#123962]'}`
                  }`}
                >
                  {active && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isDarkBackdrop ? 'bg-[#f2ddb8]' : 'bg-[#1C7F93]'}`} />}
                  {label}
                </Link>
              );
            })}
            <div className={`pt-3 pb-1 border-t sm:hidden ${mobileDividerClass}`}>
               <Link onClick={() => setIsOpen(false)} href="/ahbab-link" className={`block rounded-xl px-4 py-3 transition-colors ${isActive('/ahbab-link') ? (isDarkBackdrop ? 'text-[#f2ddb8] font-extrabold' : 'text-[#1C7F93] font-extrabold') : `${isDarkBackdrop ? 'text-[#f7f1e6] hover:text-[#f2ddb8] hover:bg-white/10' : 'text-[#1C7F93] hover:text-[#123962] hover:bg-slate-100'}`}`}>Ahbab Login</Link>
               <Link
                 onClick={() => setIsOpen(false)}
                 href="/contact"
                 className="mt-2 flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-[#1C7F93] to-[#2669A9] text-white rounded-xl font-bold"
               >
                 Join IJT
               </Link>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default function Header() {
  return <HeaderContent />;
}
