## 2024-05-18 - Optimized sortEventsBySchedule and getEventState
**Learning:** `sortEventsBySchedule` recalculates `getEventStartTime` (which calls `Date.parse`) inside the `.sort` comparison function. Array sorts take O(N log N) time, so doing an expensive parse on every comparison is very inefficient. `getEventState` and the loop inside `sortEventsBySchedule` instantiate `new Date()` and `Date.now()` repeatedly.
**Action:** Map events to their parsed times before sorting them to avoid repeated string parsing. Pass down `now` or evaluate `Date.now()` and `new Date()` outside of loops.

## 2024-05-22 - Missing sizes attribute on Image components with fill
**Learning:** In Next.js, when using the `<Image>` component with the `fill` layout, if the `sizes` attribute is omitted, the browser assumes the image will occupy the full width of the viewport (`100vw`). This leads to the browser downloading unnecessarily large images for components that only occupy a fraction of the screen, significantly impacting load times and increasing bandwidth consumption.
**Action:** Always explicitly define a `sizes` attribute for `<Image>` components using `fill` to provide the browser with accurate information about the image's intended display size at different breakpoints, allowing it to select the most optimal image size.

## 2026-05-23 - Replace native img tag with Next.js Image component
**Learning:** Replacing native `<img>` tags with Next.js `<Image>` components allows Next.js to apply automatic optimizations like WebP conversion, responsive resizing, and lazy loading, which can significantly improve page load performance. Native `<img>` tags might cause slower LCP (Largest Contentful Paint) and higher bandwidth usage.
**Action:** Always prefer the Next.js `<Image>` component over the native `<img>` tag unless there is a specific reason not to.
## 2026-07-04 - Uncontrolled DOM Mutations Reverted by React Render Cycle
**Learning:** When using `useRef` to bypass React state for high-frequency DOM updates (like audio progress bars), any unrelated state change that triggers a re-render (like toggling fullscreen) will cause React to overwrite the manually mutated DOM elements back to their hardcoded JSX initial values (e.g., `style={{width: '0%'}}`).
**Action:** When manually mutating the DOM via refs in a React component, always include a `useEffect` without dependency array (or carefully selected dependencies) to re-sync the uncontrolled DOM state with the underlying data source after every render.

## 2026-07-04 - Ref Array Memory Leaks
**Learning:** Using `.push(el)` inside an inline ref callback (`<span ref={(el) => refs.current.push(el)}>`) creates a memory leak because the inline function is recreated on every render, causing React to call it repeatedly and infinitely grow the array.
**Action:** Always use index-based assignment for ref arrays (`refs.current[0] = el`) or clear the array at the start of the render cycle.
