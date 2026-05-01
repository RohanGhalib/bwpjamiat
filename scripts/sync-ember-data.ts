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
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';

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

// --- Utility Functions ---

function normalizeName(name: string): string {
  if (!name) return "";
  return name.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

function levenshteinDistance(a: string, b: string): number {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function isFuzzyMatch(name1: string, name2: string): boolean {
  const n1 = normalizeName(name1);
  const n2 = normalizeName(name2);
  if (n1 === n2) return true;

  // Subset matching (e.g., "Fahad" and "Fahad Maqbool")
  if (n1.includes(n2) || n2.includes(n1)) {
    // Only if the shorter name is at least 3 characters
    const minLen = Math.min(n1.length, n2.length);
    if (minLen >= 3) return true;
  }
  
  // Word-based matching (e.g., "Ali Raja" and "Faizan Ali Raja")
  const words1 = n1.split(' ');
  const words2 = n2.split(' ');
  const intersection = words1.filter(w => w.length > 2 && words2.includes(w));
  if (intersection.length >= 2) return true;

  // Levenshtein distance
  const distance = levenshteinDistance(n1, n2);
  const maxLen = Math.max(n1.length, n2.length);
  return distance / maxLen < 0.2; // 20% threshold
}

// --- Main Script ---

async function syncData() {
  console.log("🚀 Starting Ember Team Data Sync...");

  // 1. Read CSV
  const csvPath = path.join(process.cwd(), 'public/ember/data/ac2c8fd0-2cc9-4a0c-bb8f-120ab2ffc5b0.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  const emailIdx = headers.indexOf('email');
  const nameIdx = headers.indexOf('name');
  const phoneIdx = headers.indexOf('phone_number'); // Column 6
  const altPhoneIdx = headers.indexOf('Phone Number'); // Column 23

  const csvData: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Handle quoted values in CSV (simple regex parser)
    const row = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || [];
    if (row.length < 5) continue;

    const name = row[nameIdx];
    const email = row[emailIdx];
    const phone = row[phoneIdx] || row[altPhoneIdx] || '';
    const gender = row[headers.indexOf('Gender')] || '';

    if (name) {
      csvData.push({ 
        name, 
        email, 
        phone, 
        gender: gender.toLowerCase() === 'girl' ? 'girl' : 'boy' 
      });
    }
  }

  console.log(`📊 Parsed ${csvData.length} records from CSV.`);

  // 2. Process Duplicates in CSV
  const uniqueCsvRecords: Map<string, { email: string, phone: string, gender: string, originalName: string }[]> = new Map();
  csvData.forEach(record => {
    const norm = normalizeName(record.name);
    if (!uniqueCsvRecords.has(norm)) {
      uniqueCsvRecords.set(norm, []);
    }
    const existing = uniqueCsvRecords.get(norm)!;
    if (!existing.some(e => e.email === record.email && e.phone === record.phone)) {
      existing.push({ email: record.email, phone: record.phone, gender: record.gender, originalName: record.name });
    }
  });

  // 3. Fetch Firebase Team
  const teamRef = collection(db, 'ember_team');
  const snapshot = await getDocs(teamRef);
  const firebaseMembers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

  console.log(`🔥 Found ${firebaseMembers.length} members in Firebase.`);

  const updates: Promise<any>[] = [];
  const linked: string[] = [];
  const notFound: string[] = [];
  const discrepancies: string[] = [];
  const matchedCsvKeys = new Set<string>();

  // 4. Match and Update
  for (const member of firebaseMembers) {
    const memberNorm = normalizeName(member.name);
    let match: { email: string, phone: string }[] | undefined = undefined;
    let matchKey: string | undefined = undefined;

    // Direct match
    if (uniqueCsvRecords.has(memberNorm)) {
      match = uniqueCsvRecords.get(memberNorm);
      matchKey = memberNorm;
    } else {
      // Fuzzy match
      for (const [key, records] of uniqueCsvRecords.entries()) {
        if (isFuzzyMatch(member.name, key)) {
          match = records;
          matchKey = key;
          break;
        }
      }
    }

    if (match) {
      matchedCsvKeys.add(matchKey!);
      if (match.length > 1) {
        discrepancies.push(`⚠️ Member "${member.name}" has multiple entries in CSV with different contact info: ${JSON.stringify(match)}`);
      } else {
        const data = match[0];
        updates.push(updateDoc(doc(db, 'ember_team', member.id), {
          email: data.email,
          phone: data.phone
        }));
        linked.push(`✅ Linked "${member.name}" -> Email: ${data.email}, Phone: ${data.phone}`);
      }
    } else {
      // Manual check for "Fakhar"
      if (member.name.toLowerCase().includes('fakhar')) {
        const fakharMatchEntry = Array.from(uniqueCsvRecords.entries()).find(([k, v]) => v.some(r => r.email.includes('fakhar')));
        if (fakharMatchEntry) {
          const [key, records] = fakharMatchEntry;
          matchedCsvKeys.add(key);
          const data = records[0];
          updates.push(updateDoc(doc(db, 'ember_team', member.id), {
            email: data.email,
            phone: data.phone
          }));
          linked.push(`✅ Linked "${member.name}" (via email match) -> Email: ${data.email}, Phone: ${data.phone}`);
          continue;
        }
      }
      notFound.push(`❌ No match found for "${member.name}"`);
    }
  }

  // 5. Add New Participants from CSV
  let participantsAdded = 0;
  const participantRef = collection(db, 'ember_team');
  
  for (const [key, records] of uniqueCsvRecords.entries()) {
    if (!matchedCsvKeys.has(key)) {
      const data = records[0];
      // Use addDoc if we want to create new ones
      // We skip if email/phone is empty? No, keep them.
      updates.push(addDoc(participantRef, {
        name: data.originalName,
        email: data.email,
        phone: data.phone,
        department: 'Participant',
        role: 'Participant',
        gender: data.gender,
        order: 999, // Put them at the end
        img: '/person.png' // Default placeholder
      }));
      participantsAdded++;
    }
  }

  // 6. Execute Updates
  await Promise.all(updates);

  // 7. Report
  console.log("\n--- SYNC REPORT ---");
  console.log(`✅ Successfully updated ${linked.length} members.`);
  console.log(`🆕 Added ${participantsAdded} new participants.`);
  
  if (discrepancies.length > 0) {
    console.log("\n--- DISCREPANCIES (Please resolve manually) ---");
    discrepancies.forEach(d => console.log(d));
  }

  if (notFound.length > 0) {
    console.log("\n--- MEMBERS NOT FOUND IN CSV ---");
    notFound.forEach(n => console.log(n));
  }

  console.log("\n🚀 Sync complete!");
}

syncData().catch(console.error);
