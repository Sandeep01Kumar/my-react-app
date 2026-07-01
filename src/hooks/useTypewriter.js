import { useEffect, useState } from 'react'

/**
 * useTypewriter — a small, dependency-free animated "typewriter" effect.
 *
 * Types a word out one character at a time, pauses at the full word, deletes it
 * one character at a time, then advances to the next word and repeats — cycling
 * through the provided `words` array indefinitely. Returns the current display
 * string, which the consumer renders (typically after a blinking-cursor element).
 *
 * Built without any external animation library (no `typed.js` /
 * `react-type-animation`) to honor the small-bundle rule (AAP §0.3.2). The
 * animation is intentionally subtle and fully reduced-motion aware
 * (AAP §0.7.3): when `reduced` is true the first word is shown statically and
 * no timers ever run.
 *
 * The effect is a self-correcting state machine driven purely by the `text`,
 * `isDeleting`, and `wordIndex` state atoms. Each transition schedules exactly
 * one `setTimeout`, and the effect re-runs (re-evaluating the machine) whenever
 * that state changes. The pending timer is always cleared on cleanup, so there
 * is no leak and no "state update on an unmounted component" warning.
 *
 * Consumer: `sections/Hero` drives its cycling role line, e.g.
 * `useTypewriter(hero.roles, { reduced })` where `hero.roles` comes from
 * `@/data/hero` and `reduced` from `usePrefersReducedMotion()`.
 *
 * @param {string[]} words - The list of words/phrases to cycle through. This
 *   MUST be a **stable reference** across renders: it is part of the effect's
 *   dependency array, so a fresh array identity on every render would restart
 *   the animation each render. The consumer passes `hero.roles`, a module-level
 *   constant from `@/data/hero`, which is stable. A caller that builds the array
 *   inline must wrap it in `useMemo` to preserve identity.
 * @param {object} [options] - Timing and behavior options.
 * @param {number} [options.typeSpeed=100] - Delay in ms between typing each character.
 * @param {number} [options.deleteSpeed=50] - Delay in ms between deleting each character.
 * @param {number} [options.pauseTime=1600] - Delay in ms to hold a fully typed word before deleting.
 * @param {boolean} [options.reduced=false] - When true, render the first word
 *   statically and run no timers (respects `prefers-reduced-motion`).
 * @returns {string} The current display string to render.
 *
 * @example
 * const role = useTypewriter(hero.roles, { reduced })
 * return <span>{role}</span>
 */
export function useTypewriter(words, options = {}) {
  const {
    typeSpeed = 100,
    deleteSpeed = 50,
    pauseTime = 1600,
    reduced = false,
  } = options

  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Respect reduced motion: run no timers. The static first-word value is
    // derived at return time (see below) instead of being pushed through
    // setState, which keeps the effect body free of synchronous state updates
    // (ESLint react-hooks/set-state-in-effect). Observable result is identical:
    // the consumer sees the full first word immediately and it never animates.
    if (reduced) {
      return
    }

    // Nothing to animate if there are no words.
    if (!words || words.length === 0) {
      return
    }

    // Modulo keeps the index safe even if `words` shrinks between renders.
    const currentWord = words[wordIndex % words.length]
    let timeoutId

    if (!isDeleting && text === currentWord) {
      // Fully typed -> pause, then start deleting.
      timeoutId = setTimeout(() => setIsDeleting(true), pauseTime)
    } else if (isDeleting && text === '') {
      // Fully deleted -> advance to the next word (wrapping around). Scheduled
      // via a timer so the state update runs inside a callback rather than
      // synchronously in the effect body (react-hooks/set-state-in-effect).
      timeoutId = setTimeout(() => {
        setIsDeleting(false)
        setWordIndex((index) => (index + 1) % words.length)
      }, deleteSpeed)
    } else {
      // Type or delete one character.
      const nextText = isDeleting
        ? currentWord.slice(0, text.length - 1)
        : currentWord.slice(0, text.length + 1)
      timeoutId = setTimeout(() => setText(nextText), isDeleting ? deleteSpeed : typeSpeed)
    }

    // Always clear the pending timer on cleanup. `clearTimeout(undefined)` is a
    // safe no-op for the branch that scheduled no timer, so this is correct in
    // every case and prevents leaks / updates after unmount.
    return () => clearTimeout(timeoutId)
  }, [text, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pauseTime, reduced])

  // In reduced-motion mode, show the full first word statically (no animation),
  // derived here rather than via setState in the effect above.
  if (reduced) {
    return words && words.length > 0 ? words[0] : ''
  }

  return text
}
