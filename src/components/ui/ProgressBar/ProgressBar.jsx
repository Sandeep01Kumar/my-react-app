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

  const fillProps = shouldAnimate
    ? {
        initial: { width: 0 },
        whileInView: { width: `${percent}%` },
        viewport: viewportOnce,
        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
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
