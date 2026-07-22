import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { viewportOnce } from '@/utils'
import styles from './CircularProgress.module.css'

// Same guard as ProgressBar.clampPercent: coerce, NaN -> 0, clamp to [0, 100].
function clampPercent(value) {
  const number = Number(value)
  if (Number.isNaN(number)) {
    return 0
  }
  return Math.min(100, Math.max(0, number))
}

/**
 * CircularProgress — SVG ring progress indicator (design-system primitive).
 * Circular counterpart to the linear ProgressBar. Presentational only: `value`
 * and `label` are supplied by the consumer (e.g. SkillCard passes skill.level /
 * skill.name). The wrapper carries the progressbar semantics; the SVG is
 * decorative (aria-hidden). The sweep animates on scroll-in and is gated on
 * prefers-reduced-motion (final value painted instantly when reduced).
 *
 * @param {object} props
 * @param {number} [props.value=0] Progress in the range 0–100; coerced and
 *   clamped by clampPercent (NaN -> 0). SkillCard passes `skill.level`.
 * @param {number} [props.size=120] Diameter of the ring in pixels; feeds the
 *   SVG width/height/viewBox and the derived geometry.
 * @param {string} [props.label] Accessible name applied as `aria-label` on the
 *   progressbar wrapper. SkillCard passes `skill.name`.
 * @param {number} [props.strokeWidth=8] Ring thickness in pixels (SVG stroke).
 * @param {boolean} [props.showValue=false] When true, render the centered
 *   numeric `{percent}%`. SkillCard uses the `showValue` shorthand.
 * @returns {import('react').ReactElement} The rendered circular progress ring.
 */
function CircularProgress({
  value = 0,
  size = 120,
  label,
  strokeWidth = 8,
  showValue = false,
}) {
  const reduced = usePrefersReducedMotion()
  const percent = clampPercent(value)

  // Geometry is computed in JS and applied as NUMERIC SVG attributes/props,
  // which are EXEMPT from the zero-hardcoded-CSS rule (they are not CSS values).
  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const finalOffset = circumference * (1 - percent / 100)

  // Reduced motion -> no motion props, paint the final offset statically
  // (mirrors ProgressBar's `shouldAnimate = animated && !reduced` branch).
  // Otherwise sweep strokeDashoffset from `circumference` (empty) to finalOffset
  // when the ring scrolls into view. Duration/ease match ProgressBar exactly.
  const arcProps = reduced
    ? { strokeDashoffset: finalOffset }
    : {
        initial: { strokeDashoffset: circumference },
        whileInView: { strokeDashoffset: finalOffset },
        viewport: viewportOnce,
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
      }

  return (
    <div
      className={styles.root}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <svg
        className={styles.svg}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <circle
          className={styles.track}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          className={styles.progress}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          {...arcProps}
        />
      </svg>
      {showValue ? (
        <span className={styles.value} aria-hidden="true">
          {percent}%
        </span>
      ) : null}
    </div>
  )
}

export default CircularProgress
