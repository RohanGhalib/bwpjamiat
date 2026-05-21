## 2024-05-18 - Optimized sortEventsBySchedule and getEventState
**Learning:** `sortEventsBySchedule` recalculates `getEventStartTime` (which calls `Date.parse`) inside the `.sort` comparison function. Array sorts take O(N log N) time, so doing an expensive parse on every comparison is very inefficient. `getEventState` and the loop inside `sortEventsBySchedule` instantiate `new Date()` and `Date.now()` repeatedly.
**Action:** Map events to their parsed times before sorting them to avoid repeated string parsing. Pass down `now` or evaluate `Date.now()` and `new Date()` outside of loops.

## 2024-05-21 - Removed client-side overfetching in HeroBubble
**Learning:** `HeroBubble` was using `onSnapshot` to fetch the ENTIRE `events` collection on the client just to display the single most recent event. In Firebase, this downloads all documents, causing severe payload and latency issues as the collection grows.
**Action:** Move data fetching to a Server Component using the cached `getAllEvents()` and pass the single `featuredEvent` to the client component as a prop.
