import { Suspense } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import EmberTeamManager from '@/components/admin/EmberTeamManager';
import { EmberMember } from '@/lib/types';



export default function AdminEmberTeamPage() {
   return (
      <div className="min-h-screen bg-transparent pt-36 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white relative z-0">
         <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="mb-16">
               <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-4">Content Management System</h2>
               <h1 className="text-5xl font-black text-[#123962] mb-6 tracking-tight">Ember Team Management</h1>
               <p className="text-slate-500 font-medium">Manage the organizers, leads, and directors for the Ember'26 Hackathon.</p>
            </div>

            <Suspense fallback={
               <div className="w-full flex items-center justify-center p-20 animate-pulse">
                  <div className="h-10 w-10 border-4 border-[#123962] border-t-transparent rounded-full animate-spin"></div>
               </div>
            }>
               <EmberTeamManagerLoader />
            </Suspense>
         </div>
      </div>
   );
}

async function EmberTeamManagerLoader() {
   const teamRef = collection(db, 'ember_team');
   const q = query(teamRef, orderBy('order', 'asc'));
   const members: EmberMember[] = [];
   
   try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         members.push({ id: doc.id, ...doc.data() } as EmberMember);
      });
   } catch (error) {
      console.error("Error fetching existing ember team members:", error);
   }

   return <EmberTeamManager initialMembers={members} />;
}
