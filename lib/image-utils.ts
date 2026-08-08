/**
 * ⚡ Bolt Optimization: Safely parses URLs to determine if they belong to a
 * configured remote pattern in next.config.ts. This prevents server crashes
 * when using the Next.js <Image> component with unpredictable external URLs.
 */
export function isWhitelistedImageDomain(url: string): boolean {
  try {
    // Treat relative (local) URLs as whitelisted since Next.js optimizes them by default
    if (url.startsWith('/')) return true;

    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    const exactMatches = [
      'picsum.photos',
      'firebasestorage.googleapis.com',
      'read-maududi-stage.s3.us-east-1.amazonaws.com',
      'read-maududi-stage.s3.amazonaws.com'
    ];

    if (exactMatches.includes(hostname)) {
      return true;
    }

    if (hostname.endsWith('.r2.dev') || hostname.endsWith('.r2.cloudflarestorage.com')) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}