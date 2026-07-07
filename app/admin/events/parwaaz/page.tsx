'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  ArrowLeft, 
  Trash2, 
  Search, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Compass, 
  Download,
  Users,
  Loader2,
  Trash
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type Registration = {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female';
  lastInstitution: string;
  expectedField: string;
  city: string;
  submittedAt: any;
};

export default function ParwaazAdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'Male' | 'Female'>('all');
  const [filterField, setFilterField] = useState<string>('all');

  useEffect(() => {
    const q = query(
      collection(db, 'parwaaz_registrations'), 
      orderBy('submittedAt', 'desc')
      // Note: We can also add client-side sorting/filtering to support offline fallback
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Registration[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        docs.push({
          id: doc.id,
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          gender: data.gender || 'Male',
          lastInstitution: data.lastInstitution || '',
          expectedField: data.expectedField || '',
          city: data.city || 'Bahawalpur',
          submittedAt: data.submittedAt
        } as Registration);
      });
      setRegistrations(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching registrations: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) return;
    try {
      await deleteDoc(doc(db, 'parwaaz_registrations', id));
      toast.success("Registration deleted successfully");
    } catch (err) {
      console.error("Error deleting registration: ", err);
      toast.error("Failed to delete registration.");
    }
  };

  // Filter logic
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.phone.includes(searchQuery) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.lastInstitution.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesGender = filterGender === 'all' || reg.gender === filterGender;
    const matchesField = filterField === 'all' || reg.expectedField === filterField;
    
    return matchesSearch && matchesGender && matchesField;
  });

  // Calculate statistics
  const totalCount = registrations.length;
  const maleCount = registrations.filter(r => r.gender === 'Male').length;
  const femaleCount = registrations.filter(r => r.gender === 'Female').length;

  // List unique expected fields for filters
  const uniqueFields = Array.from(new Set(registrations.map(r => r.expectedField).filter(Boolean)));

  // Export to CSV helper
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      toast.error("No registrations to export!");
      return;
    }

    const headers = ["Name", "Phone", "Email", "Gender", "Last Institution", "Expected Field", "City", "Registration Date"];
    const rows = filteredRegistrations.map(reg => {
      const date = reg.submittedAt?.toDate 
        ? reg.submittedAt.toDate().toLocaleString('en-US') 
        : reg.submittedAt 
          ? new Date(reg.submittedAt).toLocaleString() 
          : 'N/A';
      return [
        `"${reg.name.replace(/"/g, '""')}"`,
        `"${reg.phone}"`,
        `"${reg.email}"`,
        `"${reg.gender}"`,
        `"${reg.lastInstitution.replace(/"/g, '""')}"`,
        `"${reg.expectedField.replace(/"/g, '""')}"`,
        `"${reg.city.replace(/"/g, '""')}"`,
        `"${date}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Parwaaz_Registrations_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header Block */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold text-[#1C7F93] hover:underline uppercase tracking-wider mb-3">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black text-[#123962] tracking-tight">Parwaaz Seminar Signups</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Monitor registrations and download spreadsheet data for the Career Counselling Seminar.</p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#052c24] hover:bg-[#031d18] text-[#eab308] rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_10px_20px_rgba(5,44,36,0.15)] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Signups</p>
              <h3 className="text-2xl font-black text-[#123962]">{totalCount}</h3>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Male Attendees</p>
              <h3 className="text-2xl font-black text-[#123962]">{maleCount}</h3>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Female Attendees</p>
              <h3 className="text-2xl font-black text-[#123962]">{femaleCount}</h3>
            </div>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.01)] mb-6 flex flex-col md:flex-row gap-4 items-center">
          {/* Search box */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email, last institution..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAFCFF] border border-slate-100 rounded-2xl pl-11 pr-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all"
            />
          </div>

          {/* Gender filter */}
          <div className="w-full md:w-48">
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value as any)}
              className="w-full bg-[#FAFCFF] border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all appearance-none"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Expected Field filter */}
          <div className="w-full md:w-56">
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="w-full bg-[#FAFCFF] border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition-all appearance-none"
            >
              <option value="all">All Fields of Interest</option>
              {uniqueFields.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_15px_50px_rgba(0,0,0,0.01)] overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#1C7F93] mb-4" />
              <p className="text-slate-400 text-sm font-medium">Fetching registrations...</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="py-20 text-center">
              <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#123962] mb-1">No Registrations Found</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">Try refining your search queries or filters to find registered students.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#FAFCFF] border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                    <th className="px-6 py-4">Student Info</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Last Institution</th>
                    <th className="px-6 py-4">Interest Field</th>
                    <th className="px-6 py-4">City</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600 text-sm font-medium">
                  {filteredRegistrations.map((reg) => {
                    const date = reg.submittedAt?.toDate 
                      ? reg.submittedAt.toDate().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) 
                      : reg.submittedAt 
                        ? new Date(reg.submittedAt).toLocaleDateString()
                        : 'N/A';

                    return (
                      <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-[#123962]">{reg.name}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full max-w-max ${
                              reg.gender === 'Male' ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'
                            }`}>{reg.gender}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col space-y-1">
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Phone className="w-3.5 h-3.5 shrink-0 text-[#1C7F93]" /> {reg.phone}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Mail className="w-3.5 h-3.5 shrink-0 text-[#1C7F93]" /> {reg.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-xs text-slate-600 max-w-[200px] truncate">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {reg.lastInstitution}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-xs text-[#052c24] font-bold">
                          <div className="flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-[#eab308] shrink-0" />
                            {reg.expectedField}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-xs text-slate-500">{reg.city}</td>
                        <td className="px-6 py-5 text-xs text-slate-400">{date}</td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => handleDelete(reg.id)}
                            className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50/50 transition-colors inline-block cursor-pointer"
                            title="Delete Registration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
