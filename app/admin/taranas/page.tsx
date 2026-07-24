import { Suspense } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import TaranaManager from '@/components/admin/TaranaManager';
import { Tarana } from '@/lib/types';
import { connection } from 'next/server';

export default function AdminTaranasPage() {
   return (
      <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0">
         <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="mb-16">
               <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Content Management System</h2>
               <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Tarana Management</h1>
               <p className="text-slate-500 font-medium">Add, edit, or remove audio taranas from the platform.</p>
            </div>

            <Suspense fallback={
               <div className="w-full flex items-center justify-center p-20 animate-pulse">
                  <div className="h-10 w-10 border-4 border-[#123962] border-t-transparent rounded-full animate-spin"></div>
               </div>
            }>
               <TaranasLoader />
            </Suspense>
         </div>
      </div>
   );
}

async function TaranasLoader() {
   await connection();
   const taranasRef = collection(db, 'taranas');
   const taranas: Tarana[] = [];
   try {
      const snapshot = await getDocs(taranasRef);
      snapshot.forEach((doc) => {
         taranas.push({ id: doc.id, ...doc.data() } as Tarana);
      });
   } catch (error) {
      console.error("Error fetching admin taranas:", error);
   }
   return <TaranaManager existingTaranas={taranas} />;
}
