import Link from 'next/link';
import Image from 'next/image';

async function getCachedYear() {
  'use cache';
  return new Date().getFullYear();
}

export default async function Footer() {
  const year = await getCachedYear();
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-100 mt-auto relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#1C7F93]/5 to-transparent rounded-bl-full -z-10"></div>
      
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="lg:col-span-4 pr-6">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="relative w-12 h-12">
                 <Image src="/logo.png" alt="IJT Logo" fill sizes="48px" className="object-contain" />
              </div>
              <h3 className="font-extrabold text-xl tracking-tight text-[#123962]">Jamiat BWP</h3>
            </Link>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed max-w-xs font-medium">
              Striving for a cohesive Islamic society through education, deep character building, and social advocacy across Pakistan.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 text-[#123962] border border-slate-100 flex items-center justify-center hover:bg-[#1C7F93] hover:text-white hover:border-[#1C7F93] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-50 text-[#123962] border border-slate-100 flex items-center justify-center hover:bg-[#1C7F93] hover:text-white hover:border-[#1C7F93] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <h4 className="font-extrabold text-lg mb-6 text-[#123962]">Quick Links</h4>
            <ul className="space-y-4 text-sm font-semibold text-slate-500">
              <li><Link href="/" className="hover:text-[#1C7F93] transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1C7F93] group-hover:scale-150 transition-all mr-3"></span> Home Dashboard</Link></li>
              <li><Link href="/about" className="hover:text-[#1C7F93] transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1C7F93] group-hover:scale-150 transition-all mr-3"></span> Ideology & Structure</Link></li>
              <li><Link href="/events" className="hover:text-[#1C7F93] transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1C7F93] group-hover:scale-150 transition-all mr-3"></span> Upcoming Conventions</Link></li>
              <li><Link href="/contact" className="hover:text-[#1C7F93] transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1C7F93] group-hover:scale-150 transition-all mr-3"></span> Apply For Membership</Link></li>
            </ul>
          </div>
          
          <div className="lg:col-span-3">
            <h4 className="font-extrabold text-lg mb-6 text-[#123962]">Portals</h4>
            <ul className="space-y-4 text-sm font-semibold text-slate-500">
              <li><Link href="/taranas" className="hover:text-[#1C7F93] transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1C7F93] group-hover:scale-150 transition-all mr-3"></span> Taranas Gallery</Link></li>
              <li><Link href="/literature" className="hover:text-[#1C7F93] transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1C7F93] group-hover:scale-150 transition-all mr-3"></span> Literature Archive</Link></li>
              <li><Link href="/articles" className="hover:text-[#1C7F93] transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1C7F93] group-hover:scale-150 transition-all mr-3"></span> Official Blog</Link></li>
              <li><Link href="/lms" className="hover:text-[#1C7F93] transition-colors flex items-center group"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1C7F93] group-hover:scale-150 transition-all mr-3"></span> LMS Portal</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 text-sm font-semibold text-slate-500">
             <h4 className="font-extrabold text-lg mb-6 text-[#123962]">Contact</h4>
             <p className="mb-2">info@bwpjamiat.org</p>
             <p className="mb-6">Bahawalpur, PK</p>
             <Link href="/ahbab-link" className="text-[#1C7F93] font-black hover:underline underline-offset-4 flex items-center">Ahbab Portal <span className="ml-1">&rarr;</span></Link>
          </div>
          
        </div>
        
        <div className="border-t border-slate-100/80 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-wider">
          <p>&copy; {year} Islami Jamiat-e-Talaba Pakistan.</p>
          <div className="mt-4 md:mt-0 space-x-8">
            <Link href="/privacy" className="hover:text-[#123962] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#123962] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
