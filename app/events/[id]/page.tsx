import Link from 'next/link';

export default async function SingleEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/events" className="text-[#1C7F93] hover:underline mb-8 inline-block text-sm font-semibold">&larr; Back to Events</Link>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gray-100 relative min-h-[300px]">
             <img src={`https://picsum.photos/seed/ev${id}/800/800`} alt="Event poster" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="p-8 md:w-1/2 flex flex-col">
            <span className="text-xs font-bold text-white bg-[#1C7F93] max-w-max px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Annual Gathering</span>
            <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">Jamiat Tarbiyati Camp {2025} (Event ID: {id})</h1>
            
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1C7F93] flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Date & Time</p>
                  <p className="text-sm text-gray-600">November 15, 2025</p>
                  <p className="text-sm text-gray-600">09:00 AM - 05:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1C7F93] flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Venue</p>
                  <p className="text-sm text-gray-600">Main Auditorium, Islamia University</p>
                  <p className="text-sm text-[#1C7F93] hover:underline cursor-pointer">View Map</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <button className="w-full py-3.5 bg-[#123962] text-white rounded-lg font-bold hover:bg-opacity-90 transition-colors shadow-md">Register Now</button>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
           <h2 className="text-2xl font-bold text-[#123962] mb-4">Event Description</h2>
           <p className="text-gray-600 leading-relaxed mb-6">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
           </p>
        </div>
      </div>
    </div>
  );
}
