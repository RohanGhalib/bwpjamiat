export const ALLOWED_IMAGE_DOMAINS = [
  'picsum.photos',
  'firebasestorage.googleapis.com',
  'read-maududi-stage.s3.us-east-1.amazonaws.com',
  'read-maududi-stage.s3.amazonaws.com'
];

export const ALLOWED_IMAGE_DOMAIN_SUFFIXES = [
  '.r2.dev',
  '.r2.cloudflarestorage.com'
];

export function isWhitelistedImageDomain(url: string | undefined | null): boolean {
  if (!url) return false;

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if (ALLOWED_IMAGE_DOMAINS.includes(hostname)) {
      return true;
    }

    if (ALLOWED_IMAGE_DOMAIN_SUFFIXES.some(suffix => hostname.endsWith(suffix))) {
      return true;
    }

    return false;
  } catch (error) {
    // Invalid URL or relative path
    return false;
  }
}
