import { useEffect, useState } from 'react'

/**
 * useBodyScrollLocked — reactive flag for whether the document body's scroll is
 * currently locked (`document.body.style.overflow === 'hidden'`).
 *
 * The app locks body scroll whenever a blocking overlay is open: the reusable
 * `components/ui/Modal` dialog does this while open, and
 * `components/layout/Navbar` does the same while its mobile menu is open. Both
 * set `document.body.style.overflow = 'hidden'` and restore the prior value on
 * close. This hook turns that shared, imperative DOM signal into a reactive
 * boolean so other UI — notably the floating `components/ui/BackToTop` control —
 * can respond to "a blocking overlay is open" without any of those components
 * needing to know about one another (no shared store, no prop drilling, and no
 * change to `Modal`).
 *
 * Why observe the body's `style` attribute rather than track open-state props:
 * the lock is the single, authoritative "a blocking overlay is showing" signal
 * in this SPA, and multiple independent overlays already use it. A
 * `MutationObserver` scoped to `document.body`'s `style` attribute reflects every
 * lock/unlock (including nested locks, where each overlay's save/restore keeps
 * the value `hidden` until the last overlay closes) with zero coupling.
 *
 * The initial value is read synchronously on mount, so a lock that was already
 * in place before this hook mounted is reported correctly. The observer is
 * disconnected on unmount, so there is no listener leak and no post-unmount
 * state update.
 *
 * Client-only (Vite SPA; SSR is out of scope), matching the other hooks in this
 * folder — `document` is always defined, so no `typeof document` guard is needed.
 *
 * @returns {boolean} `true` while `document.body` scroll is locked (an overlay is
 *   open), `false` otherwise.
 *
 * @example
 * const overlayOpen = useBodyScrollLocked()
 * // Hide a floating control while any overlay (modal / mobile menu) is open:
 * <BackToTop suppressed={overlayOpen} />
 */
export function useBodyScrollLocked() {
  const [locked, setLocked] = useState(
    () => document.body.style.overflow === 'hidden',
  )

  useEffect(() => {
    const body = document.body
    const read = () => setLocked(body.style.overflow === 'hidden')

    // Re-sync on mount in case the lock changed between the initial render and
    // this effect running (e.g. an overlay opened during that window).
    read()

    // Watch only the body's inline `style` attribute so a lock/unlock
    // (overflow: hidden ↔ restored) is reflected reactively, with no polling.
    const observer = new MutationObserver(read)
    observer.observe(body, { attributes: true, attributeFilter: ['style'] })

    return () => observer.disconnect()
  }, [])

  return locked
}
