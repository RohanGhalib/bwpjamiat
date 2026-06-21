export const ALLOWED_IMAGE_DOMAINS = [
  'picsum.photos',
  'firebasestorage.googleapis.com',
  '**.r2.dev',
  '**.r2.cloudflarestorage.com',
  'read-maududi-stage.s3.us-east-1.amazonaws.com',
  'read-maududi-stage.s3.amazonaws.com',
];

export function isWhitelistedImageDomain(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.startsWith('/')) return true; // Local images are always allowed
  try {
    const hostname = new URL(url).hostname;
    return ALLOWED_IMAGE_DOMAINS.some(domain => {
      if (domain.startsWith('**.')) {
        return hostname.endsWith(domain.slice(3));
      }
      return hostname === domain;
    });
  } catch {
    return false;
  }
}
