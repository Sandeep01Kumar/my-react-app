import { useEffect, useState } from 'react'
import { navLinks } from '@/data'
import { SECTION_OBSERVER } from '@/utils'

/**
 * useActiveSection — reports the `id` of the page section currently occupying
 * the vertical middle of the viewport, so the navigation can highlight its
 * matching link ("scroll spy").
 *
 * The observed ids come straight from {@link navLinks} (`@/data`), the single
 * source of truth for the site's section anchors, so the observer, the nav
 * anchor hrefs, and the actual `<section id="…">` elements rendered by
 * `pages/Home` stay in sync automatically. Consumed by
 * `components/layout/Navbar` to apply the active-link style.
 *
 * Implementation notes:
 * - Uses a single `IntersectionObserver` configured with the shared
 *   {@link SECTION_OBSERVER} options (`@/utils`). Its `rootMargin` of
 *   `-45% 0px -45% 0px` shrinks the observation band to a thin strip across the
 *   vertical center of the viewport, so the "active" section is whichever one
 *   crosses that center line — which feels natural for nav highlighting.
 * - DOM nodes are resolved once on mount via `document.getElementById`. Any id
 *   whose element is not (yet) mounted is filtered out, guarding against a
 *   render race; if nothing resolves, the effect no-ops. In practice
 *   `pages/Home` renders every section before this hook's result matters.
 * - The observer is fully torn down on unmount with `observer.disconnect()`,
 *   which releases every observation at once — no per-element `unobserve` and
 *   no listener leak or post-unmount state update.
 * - `setActiveId` runs inside the asynchronous observer callback (never
 *   synchronously in the effect body), and the effect's only other references
 *   are the module-level constants `navLinks`/`SECTION_OBSERVER` plus the
 *   stable state setter — so the empty dependency array `[]` is correct and the
 *   ESLint `react-hooks/exhaustive-deps` contract is satisfied.
 *
 * The initial value is the first nav id (`navLinks[0]?.id`, i.e. `home`), with
 * a `?? ''` fallback that defensively handles an empty `navLinks` array.
 *
 * @returns {string} The `id` of the section currently in view (e.g. `'home'`,
 *   `'about'`, …). Starts as the first section's id before the first scroll.
 *
 * @example
 * const activeId = useActiveSection()
 * // In the Navbar, mark the matching link as active:
 * <a href={`#${link.id}`} aria-current={activeId === link.id ? 'true' : undefined}>
 *   {link.label}
 * </a>
 */
export function useActiveSection() {
  const [activeId, setActiveId] = useState(navLinks[0]?.id ?? '')

  useEffect(() => {
    // Resolve the DOM node for every nav id, dropping any that are not mounted
    // (the filter guards against a mount race — sections may not all exist yet).
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((section) => section !== null)

    // Nothing on the page to observe — bail out (no observer, no cleanup needed).
    if (sections.length === 0) {
      return
    }

    // A single observer watches every section. Whenever a section enters the
    // centered observation band, it becomes the active section.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }, SECTION_OBSERVER)

    sections.forEach((section) => observer.observe(section))

    // Cleanup: disconnect all observations in one call on unmount.
    return () => observer.disconnect()
  }, [])

  return activeId
}
