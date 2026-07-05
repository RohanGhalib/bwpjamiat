## 2024-05-18 - Optimized sortEventsBySchedule and getEventState
**Learning:** `sortEventsBySchedule` recalculates `getEventStartTime` (which calls `Date.parse`) inside the `.sort` comparison function. Array sorts take O(N log N) time, so doing an expensive parse on every comparison is very inefficient. `getEventState` and the loop inside `sortEventsBySchedule` instantiate `new Date()` and `Date.now()` repeatedly.
**Action:** Map events to their parsed times before sorting them to avoid repeated string parsing. Pass down `now` or evaluate `Date.now()` and `new Date()` outside of loops.

## 2024-05-22 - Missing sizes attribute on Image components with fill
**Learning:** In Next.js, when using the `<Image>` component with the `fill` layout, if the `sizes` attribute is omitted, the browser assumes the image will occupy the full width of the viewport (`100vw`). This leads to the browser downloading unnecessarily large images for components that only occupy a fraction of the screen, significantly impacting load times and increasing bandwidth consumption.
**Action:** Always explicitly define a `sizes` attribute for `<Image>` components using `fill` to provide the browser with accurate information about the image's intended display size at different breakpoints, allowing it to select the most optimal image size.

## 2026-05-23 - Replace native img tag with Next.js Image component
**Learning:** Replacing native `<img>` tags with Next.js `<Image>` components allows Next.js to apply automatic optimizations like WebP conversion, responsive resizing, and lazy loading, which can significantly improve page load performance. Native `<img>` tags might cause slower LCP (Largest Contentful Paint) and higher bandwidth usage.
**Action:** Always prefer the Next.js `<Image>` component over the native `<img>` tag unless there is a specific reason not to.
## 2024-03-22 - [DOM Ref Targeting for Progress Bars]
**Learning:** When moving progress bar state from `useState` to `useRef` array-based DOM mutations, attaching the ref to the outer container instead of the inner filler `div` breaks the UI by shrinking the clickable scrubber track itself.
**Action:** Always ensure progress bar `useRef` mutations target the inner `div` that represents the fill percentage, not the interactive outer container.

## 2024-03-22 - [ESLint Function Ordering with useEffect]
**Learning:** Defining a `useEffect` that calls a local functional component method before the method is defined will trigger an ESLint "accessed before it is declared" error.
**Action:** Declare helper functions inside components *before* any `useEffect` blocks that invoke them to satisfy linter requirements.
