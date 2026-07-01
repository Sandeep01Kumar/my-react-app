import { useMediaQuery } from './useMediaQuery'

/**
 * The media feature that matches when the user has enabled the OS/browser
 * "Reduce motion" accessibility setting. Declared once here as the single
 * source of truth for the query string.
 *
 * @type {string}
 */
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * usePrefersReducedMotion — reactively reports whether the user has requested
 * reduced motion at the OS/browser level.
 *
 * A DRY, reuse-first wrapper over the generic {@link useMediaQuery} hook: it
 * simply tracks the `(prefers-reduced-motion: reduce)` media query. All of the
 * `matchMedia` subscribe/cleanup logic lives in `useMediaQuery`, so there is no
 * duplicated listener code and no listener leak. The value updates
 * automatically if the user toggles the setting while the app is open.
 *
 * This hook only *detects* the preference — the caller decides how to act on
 * it (e.g. skip entrance/scroll-reveal animations, drop the Hero's animated
 * background, render progress bars at their final value instead of animating).
 * It is the app-wide gate for Framer Motion animations, consumed by
 * `components/ui/Reveal`, `sections/Hero` (which also forwards it to
 * `useTypewriter` as its `reduced` option), and `components/ui/ProgressBar`.
 *
 * @returns {boolean} `true` when the user prefers reduced motion, otherwise `false`.
 *
 * @example
 * const reduced = usePrefersReducedMotion()
 * // Gate an animation on the preference:
 * <motion.div animate={reduced ? undefined : { opacity: 1, y: 0 }} />
 */
export function usePrefersReducedMotion() {
  return useMediaQuery(REDUCED_MOTION_QUERY)
}
