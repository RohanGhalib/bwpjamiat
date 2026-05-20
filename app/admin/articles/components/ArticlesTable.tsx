"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Article } from "@/lib/types";
import { deleteArticleAction } from "../actions";

interface ArticlesTableProps {
  initialArticles: Article[];
}

export default function ArticlesTable({ initialArticles }: ArticlesTableProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      const toastId = toast.loading("Deleting article...");
      const success = await deleteArticleAction(id);
      if (success) {
        setArticles(prev => prev.filter(a => a.id !== id));
        toast.success("Article deleted!", { id: toastId });
      } else {
        toast.error("Failed to delete article", { id: toastId });
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title & Author</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publish Date</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {articles.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No articles found. Create one!</td>
            </tr>
          ) : (
            articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{article.title}</div>
                  <div className="text-sm text-gray-500">{article.authorName}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {article.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {article.isPublished ? (
                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                       Published
                     </span>
                  ) : (
                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                       Draft
                     </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {article.publishDate || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/articles/${article.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
