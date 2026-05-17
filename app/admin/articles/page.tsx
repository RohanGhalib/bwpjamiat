import Link from "next/link";
import { Suspense } from "react";
import { getAllArticles } from "@/lib/db";
import ArticlesTable from "./components/ArticlesTable";

export default function AdminArticlesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Articles CMS</h1>
        <Link 
          href="/admin/articles/new" 
          className="bg-[#1C7F93] hover:bg-[#123962] text-white px-4 py-2 rounded font-medium transition-colors"
        >
          Create New Article
        </Link>
      </div>

      <Suspense fallback={
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500 animate-pulse">
          Loading articles...
        </div>
      }>
        <ArticlesLoader />
      </Suspense>
    </div>
  );
}

async function ArticlesLoader() {
  const articles = await getAllArticles(true); // get drafts too
  return <ArticlesTable initialArticles={articles} />;
}
