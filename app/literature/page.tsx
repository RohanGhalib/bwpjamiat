import React from 'react';

export default function LiteraturePage() {
  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#123962] mb-4">Literature Library</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Explore our extensive collection of Islamic books, magazines, and educational PDFs.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((book) => (
            <div key={book} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
              <div className="h-64 bg-gray-200 relative">
                 <img src={`https://picsum.photos/seed/book${book}/300/400`} alt="Book Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">Islamic Book Title {book}</h3>
                <p className="text-xs text-gray-500 mb-4">Author Name • 2024</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-[#123962] text-white text-xs font-bold rounded-md hover:bg-opacity-90 transition-colors">Read Online</button>
                  <button className="px-3 py-2 bg-gray-100 text-[#123962] rounded-md hover:bg-gray-200 transition-colors" title="Download PDF">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
