export default function LMSPage() {
  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#123962] mb-4">Learning Management System</h1>
          <p className="text-gray-600">Access online study materials, courses, and track your progress.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h2>
            <div className="space-y-6">
              {['Mutala-e-Hadees', 'Tafseer-e-Quran', 'Nazm-e-Jamiat'].map((course, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[#123962]">{course}</h3>
                    <span className="bg-blue-50 text-[#1C7F93] text-xs font-bold px-2 py-1 rounded">12 Lessons</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-6">Comprehensive study material covering the fundamental aspects of {course.toLowerCase()} designed for structured learning.</p>
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                     <div className="text-sm font-medium text-gray-700">Course Progress: <span className="font-bold">0%</span></div>
                     <button className="px-4 py-2 bg-[#1C7F93] text-white text-sm font-bold rounded-md hover:bg-opacity-90">Start Course</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="bg-[#123962] text-white p-6 rounded-xl mb-6 shadow-lg">
              <h3 className="font-bold text-lg mb-2">Student Dashboard</h3>
              <p className="text-blue-200 text-sm mb-4">Please log in to track your progress and access quizzes.</p>
              <button className="w-full py-2 bg-white text-[#123962] font-bold rounded-md hover:bg-gray-100 transition-colors">Login / Register</button>
            </div>
            <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Recommended For You</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm">
                  <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                  <div className="font-medium text-gray-700">Introduction to Dawah<br/><span className="text-xs text-gray-400">4 Video Lessons</span></div>
                </li>
                <li className="flex gap-3 text-sm">
                  <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                  <div className="font-medium text-gray-700">Basic Fiqh<br/><span className="text-xs text-gray-400">8 PDF Document</span></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
