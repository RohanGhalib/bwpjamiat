/**
 * @file lib/contacts.ts
 * @description Centralized Contacts & Leads CRM Engine for BWP Jamiat.
 * 
 * ARCHITECTURAL GUIDELINES FOR DEVELOPERS AND AI AGENTS:
 * 1. SINGLE SOURCE OF TRUTH:
 *    Every public intake form (Quran Club, Volunteers, Summer School, Event Signups,
 *    Contact Forms, etc.) MUST ingest/upsert into the 'contacts' Firestore collection
 *    using the `upsertContact` function provided here.
 * 
 * 2. DYNAMIC CUSTOM FIELDS (`customFields`):
 *    DO NOT create generic slot columns like `textfield1`, `textfield2`.
 *    Store form-specific answers in `customFields: Record<string, any>` with descriptive
 *    camelCase keys (e.g. `{ degree: "BSCS", whyJoin: "...", tshirtSize: "L" }`).
 *    The Admin Contacts Hub dynamically renders all keys in `customFields`.
 * 
 * 3. DEDUPLICATION:
 *    `upsertContact` automatically normalizes phone numbers and emails. If a contact
 *    already exists, their profile is updated, tags are merged, and new customFields are
 *    combined without overwriting past history.
 */

import { 
  collection, 
  getDocs, 
  doc, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { CentralContact, ContactSource, ContactStatus } from './types';

export interface UpsertContactInput {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  institution?: string;
  source: ContactSource;
  sourceEventId?: string;
  sourceEventTitle?: string;
  tags?: string[];
  status?: ContactStatus;
  customFields?: Record<string, unknown>;
  isSubscribedToEmail?: boolean;
}

/**
 * Normalizes phone numbers for accurate Pakistani & international matching.
 * Examples: '0300 1234567' -> '+923001234567', '0300-1234567' -> '+923001234567'
 */
export function normalizePhone(rawPhone: string): string {
  if (!rawPhone) return '';
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length >= 12) {
    return `+${digits}`;
  }
  if (digits.startsWith('03') && digits.length === 11) {
    return `+92${digits.slice(1)}`;
  }
  if (digits.startsWith('3') && digits.length === 10) {
    return `+92${digits}`;
  }
  return rawPhone.trim();
}

/**
 * Normalizes email strings.
 */
export function normalizeEmail(rawEmail?: string): string {
  return (rawEmail || '').trim().toLowerCase();
}

/**
 * Upserts a contact into the centralized 'contacts' collection.
 * If a matching contact is found by phone or email, merges tags & customFields.
 * If not found, creates a new contact document.
 */
export async function upsertContact(input: UpsertContactInput): Promise<{ id: string; isNew: boolean }> {
  try {
    const cleanPhone = normalizePhone(input.phone);
    const cleanEmail = normalizeEmail(input.email);
    const now = new Date().toISOString();

    const contactsRef = collection(db, 'contacts');
    let existingDoc: { id: string; data: CentralContact } | null = null;

    // 1. Search by Phone (primary identifier)
    if (cleanPhone) {
      const phoneQuery = query(contactsRef, where('phone', '==', cleanPhone), limit(1));
      const phoneSnap = await getDocs(phoneQuery);
      if (!phoneSnap.empty) {
        const d = phoneSnap.docs[0];
        existingDoc = { id: d.id, data: d.data() as CentralContact };
      }
    }

    // 2. Search by Email (secondary identifier) if phone did not match
    if (!existingDoc && cleanEmail) {
      const emailQuery = query(contactsRef, where('email', '==', cleanEmail), limit(1));
      const emailSnap = await getDocs(emailQuery);
      if (!emailSnap.empty) {
        const d = emailSnap.docs[0];
        existingDoc = { id: d.id, data: d.data() as CentralContact };
      }
    }

    const newTags = input.tags || (input.source ? [input.source] : []);

    if (existingDoc) {
      // Merge with existing contact
      const existingData = existingDoc.data;
      const mergedTags = Array.from(new Set([...(existingData.tags || []), ...newTags]));
      
      const mergedCustomFields = {
        ...(existingData.customFields || {}),
        ...(input.customFields || {}),
      };

      const updatePayload: Partial<CentralContact> = {
        updatedAt: now,
        tags: mergedTags,
        customFields: mergedCustomFields,
      };

      // Fill in blanks if newly supplied
      if (!existingData.name && input.name) updatePayload.name = input.name.trim();
      if (!existingData.email && cleanEmail) updatePayload.email = cleanEmail;
      if (!existingData.city && input.city) updatePayload.city = input.city.trim();
      if (!existingData.institution && input.institution) updatePayload.institution = input.institution.trim();
      if (input.status) updatePayload.status = input.status;
      if (input.sourceEventTitle && !existingData.sourceEventTitle) {
        updatePayload.sourceEventTitle = input.sourceEventTitle;
      }

      await updateDoc(doc(db, 'contacts', existingDoc.id), updatePayload);
      return { id: existingDoc.id, isNew: false };
    } else {
      // Create new contact
      const newContact: Omit<CentralContact, 'id'> = {
        name: (input.name || 'Anonymous').trim(),
        phone: cleanPhone,
        email: cleanEmail || '',
        city: (input.city || '').trim(),
        institution: (input.institution || '').trim(),
        source: input.source || 'manual',
        sourceEventId: input.sourceEventId || '',
        sourceEventTitle: input.sourceEventTitle || '',
        tags: newTags,
        status: input.status || 'lead',
        customFields: input.customFields || {},
        isSubscribedToEmail: input.isSubscribedToEmail !== false,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(contactsRef, newContact);
      return { id: docRef.id, isNew: true };
    }
  } catch (error) {
    console.error('[upsertContact] Error upserting contact:', error);
    throw error;
  }
}

/**
 * Fetch all contacts from Firestore with optional filtering.
 */
export async function getAllContacts(): Promise<CentralContact[]> {
  try {
    const contactsRef = collection(db, 'contacts');
    let snapshot;
    try {
      const q = query(contactsRef, orderBy('createdAt', 'desc'));
      snapshot = await getDocs(q);
    } catch {
      // Fallback if composite index is pending
      snapshot = await getDocs(contactsRef);
    }

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as CentralContact[];
  } catch (error) {
    console.error('[getAllContacts] Error fetching contacts:', error);
    return [];
  }
}

/**
 * Delete a contact by ID.
 */
export async function deleteContact(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'contacts', id));
    return true;
  } catch (error) {
    console.error('[deleteContact] Error:', error);
    return false;
  }
}

