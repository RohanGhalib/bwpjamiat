import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const RESERVED_STATIC_PATHS = new Set([
  '/',
  '/admin',
  '/api',
  '/events',
  '/ember',
  '/aghaz',
  '/taranas',
  '/contact',
  '/articles',
  '/literature',
  '/lms',
  '/launch',
  '/links',
  '/ahbab-link',
]);

export type EndpointAvailabilityResult = {
  available: boolean;
  normalizedPath: string;
  reason?: string;
  warnings: string[];
};

export function normalizeCmsPath(input: string) {
  const cleaned = (input || '').trim().replace(/^https?:\/\/[^/]+/i, '');
  const compact = cleaned.replace(/\/+/g, '/').replace(/\/$/, '');
  const withSlash = compact.startsWith('/') ? compact : `/${compact}`;
  return withSlash === '' ? '/' : withSlash.toLowerCase();
}

export function normalizeSlug(input: string) {
  const value = (input || '').trim().toLowerCase();
  const slug = value
    .replace(/[^a-z0-9\s/-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
  return slug;
}

export async function checkEndpointAvailability(
  rawPath: string,
  options?: {
    excludePageId?: string;
    excludeRedirectId?: string;
    excludeEventId?: string;
  }
): Promise<EndpointAvailabilityResult> {
  const warnings: string[] = [];
  const normalizedPath = normalizeCmsPath(rawPath);

  if (normalizedPath === '/' || normalizedPath.length < 2) {
    return {
      available: false,
      normalizedPath,
      reason: 'Endpoint must include a path segment (example: /ember-2027).',
      warnings,
    };
  }

  if (RESERVED_STATIC_PATHS.has(normalizedPath)) {
    return {
      available: false,
      normalizedPath,
      reason: 'This endpoint is reserved by an existing core route.',
      warnings,
    };
  }

  const [pagesSnapshot, redirectsSnapshot, eventsSnapshot] = await Promise.all([
    getDocs(collection(db, 'pages')),
    getDocs(collection(db, 'redirects')),
    getDocs(collection(db, 'events')),
  ]);

  const pageConflict = pagesSnapshot.docs.some((document) => {
    if (options?.excludePageId && document.id === options.excludePageId) return false;
    const data = document.data() as { slugNormalized?: string; deletedAt?: string };
    return !data.deletedAt && data.slugNormalized === normalizedPath;
  });

  if (pageConflict) {
    return {
      available: false,
      normalizedPath,
      reason: 'Endpoint already exists in CMS pages.',
      warnings,
    };
  }

  const redirectConflict = redirectsSnapshot.docs.some((document) => {
    if (options?.excludeRedirectId && document.id === options.excludeRedirectId) return false;
    const data = document.data() as { fromPathNormalized?: string; deletedAt?: string };
    return !data.deletedAt && data.fromPathNormalized === normalizedPath;
  });

  if (redirectConflict) {
    return {
      available: false,
      normalizedPath,
      reason: 'Endpoint is already used as a redirect source.',
      warnings,
    };
  }

  const eventConflict = eventsSnapshot.docs.some((document) => {
    if (options?.excludeEventId && document.id === options.excludeEventId) return false;
    const data = document.data() as { dedicatedPath?: string; eventCategory?: string };
    if (data.eventCategory !== 'dedicated') return false;
    return normalizeCmsPath(data.dedicatedPath || '') === normalizedPath;
  });

  if (eventConflict) {
    return {
      available: false,
      normalizedPath,
      reason: 'Endpoint is already used by a dedicated event.',
      warnings,
    };
  }

  warnings.push('If this URL was previously printed/shared, changing it can break old links.');

  return { available: true, normalizedPath, warnings };
}

