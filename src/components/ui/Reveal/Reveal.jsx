import { motion } from 'framer-motion'
import { fadeInUp, fadeIn, scaleIn, viewportOnce } from '@/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const VARIANTS = { fadeInUp, fadeIn, scaleIn }

function Reveal({ children, variant = 'fadeInUp', as = 'div', delay, amount, className, ...rest }) {
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

  // Viewport threshold for `whileInView`. Defaults to the shared `viewportOnce`
  // (fire once when ~20% of the element is visible). Consumers that render an
  // element taller than the viewport — e.g. the single-column Projects grid on
  // mobile, which can be several thousand pixels tall — can override `amount`
  // (a Framer Motion viewport amount: a number in [0,1], or 'some'/'all'). This
  // matters because a fixed 20% threshold of a very tall element can never be
  // satisfied at once on a short screen, which would otherwise leave the element
  // stuck in its `hidden` (opacity:0) state (ISSUE-03); passing `amount='some'`
  // reveals it the moment its top edge scrolls into view, on any viewport height.
  // Overriding `amount` builds a new config object and never mutates the shared
  // `viewportOnce`.
  const viewport =
    amount !== undefined ? { ...viewportOnce, amount } : viewportOnce

  const MotionTag = motion[as]

  return (
    <MotionTag
      variants={resolved}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export default Reveal
