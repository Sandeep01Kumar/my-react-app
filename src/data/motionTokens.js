// Motion & geometry constants for the new-feature work (Statistics counters,
// carousels, and the CircularProgress primitive).
//
// WHY THIS FILE EXISTS
// The review flagged that the new hooks and motion-driven components carried
// bare numeric literals for animation durations, an autoplay interval, an
// IntersectionObserver threshold, an easing curve, and the circular dial's
// geometry (P5-F2). The project rule is "constants live in data files, business
// logic lives in hooks", and the shared `src/utils/animations.js` module — which
// owns the reveal variants — is READ-ONLY for this engagement, so its private
// `ease` control points cannot be re-exported from there. This module is the
// single, named "token-equivalent JS contract" that the review sanctioned in
// place of scattered magic numbers, keeping every motion/geometry value in one
// documented place that both hooks and components import through the `@/data`
// barrel (exactly like every other data module).
//
// NAMING: exported as `motionTokens` (not `motion`) so a component can import
// this alongside framer-motion's `motion` primitive without a name collision
// (e.g. `import { motion } from 'framer-motion'` + `import { motionTokens }
// from '@/data'`).
//
// UNIT CONVENTION: keys suffixed `Ms` are milliseconds (native timers /
// `requestAnimationFrame` elapsed math); keys suffixed `S` are seconds
// (framer-motion `transition.duration` is expressed in seconds); unitless keys
// are pixels (SVG geometry) or ratios (observer threshold).
//
// These are configuration VALUES, not derived math: structural formulas such as
// the count-up `easeOutCubic` curve, carousel modulo wrap-around, and the dial's
// radius/circumference stay inline in their hooks/components as the review
// explicitly permits ("retain genuinely structural mathematical values").

/**
 * Centralized, frozen motion & geometry token contract.
 *
 * @property {number[]} ease - Cubic-bezier control points for framer-motion
 *   `transition.ease`. Mirrors the `--ease` design token in
 *   `src/styles/variables.css` and the (module-private, non-exported) `ease`
 *   used by the reveal variants in `src/utils/animations.js`, so all new motion
 *   shares the app's single easing curve.
 * @property {number} countUpDurationMs - Total ramp duration for `useCountUp`,
 *   in milliseconds.
 * @property {number} countUpThreshold - IntersectionObserver visibility ratio
 *   that triggers the count-up. Intentionally equal to the exported
 *   `viewportOnce.amount` (0.2) in `src/utils/animations.js`, so a counter
 *   starts at the same "~20% visible" point as the scroll-reveal it sits with.
 * @property {number} carouselIntervalMs - Delay between automatic slide
 *   advances in `useCarousel`, in milliseconds.
 * @property {number} testimonialCrossfadeS - Testimonial slide crossfade
 *   duration, in seconds (framer-motion).
 * @property {number} modalCrossfadeS - Project-gallery image crossfade duration
 *   in the project modal, in seconds (framer-motion).
 * @property {number} circularProgressSize - Default width/height of the
 *   `CircularProgress` SVG dial, in pixels.
 * @property {number} circularProgressStroke - Default ring stroke width of the
 *   `CircularProgress` dial, in pixels.
 * @property {number} circularProgressSweepS - Duration of the dial's arc sweep
 *   animation, in seconds (framer-motion).
 */
export const motionTokens = Object.freeze({
  // Shared easing (mirrors the `--ease` token / animations.js `ease`).
  ease: [0.4, 0, 0.2, 1],

  // useCountUp (animated statistics counters).
  countUpDurationMs: 2000,
  countUpThreshold: 0.2,

  // useCarousel (testimonial autoplay + project gallery).
  carouselIntervalMs: 5000,

  // Carousel slide transitions (framer-motion, seconds).
  testimonialCrossfadeS: 0.4,
  modalCrossfadeS: 0.3,

  // CircularProgress dial geometry + arc sweep.
  circularProgressSize: 120,
  circularProgressStroke: 8,
  circularProgressSweepS: 0.8,
})
