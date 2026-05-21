## 2026-05-21 - [Taranas Gallery Search Debounce]
 **Learning:** In `TaranasGallery`, updating the search query state immediately filters a potentially large array of audio tracks and rerenders the list on every keystroke.
 **Action:** Introduce a debounced state variable (e.g. `debouncedSearchQuery`) to defer array filtering and component rerendering until the user pauses typing, without blocking the immediate input field responsiveness.
