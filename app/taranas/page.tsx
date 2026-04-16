import React from 'react';

export default function TaranasPage() {
  // Placeholder data
  const taranas = [
    { id: 1, title: 'Utho Meri Duniya Ke Garibon Ko', artist: 'Jamiat Choir', duration: '4:30', tags: ['Classic'] },
    { id: 2, title: 'Mustafa Jaan e Rehmat', artist: 'Various', duration: '5:15', tags: ['Naat'] },
    { id: 3, title: 'Tarana E Jamiat', artist: 'Hafiz Abu Bakar', duration: '3:45', tags: ['Official'] },
    { id: 4, title: 'Hum Mustafavi Hain', artist: 'Jamiat Band', duration: '4:10', tags: ['Energetic'] },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#123962] mb-4">Taranas Gallery</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Listen, download, and share our exclusive collection of Islamic and inspirational taranas.</p>
        </header>

        {/* Filters placeholder */}
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <button className="px-4 py-2 bg-[#123962] text-white rounded-full text-sm font-semibold">All Categories</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-semibold">Latest</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-semibold">Classic</button>
        </div>

        {/* Audio Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {taranas.map((tarana) => (
            <div key={tarana.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <button className="w-12 h-12 rounded-full bg-blue-50 text-[#1C7F93] flex items-center justify-center hover:bg-[#1C7F93] hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                </button>
                <div>
                  <h3 className="font-bold text-gray-900">{tarana.title}</h3>
                  <p className="text-xs text-gray-500">{tarana.artist} • {tarana.duration}</p>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="text-gray-400 hover:text-[#123962] transition-colors p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                 </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
