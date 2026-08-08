export const ALLOWED_IMAGE_DOMAINS = [
  'picsum.photos',
  'firebasestorage.googleapis.com',
  'r2.dev',
  'r2.cloudflarestorage.com',
  'read-maududi-stage.s3.us-east-1.amazonaws.com',
  'read-maududi-stage.s3.amazonaws.com',
];

export function isWhitelistedImageDomain(url: string | undefined | null): boolean {
  if (!url) return false;
  try {
    if (!url.startsWith('http')) return true; // Local paths are allowed
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    return ALLOWED_IMAGE_DOMAINS.some(domain =>
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch (e) {
    return false;
  }
}
