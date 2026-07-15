import { useEffect, useState } from 'react'
import { BACK_TO_TOP_THRESHOLD, scrollToTop } from '@/utils'

/**
 * useScrollToTop — back-to-top visibility tracking + scroll action.
 *
 * Watches the window's vertical scroll position against a pixel `threshold` and
 * exposes both an `isVisible` flag (whether the floating "back-to-top" affordance
 * should be shown) and a `scrollToTop()` action that returns the page to the top.
 *
 * This is the state/behavior backing for `components/ui/BackToTop`: the component
 * calls this hook once and uses `isVisible` to show/hide itself and `scrollToTop`
 * as its click handler. Both values come from a single hook call.
 *
 * The scroll action itself is NOT re-implemented here — the imported `scrollToTop`
 * (from `utils/scroll`, re-exported by the `@/utils` barrel) is exposed directly.
 * That helper centralizes the `prefers-reduced-motion` handling (smooth scroll for
 * most users, an instant jump for those who request reduced motion), so this hook
 * stays free of duplicated scroll logic (DRY).
 *
 * `handleScroll` runs once on mount so the flag is correct even when the page loads
 * already scrolled (deep-links, reloads, or restored scroll positions). The scroll
 * listener is registered as `{ passive: true }` so it never blocks scrolling, and
 * is removed on cleanup to avoid a listener leak. It re-subscribes only when
 * `threshold` changes.
 *
 * Client-only (Vite SPA; SSR is out of scope), so `window` is always defined — no
 * `typeof window` guard is needed.
 *
 * @param {number} [threshold=BACK_TO_TOP_THRESHOLD] - Vertical scroll distance in px
 *   past which `isVisible` becomes `true`. Defaults to the shared
 *   `BACK_TO_TOP_THRESHOLD` constant but can be overridden (e.g. `BackToTop`'s
 *   optional `threshold` prop).
 * @returns {{ isVisible: boolean, scrollToTop: () => void }} The current visibility
 *   flag and the reduced-motion-aware scroll-to-top action.
 *
 * @example
 * const { isVisible, scrollToTop } = useScrollToTop()
 * // or with a custom threshold:
 * const { isVisible, scrollToTop } = useScrollToTop(600)
 */
export function useScrollToTop(threshold = BACK_TO_TOP_THRESHOLD) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold)
    }

    // Set the correct initial value on mount (covers deep-links / reloads at a
    // scrolled position) before any scroll event fires.
    handleScroll()
    // Passive listener: never blocks the scroll thread (non-blocking perf).
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup: remove the listener on unmount / before re-subscribing.
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return { isVisible, scrollToTop }
}
