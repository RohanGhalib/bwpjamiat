// List of allowed domains from next.config.ts
const ALLOWED_IMAGE_DOMAINS = [
  'picsum.photos',
  'firebasestorage.googleapis.com',
  'read-maududi-stage.s3.us-east-1.amazonaws.com',
  'read-maududi-stage.s3.amazonaws.com'
];

/**
 * Safely checks if a given URL is from a whitelisted domain for Next.js Image optimization.
 * This prevents server crashes (400 Bad Request) caused by Next.js attempting to optimize
 * images from unconfigured domains.
 *
 * It uses the URL constructor to extract the hostname, avoiding partial string matches
 * (like `.includes()`) which are unsafe. It also supports wildcard domains specified in next.config.ts.
 */
export function isWhitelistedImageDomain(urlString: string | null | undefined): boolean {
  if (!urlString) return false;

  try {
    const url = new URL(urlString);
    const hostname = url.hostname;

    // Check exact matches
    if (ALLOWED_IMAGE_DOMAINS.includes(hostname)) {
      return true;
    }

    // Check wildcard matches defined in next.config.ts
    // "*.r2.dev" and "*.r2.cloudflarestorage.com"
    if (hostname.endsWith('.r2.dev') || hostname.endsWith('.r2.cloudflarestorage.com')) {
      return true;
    }

    return false;
  } catch (error) {
    // If URL parsing fails (e.g., relative path like "/logo.png"),
    // it's a local image and should be optimized by default.
    return !urlString.startsWith('http');
  }
}
