/**
 * BackToTop — floating, accessible "scroll back to top" button.
 *
 * A thin presentational wrapper: all scroll bookkeeping (visibility tracking and
 * the reduced-motion-aware scroll action) is delegated to {@link useScrollToTop},
 * so this component only renders the affordance and wires the click. It fades and
 * slides in once the user scrolls past `threshold` pixels and animates back out
 * when they scroll above it again.
 *
 * The button is rendered *inside* <AnimatePresence> and gated on `isVisible` —
 * the idiomatic Framer Motion pattern that grants the exit (leave) animation when
 * `isVisible` flips to false (wrapping AnimatePresence around a conditional parent
 * would break the exit transition). The arrow icon is decorative (`aria-hidden`);
 * the button's `aria-label` supplies the accessible name, and
 * `.backToTop:focus-visible` (CSS Module) provides the visible keyboard focus ring.
 *
 * @see AAP §0.1.1 (Footer "back-to-top button"), §0.4.3 (floating back-to-top
 *      button), §0.5.3 (component mapping: Back-to-top → BackToTop, prop
 *      `threshold`), §0.7.4 (accessibility for icon-only controls).
 */
import { AnimatePresence, motion } from 'framer-motion'
import { FaArrowUp } from 'react-icons/fa'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { BACK_TO_TOP_THRESHOLD } from '@/utils'
import styles from './BackToTop.module.css'

/**
 * @param {object} props
 * @param {number} [props.threshold=BACK_TO_TOP_THRESHOLD] - Vertical scroll
 *   distance in px past which the button becomes visible; defaults to the shared
 *   400px constant but can be overridden per-consumer.
 * @param {string} [props.className] - Optional extra class merged onto the button.
 * @param {object} [props.rest] - Any additional attributes forwarded to the
 *   underlying motion button (e.g. `data-*`, inline `style`).
 * @returns {import('react').ReactElement} The AnimatePresence-wrapped back-to-top button.
 */
function BackToTop({ threshold = BACK_TO_TOP_THRESHOLD, className, ...rest }) {
  const { isVisible, scrollToTop } = useScrollToTop(threshold)
  const reduced = usePrefersReducedMotion()

  // Show/hide motion, gated on the reduced-motion preference. When reduced
  // motion is requested we pass no motion props, so the button appears and
  // disappears instantly (still tracked by AnimatePresence) rather than
  // sliding/fading — honoring the accessibility rule (AAP §0.7.4).
  const motionProps = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 16 },
        transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
      }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          className={[styles.backToTop, className].filter(Boolean).join(' ')}
          onClick={scrollToTop}
          {...motionProps}
          {...rest}
        >
          <FaArrowUp aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default BackToTop
