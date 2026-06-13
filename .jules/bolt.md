## 2026-06-13 - Next.js Image Optimization Risk
**Learning:** Hardcoding assumed `next.config.js` remote patterns into frontend logic (like `.includes()`) to determine the `unoptimized` prop for `<Image>` components is brittle. It creates a risk where false positives lead to server crashes (400 Bad Request) on unconfigured domains.
**Action:** Centralize the domain checking logic into a dedicated utility (like `isWhitelistedImageDomain`) that safely parses the URL hostname to prevent partial matches. Do not use inline `includes` checks for domains on user-submitted or unpredictable URLs.
