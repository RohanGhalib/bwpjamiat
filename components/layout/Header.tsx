import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-[#123962] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center text-[#123962] font-bold border-2 border-[#1C7F93]">
            <span className="text-xs leading-none">IJT</span>
            <span className="text-[10px] leading-none">BWP</span>
          </div>
          <div>
            <h1 className="font-bold text-lg md:text-xl leading-tight">Islami Jamiat-e-Talaba</h1>
            <p className="text-xs text-blue-200">Bahawalpur</p>
          </div>
        </Link>
        <nav className="hidden lg:flex space-x-6 text-sm font-medium">
          <Link href="/" className="hover:text-blue-300 transition-colors">Home</Link>
          <Link href="/taranas" className="hover:text-blue-300 transition-colors">Taranas</Link>
          <Link href="/literature" className="hover:text-blue-300 transition-colors">Literature</Link>
          <Link href="/articles" className="hover:text-blue-300 transition-colors">Articles</Link>
          <Link href="/events" className="hover:text-blue-300 transition-colors">Events</Link>
          <Link href="/ahbab-link" className="hover:text-blue-300 transition-colors">Ahbab Link</Link>
          <Link href="/lms" className="hover:text-blue-300 transition-colors">LMS</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/contact" className="hidden sm:inline-flex items-center justify-center px-5 py-2 bg-[#1C7F93] text-white rounded-md hover:bg-blue-600 transition-all font-semibold shadow-sm text-sm">
            Join Us
          </Link>
          <button className="lg:hidden text-white p-2 hover:bg-blue-800 rounded-md transition-colors" aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
