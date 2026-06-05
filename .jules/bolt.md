## 2024-05-18 - Optimized sortEventsBySchedule and getEventState
**Learning:** `sortEventsBySchedule` recalculates `getEventStartTime` (which calls `Date.parse`) inside the `.sort` comparison function. Array sorts take O(N log N) time, so doing an expensive parse on every comparison is very inefficient. `getEventState` and the loop inside `sortEventsBySchedule` instantiate `new Date()` and `Date.now()` repeatedly.
**Action:** Map events to their parsed times before sorting them to avoid repeated string parsing. Pass down `now` or evaluate `Date.now()` and `new Date()` outside of loops.

## 2024-05-22 - Missing sizes attribute on Image components with fill
**Learning:** In Next.js, when using the `<Image>` component with the `fill` layout, if the `sizes` attribute is omitted, the browser assumes the image will occupy the full width of the viewport (`100vw`). This leads to the browser downloading unnecessarily large images for components that only occupy a fraction of the screen, significantly impacting load times and increasing bandwidth consumption.
**Action:** Always explicitly define a `sizes` attribute for `<Image>` components using `fill` to provide the browser with accurate information about the image's intended display size at different breakpoints, allowing it to select the most optimal image size.

## 2026-05-23 - Replace native img tag with Next.js Image component
**Learning:** Replacing native `<img>` tags with Next.js `<Image>` components allows Next.js to apply automatic optimizations like WebP conversion, responsive resizing, and lazy loading, which can significantly improve page load performance. Native `<img>` tags might cause slower LCP (Largest Contentful Paint) and higher bandwidth usage.
**Action:** Always prefer the Next.js `<Image>` component over the native `<img>` tag unless there is a specific reason not to.
## 2026-06-05 - TypeScript Type Error with Next.js Image alt prop
**Learning:** The Next.js `<Image>` component strictly requires the `alt` prop to be of type `string`. If the data source object has an optional property (e.g., `string | undefined`), passing it directly to `alt` will cause a TypeScript compilation failure during `npm run build`.
**Action:** Always provide a fallback empty string for the `alt` prop (e.g., `alt={data.title || ""}`) when using data that might be undefined to ensure the application builds successfully.

## 2026-06-05 - Avoid Committing Development Helper Scripts
**Learning:** Helper scripts used for automated file editing or testing (like Python patch scripts) can accidentally be committed if left in the repository root or working directory.
**Action:** Always ensure temporary scripts are either removed (e.g., `rm script.py`) or placed in directories excluded by `.gitignore` before submitting the PR to prevent polluting the codebase.
