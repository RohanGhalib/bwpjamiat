import { Suspense } from 'react';

// Pre-generate pages for all known article slugs
export function generateStaticParams() {
  return Array.from({ length: 6 }, (_, i) => ({
    slug: String(i + 1),
  }));
}

async function ArticleContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="min-h-screen py-16 bg-transparent">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-10">
          <div className="flex gap-2 mb-6">
            <span className="bg-blue-50 text-[#1C7F93] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Tarbiyah</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">The Role of Students in Modern Islamic Renaissance ({slug})</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-8">
             <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                   <p className="font-bold text-gray-900">Author Name</p>
                   <p>Writer &amp; Scholar</p>
                </div>
             </div>
             <div className="ml-auto flex items-center gap-4">
                <span>Oct 12, 2025</span>
                <span>•</span>
                <span>5 min read</span>
             </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700">
           <img src="https://picsum.photos/seed/articlemain/800/400" alt="Article main" className="w-full h-auto rounded-2xl mb-10" />
           <p className="lead text-xl text-gray-600 mb-6">
             A detailed discussion on how current university students can model their lives around the teachings of Islam while excelling in their respective fields of study.
           </p>
           <p className="mb-6">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
           </p>
           <h2 className="text-2xl font-bold text-[#123962] mt-10 mb-4">Balancing Academics and Deen</h2>
           <p className="mb-6">
             Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
           </p>
           <blockquote className="border-l-4 border-[#1C7F93] pl-6 italic text-gray-600 my-8">
             &quot;The pursuit of knowledge is an obligation upon every Muslim.&quot;
           </blockquote>
        </div>
      </div>
    </div>
  );
}

function ArticleLoading() {
  return (
    <div className="min-h-screen py-16 bg-transparent">
      <div className="container mx-auto px-4 max-w-4xl animate-pulse">
        <div className="h-6 w-24 bg-gray-200 rounded-full mb-6"></div>
        <div className="h-12 w-3/4 bg-gray-200 rounded-lg mb-6"></div>
        <div className="h-4 w-1/2 bg-gray-100 rounded mb-10"></div>
        <div className="h-64 w-full bg-gray-100 rounded-2xl mb-10"></div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function SingleArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<ArticleLoading />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}
