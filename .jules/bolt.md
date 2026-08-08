## 2024-05-18 - Optimized sortEventsBySchedule and getEventState
**Learning:** `sortEventsBySchedule` recalculates `getEventStartTime` (which calls `Date.parse`) inside the `.sort` comparison function. Array sorts take O(N log N) time, so doing an expensive parse on every comparison is very inefficient. `getEventState` and the loop inside `sortEventsBySchedule` instantiate `new Date()` and `Date.now()` repeatedly.
**Action:** Map events to their parsed times before sorting them to avoid repeated string parsing. Pass down `now` or evaluate `Date.now()` and `new Date()` outside of loops.

## 2024-05-22 - Missing sizes attribute on Image components with fill
**Learning:** In Next.js, when using the `<Image>` component with the `fill` layout, if the `sizes` attribute is omitted, the browser assumes the image will occupy the full width of the viewport (`100vw`). This leads to the browser downloading unnecessarily large images for components that only occupy a fraction of the screen, significantly impacting load times and increasing bandwidth consumption.
**Action:** Always explicitly define a `sizes` attribute for `<Image>` components using `fill` to provide the browser with accurate information about the image's intended display size at different breakpoints, allowing it to select the most optimal image size.

## 2026-05-23 - Replace native img tag with Next.js Image component
**Learning:** Replacing native `<img>` tags with Next.js `<Image>` components allows Next.js to apply automatic optimizations like WebP conversion, responsive resizing, and lazy loading, which can significantly improve page load performance. Native `<img>` tags might cause slower LCP (Largest Contentful Paint) and higher bandwidth usage.
**Action:** Always prefer the Next.js `<Image>` component over the native `<img>` tag unless there is a specific reason not to.

## 2024-05-24 - Avoiding state-driven re-renders for high-frequency events with layout sync
**Learning:** For audio `timeupdate` events, calling `useState` causes the entire parent component (and its children) to re-render repeatedly (e.g., `TaranasGallery`), consuming significant CPU. Moving the progress bar logic to `useRef` direct DOM mutations solves this. However, since React re-renders (triggered by pausing, fullscreen, etc.) will overwrite these manual DOM mutations with the initial JSX string states (e.g., "00:00"), the UI can "flicker". A standard `useEffect` runs asynchronously *after* the browser paints, causing a visible snap.
**Action:** Use `useLayoutEffect` to resynchronize the direct DOM mutations with the current audio player state *before* the paint step, ensuring smooth, flicker-free performance. Use arrays of refs `useRef<(HTMLElement | null)[]>([])` if there are multiple elements per value (e.g., desktop/mobile displays).
