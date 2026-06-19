export const ALLOWED_IMAGE_DOMAINS = [
  'picsum.photos',
  'firebasestorage.googleapis.com',
  'read-maududi-stage.s3.us-east-1.amazonaws.com',
  'read-maududi-stage.s3.amazonaws.com',
];

export function isWhitelistedImageDomain(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if (ALLOWED_IMAGE_DOMAINS.includes(hostname)) {
      return true;
    }

    if (hostname.endsWith('.r2.dev') || hostname.endsWith('.r2.cloudflarestorage.com')) {
      return true;
    }

    return false;
  } catch (_e) {
    // If URL parsing fails (e.g. relative path), we can assume it's a local Next.js image which is allowed.
    return url.startsWith('/');
  }
}
