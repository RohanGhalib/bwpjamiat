import Link from 'next/link';

export default function EventsPage() {
  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#123962] mb-4">Events & Activities</h1>
            <p className="text-gray-600">Join our upcoming events or explore our past activities.</p>
          </div>
          <div className="flex gap-2">
            <select className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm outline-none focus:border-[#1C7F93]">
              <option>All Types</option>
              <option>Convention</option>
              <option>Study Circle</option>
              <option>Camp</option>
            </select>
          </div>
        </header>

        <div className="space-y-6">
          {[1, 2, 3].map((event) => (
            <div key={event} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-gray-100 relative h-48 md:h-auto">
                <img src={`https://picsum.photos/seed/ev${event}/600/400`} alt="Event poster" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-md shadow-sm text-center">
                  <div className="text-xs text-gray-500 font-bold uppercase">Nov</div>
                  <div className="text-xl font-black text-[#123962]">{10 + event}</div>
                </div>
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <span className="text-xs font-bold text-[#1C7F93] tracking-wider uppercase mb-2 inline-block">Annual Gathering</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Jamiat Tarbiyati Camp {2025}</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                      <p className="text-sm font-bold text-gray-700">Time</p>
                      <p className="text-sm text-gray-500">09:00 AM - 05:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    <div>
                      <p className="text-sm font-bold text-gray-700">Venue</p>
                      <p className="text-sm text-gray-500">IUB Main Auditorium</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link href={`/events/${event}`} className="px-6 py-2.5 bg-[#123962] text-white rounded-md font-semibold text-sm hover:bg-opacity-90 transition-colors">Details & Registration</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
