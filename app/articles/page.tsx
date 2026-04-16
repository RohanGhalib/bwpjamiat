import Link from 'next/link';

export default function ArticlesPage() {
  return (
    <div className="min-h-screen py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#123962] mb-4">Articles & Blog</h1>
          <p className="text-gray-600">Insights, seerat, tarbiyah, and current affairs from our writers.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((article) => (
            <Link key={article} href={`/articles/slug-${article}`} className="group block">
              <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                   <img src={`https://picsum.photos/seed/article${article}/500/300`} alt="Article" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1C7F93]">
                     Tarbiyah
                   </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1C7F93] transition-colors line-clamp-2">The Role of Students in Modern Islamic Renaissance</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">A detailed discussion on how current university students can model their lives around the teachings of Islam while excelling in their respective fields of study.</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium">Oct 12, 2025</span>
                    <span className="text-xs font-bold text-[#123962]">Read More &rarr;</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
