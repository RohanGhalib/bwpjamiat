import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <div className="fixed top-0 inset-x-0 z-50 p-4 font-sans">
      <header className="max-w-6xl mx-auto rounded-2xl bg-white/70 backdrop-blur-lg border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-[#123962] transition-all">
        <div className="px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-11 h-11 overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
               <Image src="/logo.png" alt="IJT Logo" fill sizes="44px" className="object-contain" priority />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#123962] to-[#1C7F93]">Islami Jamiat-e-Talaba</h1>
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#1C7F93] opacity-80 mt-0.5">Bahawalpur</p>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold">
            <Link href="/" className="relative text-[#123962] hover:text-[#1C7F93] transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#1C7F93] hover:after:w-full after:transition-all after:duration-300">Home</Link>
            <Link href="/taranas" className="relative text-slate-500 hover:text-[#123962] transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#1C7F93] hover:after:w-full after:transition-all after:duration-300">Taranas</Link>
            <Link href="/literature" className="relative text-slate-500 hover:text-[#123962] transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#1C7F93] hover:after:w-full after:transition-all after:duration-300">Literature</Link>
            <Link href="/articles" className="relative text-slate-500 hover:text-[#123962] transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#1C7F93] hover:after:w-full after:transition-all after:duration-300">Articles</Link>
            <Link href="/events" className="relative text-slate-500 hover:text-[#123962] transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#1C7F93] hover:after:w-full after:transition-all after:duration-300">Events</Link>
            <Link href="/lms" className="relative text-slate-500 hover:text-[#123962] transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#1C7F93] hover:after:w-full after:transition-all after:duration-300">LMS</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/ahbab-link" className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-extrabold text-[#123962] hover:text-[#1C7F93] transition-colors">
              Ahbab Login
            </Link>
            <Link href="/contact" className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-[#1C7F93] to-[#2669A9] text-white rounded-full shadow-[0_4px_14px_0_rgba(28,127,147,0.39)] hover:shadow-[0_6px_20px_rgba(28,127,147,0.23)] hover:bg-[rgba(28,127,147,0.9)] transition-all duration-300 font-bold text-sm transform hover:-translate-y-0.5">
              Join IJT
            </Link>
            <button className="lg:hidden text-[#123962] p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Toggle menu">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
