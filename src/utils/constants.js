// Shared application constants (framework-agnostic, browser-safe).
//
// This is the lowest-level module in src/utils: it has ZERO dependencies and
// is imported by scroll.js and several hooks (useMediaQuery, useActiveSection,
// useScrollToTop). The exported names and values are contracts other files
// depend on, so they are intentionally fixed.

// Responsive breakpoints in px. Keep these values IN SYNC with the CSS
// breakpoints used across *.module.css (media queries) and styles/variables.css.
// Consumed by useMediaQuery and any responsive logic.
export const BREAKPOINTS = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
}

// Height of the sticky navbar in px. MUST match `--nav-height` in
// styles/variables.css so anchor scrolling lands sections correctly
// beneath the fixed navbar. Kept numeric (not a CSS string) so scroll.js can
// subtract it when computing programmatic smooth-scroll offsets.
export const NAV_HEIGHT = 72

// Vertical scroll distance (px) after which the BackToTop button appears.
export const BACK_TO_TOP_THRESHOLD = 400

// Default IntersectionObserver options for active-section detection
// (used by useActiveSection). rootMargin shrinks the observation band to
// roughly the vertical center of the viewport so the "current" section is
// whichever occupies the middle of the screen.
export const SECTION_OBSERVER = {
  rootMargin: '-45% 0px -45% 0px',
  threshold: 0,
}