/**
 * Update a contact's details.
 */
export async function updateContact(id: string, updates: Partial<CentralContact>): Promise<boolean> {
  try {
    const payload = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(doc(db, 'contacts', id), payload);
    return true;
  } catch (error) {
    console.error('[updateContact] Error:', error);
    return false;
  }
}

/**
 * One-Click Backfill Sync: Migrates all historical registrations into the central 'contacts' collection.
 * Scans: 'volunteers', 'quran_club_registrations', 'summer_school_registrations'.
 */
export async function syncHistoricalDataToContacts(): Promise<{
  synced: number;
  errors: number;
  sources: { volunteers: number; quranClub: number; summerSchool: number };
}> {
  let synced = 0;
  let errors = 0;
  const sources = { volunteers: 0, quranClub: 0, summerSchool: 0 };

  try {
    // 1. Sync Volunteers
    try {
      const volSnap = await getDocs(collection(db, 'volunteers'));
      for (const d of volSnap.docs) {
        const data = d.data();
        if (data.phone || data.email || data.name) {
          await upsertContact({
            name: data.name || 'Volunteer Applicant',
            phone: data.phone || '',
            email: data.email || '',
            city: data.area || data.address || '',
            institution: data.institution || '',
            source: 'volunteer',
            tags: ['volunteer', ...(data.className ? [data.className] : [])],
            status: 'active',
            customFields: {
              className: data.className || '',
              subject: data.subject || '',
              address: data.address || '',
              instagram: data.instagram || '',
              facebook: data.facebook || '',
              whyJoin: data.whyJoin || data.message || '',
              howDidYouKnow: data.howDidYouKnow || '',
            },
          });
          synced++;
          sources.volunteers++;
        }
      }
    } catch (err) {
      console.error('[syncHistoricalData] Error syncing volunteers:', err);
      errors++;
    }

    // 2. Sync Quran Club Registrations
    try {
      const qcSnap = await getDocs(collection(db, 'quran_club_registrations'));
      for (const d of qcSnap.docs) {
        const data = d.data();
        if (data.whatsapp || data.email || data.firstName || data.name) {
          const fullName = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim();
          await upsertContact({
            name: fullName || 'Quran Club Member',
            phone: data.whatsapp || '',
            email: data.email || '',
            city: data.address || '',
            institution: data.college || '',
            source: 'quran_club',
            sourceEventTitle: 'Quran Club 2026',
            tags: ['quran_club', 'quran-club-2026', ...(data.status ? [data.status.toLowerCase()] : [])],
            status: data.status === 'Approved' ? 'approved' : 'lead',
            customFields: {
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              degree: data.degree || '',
              college: data.college || '',
              passId: data.passId || '',
              dob: data.dob || '',
              occupation: data.occupation || '',
              motivation: data.motivation || '',
              interest: data.interest || '',
            },
          });
          synced++;
          sources.quranClub++;
        }
      }
    } catch (err) {
      console.error('[syncHistoricalData] Error syncing quran club:', err);
      errors++;
    }

    // 3. Sync Summer School Registrations
    try {
      const ssSnap = await getDocs(collection(db, 'summer_school_registrations'));
      for (const d of ssSnap.docs) {
        const data = d.data();
        if (data.phone || data.whatsapp || data.email || data.name || data.studentName) {
          const name = data.name || data.studentName || 'Summer School Student';
          await upsertContact({
            name,
            phone: data.phone || data.whatsapp || '',
            email: data.email || '',
            city: data.city || data.area || '',
            institution: data.school || data.institution || '',
            source: 'summer_school',
            sourceEventTitle: 'AI Summer Camp',
            tags: ['summer_school', 'summer-camp-2026'],
            status: 'lead',
            customFields: {
              parentName: data.parentName || data.guardianName || '',
              parentPhone: data.parentPhone || '',
              age: data.age || '',
              grade: data.grade || data.class || '',
              tshirtSize: data.tshirtSize || '',
              track: data.track || data.course || '',
            },
          });
          synced++;
          sources.summerSchool++;
        }
      }
    } catch (err) {
      console.error('[syncHistoricalData] Error syncing summer school:', err);
      errors++;
    }

    return { synced, errors, sources };
  } catch (error) {
    console.error('[syncHistoricalDataToContacts] Global Error:', error);
    throw error;
  }
}
