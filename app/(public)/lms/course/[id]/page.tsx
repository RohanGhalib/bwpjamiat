import Link from 'next/link';
import { Suspense } from 'react';

// Pre-generate pages for all known course IDs
export function generateStaticParams() {
  return Array.from({ length: 6 }, (_, i) => ({
    id: String(i + 1),
  }));
}

async function CourseContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="min-h-screen py-16 bg-transparent">
      <div className="container mx-auto px-4 max-w-6xl">
         <Link href="/lms" className="text-[#1C7F93] hover:underline mb-8 inline-block text-sm font-semibold">&larr; Back to LMS Dashboard</Link>

         <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-[#123962] rounded-xl p-8 text-white shadow-xl">
                 <div className="flex gap-2 mb-4">
                   <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">Course {id}</span>
                 </div>
                 <h1 className="text-3xl font-bold mb-4">Mutala-e-Hadees For Beginners</h1>
                 <p className="text-blue-100 max-w-xl">A comprehensive guide to understanding the basic terminology, history, and science of Hadees, carefully curated for university students.</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center py-20 text-gray-500">
                 {/* Video Player Placeholder */}
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-gray-300"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>
                 <p className="font-bold">Select a lesson to start learning.</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
                 <h2 className="text-xl font-bold text-gray-900 mb-6">Course Material</h2>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                       <div className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                          <span className="font-medium text-gray-700">Course Outline & Syllabus.pdf</span>
                       </div>
                       <button className="text-[#1C7F93] text-sm font-bold hover:underline">Download</button>
                    </div>
                 </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm sticky top-24">
                 <div className="p-6 border-b border-gray-100">
                   <h3 className="font-bold text-lg text-gray-900 mb-4">Course Progress</h3>
                   <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div className="bg-[#1C7F93] h-2.5 rounded-full w-1/4"></div>
                   </div>
                   <p className="text-sm text-gray-500 text-right">25% Completed</p>
                 </div>
                 <div className="p-4">
                    <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4 px-2">Lessons list</h4>
                    <div className="space-y-1">
                      {[1, 2, 3, 4, 5].map(lesson => (
                        <button key={lesson} className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors flex items-center justify-between ${lesson === 1 ? 'bg-blue-50 text-[#123962] font-bold border border-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}>
                           <span>Lesson {lesson}: Introduction</span>
                           {lesson === 1 && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#1C7F93]"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>}
                        </button>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function CourseLoading() {
  return (
    <div className="min-h-screen py-16 bg-transparent">
      <div className="container mx-auto px-4 max-w-6xl animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded mb-8"></div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#123962]/50 rounded-xl p-8 h-48"></div>
            <div className="bg-gray-200 rounded-xl h-64"></div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 h-32"></div>
          </div>
          <div>
            <div className="bg-white rounded-xl border border-gray-100 h-96"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SingleCoursePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<CourseLoading />}>
      <CourseContent params={params} />
    </Suspense>
  );
}
