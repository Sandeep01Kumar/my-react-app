import { useCallback, useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * useCarousel — index + autoplay controller for a slide carousel.
 *
 * Owns the *behavior* of a carousel and nothing else: the active slide index,
 * the auto-advance timer, and the imperative navigation actions. It renders no
 * markup — the consuming component provides the slides, the prev/next controls
 * (reusing the `Button` primitive), and wires `pause`/`resume` to the pointer
 * and focus events. Presentation stays in the component; logic lives here, per
 * the app's "business logic in hooks" rule.
 *
 * Built without any carousel/slider dependency (no `swiper`, `embla`, etc.) to
 * honor the small-bundle / avoid-unnecessary-dependencies rule (AAP §0.3.2). It
 * is meant to be composed with `framer-motion`'s `AnimatePresence` in the
 * consumer for the crossfade/slide transition. Consumers:
 * `sections/Testimonials` (auto-sliding testimonial carousel) and
 * `sections/Projects/ProjectModal` (project image gallery).
 *
 * Autoplay is fully reduced-motion aware (AAP §0.7.3 / global reduced-motion
 * reset): when the user prefers reduced motion the auto-advance timer is never
 * started, so slides never move on their own — yet `next`, `prev`, and `goTo`
 * still work, so keyboard/pointer users can always navigate manually
 * (accessibility). Autoplay also pauses whenever `isPaused` is true; the
 * consumer typically calls `pause` on `mouseenter`/`focus` and `resume` on
 * `mouseleave`/`blur` so the slideshow holds still while the user is reading or
 * interacting.
 *
 * All navigation wraps around with modulo arithmetic: advancing past the last
 * slide returns to the first, going back from the first jumps to the last, and
 * `goTo` accepts any integer (including negatives) and normalizes it into range.
 * The active index returned to the consumer is *derived* at return time from the
 * current `length`, so if `length` shrinks between renders (e.g. the slide list
 * changes) the returned index is always valid and never points past the end —
 * this is done without a clamp effect, keeping the effect body free of
 * synchronous state updates (ESLint `react-hooks/set-state-in-effect`). Every
 * `setActiveIndex` call happens inside the interval callback or inside an
 * event-driven handler, never synchronously during render or in the effect body.
 *
 * The autoplay effect clears its interval on unmount and whenever any dependency
 * changes, so there are no dangling timers and no "state update on an unmounted
 * component" warnings. Client-only (Vite SPA; SSR is out of scope), so
 * `setInterval`/`clearInterval` from `globals.browser` are always available.
 *
 * @param {object} [options={}] - Carousel configuration.
 * @param {number} [options.length] - Total number of slides. Navigation and
 *   autoplay are no-ops when this is `0`, `1`, or falsy (nothing to advance).
 * @param {boolean} [options.autoPlay=true] - Whether the carousel should
 *   auto-advance. Ignored (no timer) under `prefers-reduced-motion`.
 * @param {number} [options.interval=5000] - Delay in ms between automatic
 *   advances while autoplaying.
 * @returns {{
 *   activeIndex: number,
 *   next: () => void,
 *   prev: () => void,
 *   goTo: (index: number) => void,
 *   isPaused: boolean,
 *   pause: () => void,
 *   resume: () => void,
 * }} The current (always in-range) active slide index, the referentially stable
 *   `next`/`prev`/`goTo` navigation actions, the `isPaused` flag, and the
 *   `pause`/`resume` actions the consumer wires to hover/focus.
 *
 * @example
 * // Auto-sliding testimonial carousel that pauses on hover/focus:
 * const { activeIndex, next, prev, pause, resume } = useCarousel({
 *   length: testimonials.length,
 * })
 * return (
 *   <div onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume}>
 *     <TestimonialCard {...testimonials[activeIndex]} />
 *     <Button onClick={prev}>Previous</Button>
 *     <Button onClick={next}>Next</Button>
 *   </div>
 * )
 *
 * @example
 * // Manual-only image gallery (no autoplay) with dot navigation:
 * const { activeIndex, goTo } = useCarousel({ length: gallery.length, autoPlay: false })
 */
export function useCarousel({ length, autoPlay = true, interval = 5000 } = {}) {
  const reduced = usePrefersReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const goTo = useCallback(
    (index) => {
      // Nothing to navigate for an empty/single-slide carousel.
      if (!length || length <= 0) {
        return
      }
      // Wrap into range; the double-modulo handles negative indices too
      // (e.g. goTo(-1) on a length-3 list resolves to 2).
      setActiveIndex(((index % length) + length) % length)
    },
    [length],
  )

  const next = useCallback(() => {
    if (!length || length <= 0) {
      return
    }
    // Functional update so the advance is correct even if several fire before a
    // re-render; wraps from the last slide back to the first.
    setActiveIndex((i) => (i + 1) % length)
  }, [length])

  const prev = useCallback(() => {
    if (!length || length <= 0) {
      return
    }
    // `+ length` keeps the result non-negative before the modulo, so going back
    // from the first slide wraps to the last.
    setActiveIndex((i) => (i - 1 + length) % length)
  }, [length])

  const pause = useCallback(() => setIsPaused(true), [])
  const resume = useCallback(() => setIsPaused(false), [])

  useEffect(() => {
    // Autoplay runs ONLY when: motion is allowed, autoPlay is on, the carousel
    // is not paused, and there is more than one slide. It is disabled entirely
    // under reduced motion and never advances a 0/1-length list. `setActiveIndex`
    // runs inside the interval callback (asynchronously) — never synchronously in
    // the effect body — so it complies with react-hooks/set-state-in-effect.
    if (reduced || !autoPlay || isPaused || !length || length <= 1) {
      return
    }
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % length)
    }, interval)
    // Cleanup: stop the timer on unmount and before re-running on any dep change,
    // so there are no dangling timers or post-unmount updates.
    return () => clearInterval(id)
  }, [reduced, autoPlay, isPaused, length, interval])

  // Derive a safe, in-range index at return time so a shrinking `length` can
  // never yield an out-of-range index (e.g. stored 2 but the list is now length
  // 2 -> 0). Doing this here — rather than with a clamp effect that calls
  // setState — keeps the effect body free of synchronous state updates.
  const safeIndex = length > 0 ? ((activeIndex % length) + length) % length : 0

  return { activeIndex: safeIndex, next, prev, goTo, isPaused, pause, resume }
}
