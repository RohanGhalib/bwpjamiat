import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Literature Archive | IJT Bahawalpur',
  description: 'Explore the Islamic literature archive of IJT Bahawalpur — books, treatises, and scholarly works by Syed Abul Ala Maududi and other scholars.',
  openGraph: {
    title: 'Literature Archive | IJT Bahawalpur',
    description: 'Curated Islamic literature and scholarly books from the IJT Bahawalpur library.',
    url: 'https://bwpjamiat.vercel.app/literature',
    siteName: 'IJT Bahawalpur',
    locale: 'en_PK',
    type: 'website',
  },
};

export default function Literature() {
  const dummyBooks = [
  {
    "title": "خطبات",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 288 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.us-east-1.amazonaws.com/books/1766841458056-Khutbaat%20(1).jpg",
    "link": "https://www.readmaududi.com/books/1/Khutbaat"
  },
  {
    "title": "دعوت اسلامی اور اس کے مطالبات",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 167 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.us-east-1.amazonaws.com/books/1766842169801-1732541631934-Dawat%20e%20Islami%20or%20os%20k%20Mutalibaat.jpg",
    "link": "https://www.readmaududi.com/books/2/DAWAT-E-ISLAMI-AUR-USKE-MUTALBAAT"
  },
  {
    "title": "تنقیحات",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 250 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762700468816-WhatsApp%20Image%202025-11-09%20at%2019.45.55.jpeg",
    "link": "https://www.readmaududi.com/books/3/TANQEHAAT"
  },
  {
    "title": "تحریک آزادی ہند اور مسلمان",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 446 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1763432871520-12%20Tehreek%20e%20Azadi%20Hind%20Aur%20Musalman-01%20(1).jpg",
    "link": "https://www.readmaududi.com/books/4/TEHREEK-E-AZADI-E-HIND-AUR-MUSALMAAN"
  },
  {
    "title": "تجدید و احیائے دین",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 120 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762703734062-WhatsApp%20Image%202025-11-09%20at%2019.45.55%20(2).jpeg",
    "link": "https://www.readmaududi.com/books/6/TAJDEED-O-AHYA-E-DEEN"
  },
  {
    "title": "تعلیمات",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 176 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762702133488-WhatsApp%20Image%202025-11-09%20at%2019.45.49.jpeg",
    "link": "https://www.readmaududi.com/books/7/TALEEMAT"
  },
  {
    "title": "سود",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 304 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762703606389-WhatsApp%20Image%202025-11-09%20at%2019.45.54%20(3).jpeg",
    "link": "https://www.readmaududi.com/books/8/SOOD"
  },
  {
    "title": "دینیات",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 136 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762701446881-WhatsApp%20Image%202025-11-09%20at%2019.45.48%20(1).jpeg",
    "link": "https://www.readmaududi.com/books/9/DEENIYAT"
  },
  {
    "title": "اسلامی نظام زندگی",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 328 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762702343782-WhatsApp%20Image%202025-11-09%20at%2019.45.50%20(1).jpeg",
    "link": "https://www.readmaududi.com/books/10/Islami-Nizam-e-Zindagi-Aur-Us-Ke-Bunyadi-Tasawwurat"
  },
  {
    "title": "اسلام اور ضبط ولادت",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 159 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.us-east-1.amazonaws.com/books/1766584066387-ISLAM%20AUR%20ZABT-E-WILADAT.jpg",
    "link": "https://www.readmaududi.com/books/11/Islam-Aur-Zabt-e-Wiladat"
  },
  {
    "title": "معاشیات اسلام",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 354 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762703131059-WhatsApp%20Image%202025-11-09%20at%2019.45.53%20(1).jpeg",
    "link": "https://www.readmaududi.com/books/12/MUASHIYAT-E-ISLAM"
  },
  {
    "title": "اسلامی ریاست",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 499 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762701565965-WhatsApp%20Image%202025-11-09%20at%2019.45.48%20(2).jpeg",
    "link": "https://www.readmaududi.com/books/13/Islami-Riyasat"
  },
  {
    "title": "سانحہ مسجد اقصیٰ",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 26 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762702663473-WhatsApp%20Image%202025-11-09%20at%2019.45.51%20(2).jpeg",
    "link": "https://www.readmaududi.com/books/15/SANIHA-E-MASJID-E-AQSA"
  },
  {
    "title": "اسلام اور جدید معاشی نظریات",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 104 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762701991855-WhatsApp%20Image%202025-11-09%20at%2019.45.49%20(3).jpeg",
    "link": "https://www.readmaududi.com/books/16/Islam-Aur-Jadeed-Maashi-Nazriyyat"
  },
  {
    "title": "قرآن کی چار بنیادی اصطلاحیں",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 136 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762700977821-WhatsApp%20Image%202025-11-09%20at%2019.44.49%20(3).jpeg",
    "link": "https://www.readmaududi.com/books/17/QURAN-KI-CHAR-BUNYADI-ISTALHAIN"
  },
  {
    "title": "مسئلۂ قومیت",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 114 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.us-east-1.amazonaws.com/books/1766841141599-Qomiyat-01.jpg",
    "link": "https://www.readmaududi.com/books/18/MASALA-E-QAUMIYAT"
  },
  {
    "title": "قادیانی مسئلہ",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 324 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762702423511-WhatsApp%20Image%202025-11-09%20at%2019.45.50%20(2).jpeg",
    "link": "https://www.readmaududi.com/books/27/QADIYANI-MASALAH"
  },
  {
    "title": "پردہ",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 280 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762702951430-WhatsApp%20Image%202025-11-09%20at%2019.45.52%20(3).jpeg",
    "link": "https://www.readmaududi.com/books/28/PARDA"
  },
  {
    "title": "اسلامی نظام تعلیم",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 34 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.us-east-1.amazonaws.com/books/1766829359828-Islami-Nizam-e-taleem.jpg",
    "link": "https://www.readmaududi.com/books/29/Islami-Nizam-e-Taleem"
  },
  {
    "title": "شہادت حق",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 32 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762942446181-19%20Shahadat%20Haq-01.jpg",
    "link": "https://www.readmaududi.com/books/30/SHAHADAT-E-HAQ"
  },
  {
    "title": "اسلام اور جاہلیت",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 25 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1763031798153-IMG-20251113-WA0014.jpg",
    "link": "https://www.readmaududi.com/books/31/Islam-Aur-Jahiliyyat"
  },
  {
    "title": "سلامتی کا راستہ",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 27 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762703529899-WhatsApp%20Image%202025-11-09%20at%2019.45.54%20(2).jpeg",
    "link": "https://www.readmaududi.com/books/33/SALAMTI-KA-RASTA"
  },
  {
    "title": "یتیم پوتے کی وراثت کا مسئلہ",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 16 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.us-east-1.amazonaws.com/books/1766779651805-Yateem-Pote-ki-Virasat-ka-Masla.jpg",
    "link": "https://www.readmaududi.com/books/34/YATEEM-PUTAY-KI-WIRASAT-KA-MASALA"
  },
  {
    "title": "ختم نبوت",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 49 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1762702780153-WhatsApp%20Image%202025-11-09%20at%2019.45.51%20(3).jpeg",
    "link": "https://www.readmaududi.com/books/35/KHATM-E-NABUWWAT"
  },
  {
    "title": "تحریک اسلامی کی اخلاقی بنیادیں",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 40 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.amazonaws.com/books/1763031311981-IMG-20251113-WA0006.jpg",
    "link": "https://www.readmaududi.com/books/36/TEHREEK-E-ISLAMI-KI-AKHLAQI-BUNYADAIN"
  },
  {
    "title": "مسئلۂ تعدد ازدواج",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 22 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.us-east-1.amazonaws.com/books/1766841125788-Tadud%20e%20Azwaj-01.jpg",
    "link": "https://www.readmaududi.com/books/37/MASALA-E-TAADDUD-E-AZWAJ"
  },
  {
    "title": "اسلامی نظمِ معیشت کے اُصول",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 21 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.us-east-1.amazonaws.com/books/1766779570560-islami-nazme-maeeshat-k-usool-aur-maqasid.jpg",
    "link": "https://www.readmaududi.com/books/41/Islami-Nazm-e-Maeshat-Ke-Usool-Aur-Maqasid"
  },
  {
    "title": "شہادت امام حسین",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 14 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.us-east-1.amazonaws.com/books/1766841102190-Imam%20Hussian%20RA-01.jpg",
    "link": "https://www.readmaududi.com/books/42/SHAHADAT-E-IMAM-HUSSAIN-R"
  },
  {
    "title": "اسلامی قانون",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 57 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.us-east-1.amazonaws.com/books/1766779743843-Islami-Qanoon-aur-pakistan-main-iss-nafaz-ki-amli-tadabeer.jpg",
    "link": "https://www.readmaududi.com/books/46/Islami-Qanoon"
  },
  {
    "title": "مسئلہ قربانی",
    "author": "سید ابوالاعلیٰ مودودی",
    "category": "اردو, 30 صفحات",
    "imageUrl": "https://read-maududi-stage.s3.us-east-1.amazonaws.com/books/1766828951415-MAsla-Qurbani.jpg",
    "link": "https://www.readmaududi.com/books/49/MASALA-E-QURBANI"
  }
].map((book, index) => ({ id: index + 1, ...book }));

  return (
    <div className="min-h-screen bg-transparent  pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0 overflow-hidden">
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
                <div className="h-72 bg-gradient-to-br from-[#123962] to-[#1C7F93] rounded-[1.5rem] mb-8 relative overflow-hidden shadow-inner flex items-center justify-center p-0">
                   {book.imageUrl ? (
                     <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500" />
                   ) : (
                     <>
                       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                       <h3 className="text-white font-serif font-bold text-center text-xl leading-relaxed relative z-10 group-hover:scale-105 transition-transform duration-500">{book.title}</h3>
                     </>
                   )}
                   <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-20"></div>
                </div>
                <div className="inline-flex items-center space-x-2 bg-slate-50 px-3 py-1 rounded-full mb-4 border border-slate-100">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{book.category}</span>
                </div>
                <h4 className="font-extrabold text-[#123962] text-xl mb-2 group-hover:text-[#1C7F93] transition-colors">{book.title}</h4>
                <p className="text-slate-500 text-sm font-medium mb-6">By {book.author}</p>
                <Link href={book.link} target="_blank" className="block w-full py-3.5 bg-[#FAFCFF] text-[#123962] rounded-xl font-bold text-sm hover:bg-[#1C7F93] border border-slate-100 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md text-center">
                  View on ReadMaududi
                </Link>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
