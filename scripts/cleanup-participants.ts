import fs from 'fs';
import path from 'path';

// --- Load Env Vars ---
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) return;
    
    const [key, ...valueParts] = trimmedLine.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
      process.env[key.trim()] = value;
    }
  });
}

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function normalizeName(name: string): string {
  if (!name) return "";
  return name.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

async function cleanup() {
  console.log("🧹 Starting cleanup of unapproved participants...");
  
  // 1. Parse CSV to find unapproved names
  const csvPath = path.join(process.cwd(), 'public/ember/data/ac2c8fd0-2cc9-4a0c-bb8f-120ab2ffc5b0.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split(/\r?\n/);
  
  const unapprovedNames = new Set<string>();
  
  // Assuming headers are on line 0
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',');
    if (row.length < 8) continue;
    
    const name = row[1];
    const status = row[7];
    
    if (status !== 'approved' && name) {
      unapprovedNames.add(normalizeName(name));
    }
  }

  console.log(`Found ${unapprovedNames.size} unique unapproved names in CSV.`);

  // 2. Fetch Firebase Members
  const querySnapshot = await getDocs(collection(db, 'ember_team'));
  let deletedCount = 0;
  
  const deletions: Promise<any>[] = [];

  querySnapshot.forEach((document) => {
    const member = document.data();
    const nameNorm = normalizeName(member.name);
    
    // Only delete if they are explicitly unapproved AND they are a Participant
    // We don't want to accidentally delete organizers.
    if (unapprovedNames.has(nameNorm) && member.department === 'Participant') {
      deletions.push(deleteDoc(doc(db, 'ember_team', document.id)));
      console.log(`🗑️ Deleting unapproved participant: ${member.name}`);
      deletedCount++;
    }
  });

  await Promise.all(deletions);
  console.log(`✅ Cleanup complete. Deleted ${deletedCount} unapproved participants.`);
  process.exit(0);
}

cleanup().catch(console.error);
