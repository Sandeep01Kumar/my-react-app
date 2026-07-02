import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { viewportOnce } from '@/utils'
import styles from './ProgressBar.module.css'

function clampPercent(value) {
  const number = Number(value)
  if (Number.isNaN(number)) {
    return 0
  }
  return Math.min(100, Math.max(0, number))
}

function ProgressBar({ value = 0, label, showValue = false, animated = true }) {
  const reduced = usePrefersReducedMotion()
  const percent = clampPercent(value)
  const shouldAnimate = animated && !reduced

  // Animate the fill with a compositor-only `scaleX` (a unitless number) rather
  // than `width: 0 -> "${percent}%"`. Animating width to a *percentage* forces
  // Framer Motion to synchronously measure the track to resolve the value on
  // every progress bar, which produced a measurable forced reflow across the
  // Skills grid (QA F5: ~137ms forced reflow). The fill keeps its final
  // `width: ${percent}%` statically and grows from `scaleX(0)` to `scaleX(1)`
  // (transform-origin: left, set in CSS), so the settled visual is identical to
  // the width-based version while the animation stays on the compositor (no
  // layout, no reflow). Reduced-motion / non-animated renders skip the transform
  // entirely and simply paint the fill at its final width.
  const fillProps = shouldAnimate
    ? {
        initial: { scaleX: 0 },
        whileInView: { scaleX: 1 },
        viewport: viewportOnce,
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
        style: { width: `${percent}%` },
      }
    : { style: { width: `${percent}%` } }

  return (
    <div className={styles.progress}>
      {(label || showValue) && (
        <div className={styles.labelRow}>
          {label ? <span className={styles.label}>{label}</span> : null}
          {showValue ? <span className={styles.value}>{percent}%</span> : null}
        </div>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <motion.div className={styles.fill} {...fillProps} />
      </div>
    </div>
  )
}

export default ProgressBar
