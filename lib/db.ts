import { collection, getDocs, doc, getDoc, query, orderBy, limit, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Event, Article, Course, Tarana } from './types';

/**
 * Example Firestore data fetching wrappers.
 * This demonstrates exactly how to query the models defined in types.ts.
 */

export async function getRecentEvents(): Promise<Event[]> {
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
}

export async function getEventById(id: string): Promise<Event | null> {
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
}

export async function getRecentArticles(): Promise<Article[]> {
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
}

export async function getTaranas(): Promise<Tarana[]> {
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
}

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
