import { motion } from 'framer-motion'
import { fadeInUp, fadeIn, scaleIn, viewportOnce } from '@/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const VARIANTS = { fadeInUp, fadeIn, scaleIn }

function Reveal({ children, variant = 'fadeInUp', as = 'div', delay, className, ...rest }) {
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    const Tag = as
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  const base =
    typeof variant === 'string' ? VARIANTS[variant] ?? fadeInUp : variant ?? fadeInUp
  const resolved =
    typeof delay === 'number'
      ? { ...base, visible: { ...base.visible, transition: { ...base.visible?.transition, delay } } }
      : base

  const MotionTag = motion[as]

  return (
    <MotionTag
      variants={resolved}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export default Reveal
