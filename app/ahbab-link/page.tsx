export default function AhbabLinkPage() {
  return (
    <div className="min-h-screen py-16 bg-transparent">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="w-20 h-20 bg-blue-50 text-[#1C7F93] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
        </div>
        <h1 className="text-4xl font-bold text-[#123962] mb-4">Ahbab Link (Alumni Forum)</h1>
        <p className="text-gray-600 mb-10 text-lg">A dedicated portal for our alumni to reconnect, network, and contribute.</p>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Login to Portal</h2>
          <form className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/50" />
            </div>
            <button className="w-full py-2.5 bg-[#123962] text-white rounded-md font-bold mt-4 hover:bg-opacity-90 transition-colors">Sign In</button>
          </form>
          <div className="mt-6 text-sm text-gray-500">
            Not a member yet? <a href="#" className="font-bold text-[#1C7F93] hover:underline">Apply to Join</a>
          </div>
        </div>
      </div>
    </div>
  );
}
