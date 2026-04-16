import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#f8fafc] text-gray-800 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
               <div className="w-10 h-10 bg-[#123962] rounded-full flex flex-col items-center justify-center text-white font-bold border-2 border-[#1C7F93]">
                <span className="text-[10px] leading-none">IJT</span>
              </div>
              <h3 className="font-bold text-xl text-[#123962]">Jamiat Bahawalpur</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              The largest student organization in Pakistan striving towards a cohesive Islamic society through education and tarbiyah in Bahawalpur.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#123962]">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-[#1C7F93] transition-colors">Home Dashboard</Link></li>
              <li><Link href="/about" className="hover:text-[#1C7F93] transition-colors">Vision & Mission</Link></li>
              <li><Link href="/events" className="hover:text-[#1C7F93] transition-colors">Upcoming Events</Link></li>
              <li><Link href="/contact" className="hover:text-[#1C7F93] transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#123962]">Platforms</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/taranas" className="hover:text-[#1C7F93] transition-colors">Taranas Gallery</Link></li>
              <li><Link href="/literature" className="hover:text-[#1C7F93] transition-colors">Literature & Books</Link></li>
              <li><Link href="/articles" className="hover:text-[#1C7F93] transition-colors">Articles & Blog</Link></li>
              <li><Link href="/lms" className="hover:text-[#1C7F93] transition-colors">LMS Portal</Link></li>
              <li><Link href="/ahbab-link" className="hover:text-[#1C7F93] transition-colors">Ahbab Link Forum</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#123962]">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-[#1C7F93] mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <span>[Your Address, Bahawalpur, Pakistan]</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-[#1C7F93]"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <a href="mailto:info@bwpjamiat.org" className="hover:text-[#1C7F93] transition-colors">info@bwpjamiat.org</a>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-[#1C7F93]"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.08-7.074-6.97l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                <a href="tel:+920000000000" className="hover:text-[#1C7F93] transition-colors">+92 (000) 0000000</a>
              </li>
            </ul>
            <div className="flex space-x-3 mt-6">
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-[#123962] text-white flex items-center justify-center hover:bg-[#1C7F93] hover:-translate-y-1 transition-all">FB</a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-[#123962] text-white flex items-center justify-center hover:bg-[#1C7F93] hover:-translate-y-1 transition-all">IG</a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full bg-[#123962] text-white flex items-center justify-center hover:bg-[#1C7F93] hover:-translate-y-1 transition-all">YT</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Islami Jamiat-e-Talaba Bahawalpur. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="/privacy" className="hover:text-[#1C7F93]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#1C7F93]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
