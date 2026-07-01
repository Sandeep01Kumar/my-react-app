import { useCallback, useSyncExternalStore } from 'react'

/**
 * useMediaQuery — reactively tracks whether a CSS media query currently matches.
 *
 * A tiny, dependency-free hook built on the standard `window.matchMedia` API. The
 * returned boolean reflects the current match state on first render and updates
 * automatically whenever the match state changes (e.g. on viewport resize or a
 * change to the user's OS preferences), including when the `query` argument itself
 * changes between renders.
 *
 * This is the foundational responsive primitive for the app: `Navbar` uses it to
 * collapse into the mobile hamburger menu (e.g. `useMediaQuery('(max-width: 768px)')`)
 * and `usePrefersReducedMotion` reuses it for `'(prefers-reduced-motion: reduce)'`.
 *
 * Implemented with React's `useSyncExternalStore` — the idiomatic React 19 API for
 * subscribing a component to an external store such as a `MediaQueryList`. It yields
 * the correct value on the very first render (no flash / extra render), stays in sync
 * across concurrent renders without tearing, and tears the subscription down on
 * unmount (and re-subscribes when `query` changes), so there is no listener leak.
 *
 * Client-only (Vite SPA, SSR is out of scope), so `window` is always defined — no
 * `typeof window` guard and no server snapshot are needed.
 *
 * @param {string} query - A CSS media query string, e.g. `'(max-width: 768px)'`.
 * @returns {boolean} `true` while the query matches, otherwise `false`.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)')
 */
export function useMediaQuery(query) {
  // Subscribe to the MediaQueryList for `query`. Memoized per-`query` so
  // useSyncExternalStore only (re)subscribes when `query` actually changes,
  // avoiding needless listener churn on every render.
  const subscribe = useCallback(
    (onStoreChange) => {
      const mediaQueryList = window.matchMedia(query)
      mediaQueryList.addEventListener('change', onStoreChange)
      return () => mediaQueryList.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  // Read the current match state. Returns a primitive boolean, so React's Object.is
  // snapshot comparison is stable between changes (no re-render loop).
  const getSnapshot = () => window.matchMedia(query).matches

  return useSyncExternalStore(subscribe, getSnapshot)
}
