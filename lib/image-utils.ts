export const isWhitelistedImageDomain = (url: string): boolean => {
  if (!url) return false;
  if (url.startsWith('/')) return true; // Local images

  const whitelistedDomains = [
    'picsum.photos',
    'firebasestorage.googleapis.com',
    'r2.dev',
    'r2.cloudflarestorage.com',
    's3.us-east-1.amazonaws.com',
    's3.amazonaws.com',
  ];

  try {
    const hostname = new URL(url).hostname;
    return whitelistedDomains.some((domain) => hostname.endsWith(domain));
  } catch (_) {
    return false; // Invalid URL
  }
};
