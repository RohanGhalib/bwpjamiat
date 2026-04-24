"use client";
import { Analytics } from "@vercel/analytics/next"
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/taranas', label: 'Taranas' },
  { href: '/literature', label: 'Literature' },
  { href: '/articles', label: 'Articles' },
  { href: '/events', label: 'Events' },
  { href: '/lms', label: 'LMS' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 p-4 font-sans max-w-6xl mx-auto">
      <header className={`rounded-2xl transition-all duration-300 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/50 ${isOpen ? 'bg-white/95 backdrop-blur-xl' : 'bg-white/70 backdrop-blur-lg'}`}>
        <div className="px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group" onClick={() => setIsOpen(false)}>
            <div className="relative w-11 h-11 overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
               <Image src="/logo.png" alt="IJT Logo" fill sizes="44px" className="object-contain" priority />
            </div>
            <div>
              <h1 className="font-extrabold text-[15px] sm:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#123962] to-[#1C7F93]">Islami Jamiat-e-Talaba</h1>
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#1C7F93] opacity-80 mt-0.5">Bahawalpur</p>
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
                      ? 'text-[#1C7F93] font-extrabold'
                      : 'text-slate-500 hover:text-[#123962] hover:bg-slate-100/60'
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2.5px] rounded-full bg-[#1C7F93]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href="/ahbab-link" className={`hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-extrabold transition-colors ${isActive('/ahbab-link') ? 'text-[#1C7F93]' : 'text-[#123962] hover:text-[#1C7F93]'}`}>
              Ahbab Login
            </Link>
            <Link href="/contact" className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-[#1C7F93] to-[#2669A9] text-white rounded-full shadow-[0_4px_14px_0_rgba(28,127,147,0.39)] hover:shadow-[0_6px_20px_rgba(28,127,147,0.23)] hover:bg-[rgba(28,127,147,0.9)] transition-all duration-300 font-bold text-sm transform hover:-translate-y-0.5">
              Join IJT
            </Link>
            <button 
              className="lg:hidden text-[#123962] p-2 hover:bg-slate-100/80 rounded-full transition-colors focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
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
          className={`lg:hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
             isOpen ? 'max-h-[500px] opacity-100 border-t border-slate-200/50' : 'max-h-0 opacity-0'
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
                      ? 'bg-[#1C7F93]/8 text-[#1C7F93] font-extrabold'
                      : 'text-slate-600 hover:text-[#123962] hover:bg-slate-100'
                  }`}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#1C7F93] shrink-0" />}
                  {label}
                </Link>
              );
            })}
            <div className="pt-3 pb-1 border-t border-slate-100 sm:hidden">
               <Link onClick={() => setIsOpen(false)} href="/ahbab-link" className={`block rounded-xl px-4 py-3 transition-colors ${isActive('/ahbab-link') ? 'text-[#1C7F93] font-extrabold' : 'text-[#1C7F93] hover:text-[#123962] hover:bg-slate-100'}`}>Ahbab Login</Link>
               <Link onClick={() => setIsOpen(false)} href="/contact" className="mt-2 flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-[#1C7F93] to-[#2669A9] text-white rounded-xl font-bold">Join IJT</Link>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}
