import Link from 'next/link';

export default function Literature() {
  const dummyBooks = Array.from({length: 6}, (_, i) => ({
    id: i+1, title: `Islamic Jurisprudence Vol ${i+1}`,
    author: "Syed Abul A'la Maududi", category: "Philosophy"
  }));

  return (
    <div className="min-h-screen bg-[#FAFCFF] pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0 overflow-hidden">
      <div className="absolute top-20 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#123962]/5 to-transparent blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">The Library</h2>
          <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Literature Archive</h1>
          <p className="text-slate-500 font-medium leading-relaxed">Deepen your intellectual horizons with critical literature, philosophical treatises, and core curriculum books.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyBooks.map(book => (
             <div key={book.id} className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-slate-50 hover:border-[#1C7F93]/20 hover:shadow-[0_20px_40px_rgba(28,127,147,0.08)] transition-all duration-500 group relative transform hover:-translate-y-2">
                <div className="h-64 bg-gradient-to-br from-[#123962] to-[#1C7F93] rounded-[1.5rem] mb-8 relative overflow-hidden shadow-inner flex items-center justify-center p-6">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                   <h3 className="text-white font-serif font-bold text-center text-xl leading-relaxed relative z-10 group-hover:scale-105 transition-transform duration-500">{book.title}</h3>
                   <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="inline-flex items-center space-x-2 bg-slate-50 px-3 py-1 rounded-full mb-4 border border-slate-100">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{book.category}</span>
                </div>
                <h4 className="font-extrabold text-[#123962] text-xl mb-2 group-hover:text-[#1C7F93] transition-colors">{book.title}</h4>
                <p className="text-slate-500 text-sm font-medium mb-6">By {book.author}</p>
                <button className="w-full py-3.5 bg-[#FAFCFF] text-[#123962] rounded-xl font-bold text-sm hover:bg-[#1C7F93] border border-slate-100 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md">
                  Download PDF
                </button>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
