import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { CmsPageRecord, NavLinkRecord, RedirectRecord, SystemSettingsRecord } from './cms-types';
import { normalizeCmsPath } from './url-management';

export async function getAllCmsPages() {
  const snapshot = await getDocs(collection(db, 'pages'));
  return snapshot.docs
    .map((document) => ({ id: document.id, ...(document.data() as Omit<CmsPageRecord, 'id'>) }))
    .filter((page) => !page.deletedAt) as CmsPageRecord[];
}

export async function getPublishedCmsPageByPath(path: string) {
  const normalized = normalizeCmsPath(path);
  const pages = await getAllCmsPages();
  return pages.find((page) => page.slugNormalized === normalized && page.status === 'published' && page.isVisible) || null;
}

export async function getAllNavLinks() {
  const snapshot = await getDocs(collection(db, 'nav_links'));
  return snapshot.docs
    .map((document) => ({ id: document.id, ...(document.data() as Omit<NavLinkRecord, 'id'>) }))
    .filter((link) => !link.deletedAt)
    .sort((a, b) => a.order - b.order) as NavLinkRecord[];
}

export async function getVisibleHeaderNavLinks() {
  const links = await getAllNavLinks();
  return links.filter((link) => link.visible && link.location === 'header');
}

export async function getAllRedirects() {
  const snapshot = await getDocs(collection(db, 'redirects'));
  return snapshot.docs
    .map((document) => ({ id: document.id, ...(document.data() as Omit<RedirectRecord, 'id'>) }))
    .filter((redirect) => !redirect.deletedAt) as RedirectRecord[];
}

export async function getSystemSettings() {
  const snapshot = await getDocs(collection(db, 'system_settings'));
  const first = snapshot.docs[0];
  if (!first) return null;
  return { id: first.id, ...(first.data() as Omit<SystemSettingsRecord, 'id'>) } as SystemSettingsRecord;
}

export async function getActiveRedirectByFromPath(path: string) {
  const normalized = normalizeCmsPath(path);
  const redirects = await getAllRedirects();
  return redirects.find((item) => item.active && item.fromPathNormalized === normalized) || null;
}

export async function upsertDedicatedEventPage(options: {
  eventId: string;
  title: string;
  slug: string;
  description?: string;
  updatedBy?: string;
}) {
  const normalizedPath = normalizeCmsPath(options.slug);
  const id = `event_${options.eventId}`;
  const now = new Date().toISOString();
  const pageRef = doc(collection(db, 'pages'), id);

  const payload = {
    title: options.title,
    slug: options.slug,
    slugNormalized: normalizedPath,
    type: 'event_dedicated',
    status: 'published',
    isVisible: true,
    isPrintedRisk: true,
    eventRef: options.eventId,
    contentText: options.description || '',
    updatedAt: now,
    updatedBy: options.updatedBy || 'admin',
    createdAt: now,
  } satisfies Omit<CmsPageRecord, 'id'>;

  await setDoc(pageRef, payload, { merge: true });
  await updateDoc(doc(db, 'events', options.eventId), {
    eventCategory: 'dedicated',
    dedicatedPath: normalizedPath,
    pageRef: id,
    updatedAt: now,
  });

  return id;
}
