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
 * is meant to be composed with `framer-motion` in the consumer for the slide
 * transition. Consumers: `sections/Testimonials` (auto-sliding testimonial
 * carousel) and `sections/Projects/ProjectModal` (project image gallery).
 *
 * Autoplay is fully reduced-motion aware (AAP §0.7.3 / global reduced-motion
 * reset): when the user prefers reduced motion the auto-advance timer is never
 * started, so slides never move on their own — yet `next`, `prev`, and `goTo`
 * still work, so keyboard/pointer users can always navigate manually
 * (accessibility).
 *
 * Pause model — INDEPENDENT reasons (accessibility correctness). Autoplay is
 * gated on three separately tracked pause reasons rather than a single boolean:
 *   - `pointer` — the pointer is hovering the carousel (wire to mouseenter/leave);
 *   - `focus`   — keyboard focus is inside the carousel (wire to focus/blur);
 *   - `user`    — the visitor explicitly pressed the Play/Pause toggle.
 * Autoplay runs only when ALL THREE are false. Tracking them independently fixes
 * the compound-state bug where releasing one reason (e.g. `mouseleave` clearing
 * `pointer`) would wrongly resume autoplay while another reason still holds
 * (e.g. keyboard focus is still inside, or the user had pressed Pause). The
 * `user` reason is PERSISTENT — it changes only via `togglePlay`, so it survives
 * transient hover/focus churn and keeps autoplay off until the visitor opts back
 * in; `isPlaying` reflects that explicit intent so a Play/Pause label stays
 * stable while the visitor merely reads.
 *
 * Announcement source. `changeSource` records what caused the most recent index
 * change: `'user'` for a manual `next`/`prev`/`goTo`, `'auto'` for an autoplay
 * tick, `null` before any change. A consumer uses it to keep an `aria-live`
 * region SILENT during autoplay (map `'auto'`/`null` → `aria-live="off"`) and
 * announce only user-initiated changes (`'user'` → `aria-live="polite"`), so a
 * screen reader is not interrupted by every automatic rotation.
 *
 * All navigation wraps around with modulo arithmetic: advancing past the last
 * slide returns to the first, going back from the first jumps to the last, and
 * `goTo` accepts any integer (including negatives) and normalizes it into range.
 * The active index returned to the consumer is *derived* at return time from the
 * current `length`, so if `length` shrinks between renders the returned index is
 * always valid and never points past the end — done without a clamp effect,
 * keeping the effect body free of synchronous state updates
 * (ESLint `react-hooks/set-state-in-effect`). Every `setActiveIndex` call happens
 * inside the interval callback or an event-driven handler, never synchronously in
 * the effect body; the one render-time reset (below) uses React's supported
 * "adjust state while rendering" pattern, not an effect.
 *
 * Reset on identity change. Pass `resetKey` (e.g. the current item's id) to snap
 * the carousel back to the first slide whenever that identity changes — used by
 * `ProjectModal` so switching or reopening a project starts its gallery at image
 * one instead of resuming a stale index. Implemented by comparing `resetKey` to
 * its previous value DURING RENDER (storing the previous value in state), so the
 * reset applies before paint and adds no effect.
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
 * @param {*} [options.resetKey] - Optional identity value; when it changes the
 *   active index resets to `0`. Omit it (as the auto-sliding testimonial
 *   carousel does) to never auto-reset.
 * @returns {{
 *   activeIndex: number,
 *   next: () => void,
 *   prev: () => void,
 *   goTo: (index: number) => void,
 *   isPaused: boolean,
 *   pause: (reason?: 'pointer' | 'focus' | 'user') => void,
 *   resume: (reason?: 'pointer' | 'focus' | 'user') => void,
 *   isPlaying: boolean,
 *   togglePlay: () => void,
 *   changeSource: 'user' | 'auto' | null,
 * }} The current (always in-range) active slide index; the referentially stable
 *   `next`/`prev`/`goTo` navigation actions; `isPaused` (any reason active) with
 *   the reason-scoped `pause`/`resume` the consumer wires to hover/focus;
 *   `isPlaying` + `togglePlay` for a persistent user Play/Pause control; and
 *   `changeSource` for announcement gating.
 *
 * @example
 * // Auto-sliding testimonial carousel that pauses on hover AND focus
 * // independently, with a persistent Play/Pause toggle:
 * const { activeIndex, next, prev, pause, resume, isPlaying, togglePlay } =
 *   useCarousel({ length: testimonials.length })
 * return (
 *   <div
 *     onMouseEnter={() => pause('pointer')} onMouseLeave={() => resume('pointer')}
 *     onFocus={() => pause('focus')} onBlur={() => resume('focus')}
 *   >
 *     <TestimonialCard {...testimonials[activeIndex]} />
 *     <Button onClick={prev}>Previous</Button>
 *     <Button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</Button>
 *     <Button onClick={next}>Next</Button>
 *   </div>
 * )
 *
 * @example
 * // Manual-only image gallery (no autoplay) that resets when the project
 * // changes, with dot navigation:
 * const { activeIndex, goTo } = useCarousel({
 *   length: gallery.length,
 *   autoPlay: false,
 *   resetKey: project?.id,
 * })
 */
export function useCarousel({ length, autoPlay = true, interval = 5000, resetKey } = {}) {
  const reduced = usePrefersReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)

  // Independent pause reasons (see JSDoc). Autoplay runs only when ALL are
  // false; tracking them separately prevents one reason's release from resuming
  // while another still holds. `user` is the persistent Play/Pause choice.
  const [pauseReasons, setPauseReasons] = useState({
    pointer: false,
    focus: false,
    user: false,
  })

  // Source of the most recent index change ('user' | 'auto' | null) so the
  // consumer can announce only user-initiated changes and stay silent on
  // automatic rotations.
  const [changeSource, setChangeSource] = useState(null)

  // Track the previous `resetKey` so a change snaps back to the first slide.
  // Uses React's supported "adjust state while rendering" pattern (compare the
  // prop to its stored previous value during render) INSTEAD of an effect, which
  // keeps the effect body free of synchronous state updates
  // (react-hooks/set-state-in-effect) and applies the reset before paint.
  const [prevResetKey, setPrevResetKey] = useState(resetKey)
  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey)
    setActiveIndex(0)
    setChangeSource(null)
  }

  const goTo = useCallback(
    (index) => {
      // Nothing to navigate for an empty/single-slide carousel.
      if (!length || length <= 0) {
        return
      }
      // Wrap into range; the double-modulo handles negative indices too
      // (e.g. goTo(-1) on a length-3 list resolves to 2).
      setActiveIndex(((index % length) + length) % length)
      setChangeSource('user')
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
    setChangeSource('user')
  }, [length])

  const prev = useCallback(() => {
    if (!length || length <= 0) {
      return
    }
    // `+ length` keeps the result non-negative before the modulo, so going back
    // from the first slide wraps to the last.
    setActiveIndex((i) => (i - 1 + length) % length)
    setChangeSource('user')
  }, [length])

  // Reason-scoped pause/resume. The consumer wires pointer + focus to their own
  // events, e.g. `pause('pointer')` on mouseenter and `pause('focus')` on focus.
  // Object identity is preserved when a set is a no-op so unrelated renders are
  // avoided.
  const pause = useCallback((reason = 'pointer') => {
    setPauseReasons((prev) => (prev[reason] ? prev : { ...prev, [reason]: true }))
  }, [])
  const resume = useCallback((reason = 'pointer') => {
    setPauseReasons((prev) => (prev[reason] ? { ...prev, [reason]: false } : prev))
  }, [])

  // Persistent, user-controlled Play/Pause. Unlike the transient pointer/focus
  // reasons, `user` only changes when the visitor presses the toggle, so it
  // survives hover/focus churn and keeps autoplay off until they opt back in.
  const togglePlay = useCallback(() => {
    setPauseReasons((prev) => ({ ...prev, user: !prev.user }))
  }, [])

  // Paused if ANY reason holds; "playing" reflects only the user's explicit
  // intent (not transient hover/focus) so a Play/Pause control label stays
  // stable while the visitor merely reads a slide.
  const isPaused = pauseReasons.pointer || pauseReasons.focus || pauseReasons.user
  const isPlaying = !pauseReasons.user

  useEffect(() => {
    // Autoplay runs ONLY when: motion is allowed, autoPlay is on, NO pause
    // reason is active, and there is more than one slide. It is disabled entirely
    // under reduced motion and never advances a 0/1-length list. `setActiveIndex`
    // / `setChangeSource` run inside the interval callback (asynchronously) —
    // never synchronously in the effect body — so this complies with
    // react-hooks/set-state-in-effect.
    if (reduced || !autoPlay || isPaused || !length || length <= 1) {
      return
    }
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % length)
      setChangeSource('auto')
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

  return {
    activeIndex: safeIndex,
    next,
    prev,
    goTo,
    isPaused,
    pause,
    resume,
    isPlaying,
    togglePlay,
    changeSource,
  }
}
