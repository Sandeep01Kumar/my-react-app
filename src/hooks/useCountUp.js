import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * useCountUp — animates a number from a starting value up to a target, ramping
 * the displayed value on `requestAnimationFrame` and kicking off only once the
 * observed element first scrolls into view.
 *
 * Built dependency-free (no `react-countup` / `countup.js`) to honor the
 * small-bundle, avoid-unnecessary-dependencies rule (AAP §0.2.2, §0.3.2). The
 * ramp is driven by a single `requestAnimationFrame` loop and started by an
 * `IntersectionObserver`, mirroring the shared `viewportOnce`
 * (`{ once: true, amount: 0.2 }`) reveal config in `@/utils` animations.js — the
 * observer uses a `threshold` of `0.2` and disconnects on the first
 * intersection, so the count-up plays exactly once when ~20% of the element is
 * visible.
 *
 * Fully reduced-motion aware (AAP §0.6.3): when the user has requested reduced
 * motion the hook runs no animation at all — no observer, no rAF loop — and
 * reports the final `target` immediately. Following the same derive-at-return
 * discipline as `useTypewriter` (`if (reduced) return words[0]`), that final
 * value is produced at return time rather than pushed through `setValue` inside
 * the effect, which keeps the effect body free of synchronous state updates
 * (ESLint `react-hooks/set-state-in-effect`). The observable result is
 * identical: the consumer sees the final number immediately and it never
 * animates.
 *
 * Implementation notes:
 * - The ramp eases with an `easeOutCubic` curve (`1 - (1 - t)³`) for a natural
 *   deceleration toward the target.
 * - On the final frame (`progress >= 1`) the value is snapped to the exact
 *   `target`, so the settled DOM text equals `target` precisely — important
 *   because the consuming `StatCard` exposes this number to assistive tech.
 * - `setValue` is only ever called inside the rAF tick (an asynchronous
 *   callback), never synchronously in the effect body.
 * - `target` and the timing/format options are all in the effect's dependency
 *   array, so changing the target cleanly tears down the previous observer and
 *   rAF loop (via cleanup) and starts a fresh ramp toward the new target.
 * - Cleanup disconnects the observer and cancels any pending frame, so no
 *   `setValue` can fire after unmount (no post-unmount update warning).
 *
 * The returned `value` is the raw display NUMBER; any presentation suffix
 * (`+`, `k`, `%`, …) is the consuming section's concern, not this hook's. The
 * consumer attaches the returned `ref` to whatever DOM node should trigger the
 * count when it scrolls into view (e.g. the `StatCard` wrapper) — this hook does
 * not assume `StatCard` forwards a ref.
 *
 * @param {number} target - The final value to count up to.
 * @param {object} [options] - Timing and formatting options.
 * @param {number} [options.duration=2000] - Total ramp duration in milliseconds.
 * @param {number} [options.decimals=0] - Number of decimal places to round the
 *   in-flight value to (`0` → integers, `1` → one decimal place, …). The final
 *   frame always snaps to the exact `target`.
 * @param {number} [options.start=0] - The value the count begins from.
 * @returns {{ref: object, value: number}} An object where `ref` is a React ref
 *   to attach to the DOM node to observe, and `value` is the current display
 *   number to render.
 *
 * @example
 * const { ref, value } = useCountUp(120)
 * return <div ref={ref}>{value}+</div>
 *
 * @example
 * // A one-decimal metric ramped over 1.5s, starting from 0:
 * const { ref, value } = useCountUp(4.9, { duration: 1500, decimals: 1 })
 */
export function useCountUp(target, options = {}) {
  const { duration = 2000, decimals = 0, start = 0 } = options
  const reduced = usePrefersReducedMotion()
  const ref = useRef(null)
  const [value, setValue] = useState(start)

  useEffect(() => {
    // Reduced motion: run no animation. The final value is derived at return
    // time (see below) rather than pushed through setValue here — keeping the
    // effect body free of synchronous state updates
    // (ESLint react-hooks/set-state-in-effect). Observable result is identical:
    // the consumer sees the final target immediately and it never animates.
    if (reduced) {
      return
    }

    // The consumer may not have attached the ref to a node yet — nothing to
    // observe, so bail out (no observer, no cleanup needed).
    const node = ref.current
    if (!node) {
      return
    }

    let rafId
    let startTime

    // One animation frame: compute eased progress and push the current value.
    const tick = (now) => {
      if (startTime === undefined) {
        startTime = now
      }
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutCubic — quick start, gentle deceleration into the target.
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = start + (target - start) * eased
      const factor = 10 ** decimals
      // Snap to the exact target on the final frame so the settled DOM value
      // equals `target` exactly (correct for assistive tech reading StatCard).
      setValue(progress >= 1 ? target : Math.round(current * factor) / factor)
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    // Start the ramp only after the element first enters the viewport, then
    // disconnect so it runs exactly once — mirrors the `viewportOnce`
    // (`{ once: true, amount: 0.2 }`) config in @/utils animations.js
    // (threshold 0.2 + one-shot).
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect()
            rafId = requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.2 },
    )
    observer.observe(node)

    // Cleanup: stop observing and cancel any in-flight frame. Guarding `rafId`
    // makes cancelAnimationFrame a safe no-op when the ramp never started.
    return () => {
      observer.disconnect()
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [target, duration, decimals, start, reduced])

  // Reduced motion: show the final value instantly (derived here, not via
  // setValue in the effect — same discipline as useTypewriter's `words[0]`).
  if (reduced) {
    return { ref, value: target }
  }

  return { ref, value }
}
