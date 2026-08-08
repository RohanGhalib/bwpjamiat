import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { getArticleBySlug, getAllArticles } from '@/lib/db';
import { siteConfig } from '@/lib/site';
import { isWhitelistedImageDomain } from '@/lib/image-utils';

export async function generateStaticParams() {
  const articles = await getAllArticles(false);
  if (articles.length === 0) {
    // Return a fallback slug to satisfy Next.js 16's strict build-time validation
    return [{ slug: 'build-placeholder' }];
  }
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return buildMetadata({
    title: `${article.title} | IJT Bahawalpur`,
    description: article.excerpt,
    path: `/articles/${article.slug}`,
    image: article.thumbnailUrl || siteConfig.defaultOgImage,
  });
}

async function ArticleContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || !article.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen py-16 bg-transparent">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-10">
          <div className="flex gap-2 mb-6">
            <span className="bg-blue-50 text-[#1C7F93] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{article.category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-8">
             <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-white bg-[#123962]">
                   {article.authorName.charAt(0)}
                </div>
                <div>
                   <p className="font-bold text-gray-900">{article.authorName}</p>
                   <p>{article.authorRole}</p>
                </div>
             </div>
             <div className="ml-auto flex items-center gap-4">
                <span>{article.publishDate}</span>
                {article.readTime && (
                  <>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </>
                )}
             </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 prose-img:rounded-2xl prose-headings:text-[#123962] prose-a:text-[#1C7F93] prose-blockquote:border-[#1C7F93]">
           {article.thumbnailUrl && (
             <Image
               src={article.thumbnailUrl}
               alt={article.title || ""}
               width={1200}
               height={630}
               className="w-full h-auto rounded-2xl mb-10"
               sizes="(max-width: 896px) 100vw, 896px"
               unoptimized={!isWhitelistedImageDomain(article.thumbnailUrl)}
             />
           )}
           <div dangerouslySetInnerHTML={{ __html: article.content }} />
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
