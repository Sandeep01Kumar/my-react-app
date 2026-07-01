// Smooth-scrolling helpers.
//
// Framework-agnostic (no React) utilities consumed by the Navbar links,
// Footer quick links, and the BackToTop button. `scrollToId` scrolls a
// section into view while honoring the sticky-nav offset; `scrollToTop`
// returns to the top of the page. Both respect the user's
// `prefers-reduced-motion` setting, falling back to an instant jump.
//
// Depends only on NAV_HEIGHT from ./constants so that the navbar height is a
// single, numeric source of truth for the scroll offset.

import { NAV_HEIGHT } from './constants'

// True when the user has requested reduced motion.
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Smoothly scroll the section with the given id into view, offset by the
// sticky navbar height so the heading isn't hidden beneath it.
export function scrollToId(id) {
  const element = document.getElementById(id)
  if (!element) return
  const top = element.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT
  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}

// Smoothly scroll back to the top of the page.
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}
