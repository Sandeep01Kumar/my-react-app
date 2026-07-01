/**
 * Shared Framer Motion variant objects and viewport config.
 *
 * A small, central library of reusable animation *data* so that entrance and
 * scroll-reveal animations stay consistent and DRY across the app — consumed by
 * `components/ui/Reveal`, the section components, cards, and progress bars
 * (AAP §0.4.1 Group 7, §0.4.3, §0.7.3). Downstream code imports these by name
 * via the `@/utils` barrel, e.g. `import { fadeInUp, viewportOnce } from '@/utils'`.
 *
 * These are plain JavaScript objects with **no imports** — Framer Motion is not
 * referenced here. That keeps the module the smallest, lint-safest surface
 * possible (no `no-unused-vars`/`react-refresh` exposure) and cleanly separates
 * animation DATA (this file) from animation COMPONENTS (which import `motion`
 * from `'framer-motion'`). The objects are handed to a `<motion.*>` element's
 * `variants` prop and driven with either `initial="hidden"` + `animate="visible"`
 * or `whileInView="visible"`.
 *
 * Reduced-motion handling is intentionally the consumer's responsibility (e.g.
 * `Reveal` combined with `usePrefersReducedMotion`, AAP §0.7.3); this data module
 * never gates motion itself.
 *
 * @example
 * import { motion } from 'framer-motion'
 * import { fadeInUp, viewportOnce } from '@/utils'
 *
 * <motion.div
 *   variants={fadeInUp}
 *   initial="hidden"
 *   whileInView="visible"
 *   viewport={viewportOnce}
 * />
 */

// Cubic-bezier control points matching the `--ease` design token
// (cubic-bezier(0.4, 0, 0.2, 1)) in `styles/variables.css` (AAP §0.5.2).
// Framer Motion accepts a bezier array directly as a transition `ease`.
const ease = [0.4, 0, 0.2, 1]

// Fade and rise in — the default entrance/reveal used by most content blocks.
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

// Plain opacity fade — for elements that should not shift position.
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease } },
}

// Subtle scale-up fade — for cards, media, and emphasis surfaces.
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
}

// Orchestrates children: stagger each child's reveal and delay the first one.
// Pair with a child variant (e.g. `fadeInUp`) on the animated children.
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

// Shared viewport config for `whileInView`: fire once, when ~20% is in view.
export const viewportOnce = { once: true, amount: 0.2 }
