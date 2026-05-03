import { collection, getDocs, doc, getDoc, query, orderBy, limit, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { unstable_cache } from 'next/cache';
import { db } from './firebase';
import { Event, Article, Course, Tarana, EmberMember } from './types';
import { type EventRecord } from './event-utils';

/**
 * Example Firestore data fetching wrappers.
 * This demonstrates exactly how to query the models defined in types.ts.
 */

export async function getRecentEvents(): Promise<Event[]> {
  return getRecentEventsCached();
}

const getRecentEventsCached = unstable_cache(async (): Promise<Event[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('date', 'desc'), limit(5));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    return []; // Fallback for UI testing
  }
}, ['recent-events'], { revalidate: 300, tags: ['events'] });

export async function getEventById(id: string): Promise<Event | null> {
  return getEventByIdCached(id);
}

const getEventByIdCached = unstable_cache(async (id: string): Promise<Event | null> => {
  try {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Event;
    }
    return null;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}, ['event-by-id'], { revalidate: 300, tags: ['events'] });

export async function getAllEvents(): Promise<EventRecord[]> {
  return getAllEventsCached();
}

const getAllEventsCached = unstable_cache(async (): Promise<EventRecord[]> => {
  try {
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as EventRecord[];
  } catch (error) {
    console.error("Error fetching all events:", error);
    // Log the full error object to help diagnose gRPC issues
    if (typeof error === 'object' && error !== null) {
      console.error("Full error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
    return [];
  }
}, ['all-events'], { revalidate: 300, tags: ['events'] });

export async function getRecentArticles(): Promise<Article[]> {
  return getRecentArticlesCached();
}

const getRecentArticlesCached = unstable_cache(async (): Promise<Article[]> => {
  try {
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, orderBy('publishDate', 'desc'), limit(3));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Article[];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}, ['recent-articles'], { revalidate: 300, tags: ['articles'] });

export async function getTaranas(): Promise<Tarana[]> {
  return getTaranasCached();
}

const getTaranasCached = unstable_cache(async (): Promise<Tarana[]> => {
  try {
    const taranasRef = collection(db, 'taranas');
    const snapshot = await getDocs(taranasRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Tarana[];
  } catch (error) {
    console.error("Error fetching taranas:", error);
    return [];
  }
}, ['all-taranas'], { revalidate: 300, tags: ['taranas'] });

export async function getTaranaById(id: string): Promise<Tarana | null> {
  return getTaranaByIdCached(id);
}

const getTaranaByIdCached = unstable_cache(async (id: string): Promise<Tarana | null> => {
  try {
    const docRef = doc(db, 'taranas', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Tarana;
    }

    return null;
  } catch (error) {
    console.error("Error fetching tarana:", error);
    return null;
  }
}, ['tarana-by-id'], { revalidate: 300, tags: ['taranas'] });

export async function addTarana(data: Omit<Tarana, 'id'>): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'taranas'), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding tarana:", error);
    return null;
  }
}

export async function deleteTarana(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'taranas', id));
    return true;
  } catch (error) {
    console.error("Error deleting tarana:", error);
    return false;
  }
}

export async function getEmberTeam(): Promise<EmberMember[]> {
  return getEmberTeamCached();
}

const getEmberTeamCached = unstable_cache(async (): Promise<EmberMember[]> => {
  try {
    const teamRef = collection(db, 'ember_team');
    const q = query(teamRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as EmberMember[];
  } catch (error) {
    console.error("Error fetching ember team:", error);
    return [];
  }
}, ['ember-team'], { revalidate: 3600, tags: ['ember_team'] });

export async function addEmberMember(data: Omit<EmberMember, 'id'>): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'ember_team'), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding ember member:", error);
    return null;
  }
}

export async function updateEmberMember(id: string, data: Partial<EmberMember>): Promise<boolean> {
  try {
    await updateDoc(doc(db, 'ember_team', id), data);
    return true;
  } catch (error) {
    console.error("Error updating ember member:", error);
    return false;
  }
}

export async function deleteEmberMember(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'ember_team', id));
    return true;
  } catch (error) {
    console.error("Error deleting ember member:", error);
    return false;
  }
}
