const trueValues = new Set(['1', 'true', 'yes', 'on']);

function toBool(value: string | undefined, fallback: boolean) {
  if (value == null) return fallback;
  return trueValues.has(value.toLowerCase());
}

export const featureFlags = {
  cmsAdmin: toBool(process.env.NEXT_PUBLIC_FEATURE_CMS_ADMIN, true),
  cmsRouting: toBool(process.env.NEXT_PUBLIC_FEATURE_CMS_ROUTING, false),
  cmsRedirects: toBool(process.env.NEXT_PUBLIC_FEATURE_CMS_REDIRECTS, false),
};

