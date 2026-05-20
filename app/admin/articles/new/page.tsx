"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createArticleAction } from "../actions";
import { Article } from "@/lib/types";
import JoditEditorWrapper from "../components/JoditEditorWrapper";

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    authorName: "",
    authorRole: "Writer",
    publishDate: new Date().toISOString().split('T')[0],
    category: "Tarbiyah" as Article["category"],
    thumbnailUrl: "",
    isPublished: true,
    readTime: "5 min read"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData(prev => ({ ...prev, title, slug }));
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading thumbnail...");
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "articles");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, thumbnailUrl: json.fileUrl }));
        toast.success("Thumbnail uploaded!", { id: toastId });
      } else {
        toast.error(json.error || "Upload failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Upload error", { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!content.trim()) {
      toast.error("Content cannot be empty");
      setLoading(false);
      return;
    }

    const toastId = toast.loading("Creating article...");

    try {
      const id = await createArticleAction({
        ...formData,
        content
      });

      if (id) {
        toast.success("Article created!", { id: toastId });
        router.push("/admin/articles");
      } else {
        toast.error("Failed to create article", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Write New Article</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#1C7F93] focus:border-[#1C7F93]"
                  placeholder="Enter article title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL segment)</label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#1C7F93] focus:border-[#1C7F93]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (for SEO & cards)</label>
                <textarea
                  name="excerpt"
                  required
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#1C7F93] focus:border-[#1C7F93]"
                ></textarea>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <label className="block text-sm font-bold text-gray-900">Article Content</label>
                <p className="text-xs text-gray-500">Use the editor below to format text, add headers, and upload inline images.</p>
              </div>
              <div className="p-0">
                <JoditEditorWrapper content={content} setContent={setContent} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 border-b pb-2">Publishing</h3>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#1C7F93] focus:ring-[#1C7F93] border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                  Publish Immediately
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                <input
                  type="date"
                  name="publishDate"
                  required
                  value={formData.publishDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1C7F93] text-white py-3 rounded-md font-bold hover:bg-[#123962] transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Article"}
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 border-b pb-2">Meta Data</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="Tarbiyah">Tarbiyah</option>
                  <option value="Current Affairs">Current Affairs</option>
                  <option value="Seerat">Seerat</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                <input
                  type="text"
                  name="authorName"
                  required
                  value={formData.authorName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author Role</label>
                <input
                  type="text"
                  name="authorRole"
                  required
                  value={formData.authorRole}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  placeholder="e.g. 5 min read"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 border-b pb-2">Cover Thumbnail</h3>
              
              {formData.thumbnailUrl && (
                <div className="mb-4">
                  <img src={formData.thumbnailUrl} alt="Thumbnail Preview" className="w-full h-auto rounded-lg" />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">Or Image URL</label>
                <input
                  type="text"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="https://..."
                />
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
