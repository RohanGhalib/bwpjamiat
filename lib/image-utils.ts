export const ALLOWED_IMAGE_DOMAINS = [
  'picsum.photos',
  'firebasestorage.googleapis.com',
  '**.r2.dev',
  '**.r2.cloudflarestorage.com',
  'read-maududi-stage.s3.us-east-1.amazonaws.com',
  'read-maududi-stage.s3.amazonaws.com',
];

/**
 * Checks if a given URL string's hostname matches the allowed domains.
 * Handles exact matches and wildcard prefix matches (e.g., "**.r2.dev").
 */
export function isWhitelistedImageDomain(urlString?: string | null): boolean {
  if (!urlString) return false;

  try {
    const url = new URL(urlString);
    const hostname = url.hostname;

    return ALLOWED_IMAGE_DOMAINS.some((allowedDomain) => {
      if (allowedDomain.startsWith('**.')) {
        const suffix = allowedDomain.slice(3); // Remove "**."
        return hostname === suffix || hostname.endsWith(`.${suffix}`);
      }
      return hostname === allowedDomain;
    });
  } catch {
    // If it's a relative URL or invalid URL, we can safely treat it as true
    // if it's a relative path (starts with '/'), otherwise false.
    return urlString.startsWith('/');
  }
}
