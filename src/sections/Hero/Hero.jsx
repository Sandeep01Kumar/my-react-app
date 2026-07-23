import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { hero, socials } from '@/data'
import { useTypewriter } from '@/hooks/useTypewriter'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import SocialLinks from '@/components/ui/SocialLinks'
import { fadeInUp, viewportOnce, scrollToId } from '@/utils'
import styles from './Hero.module.css'

// Decorative particle-layer safety bounds (robustness). The particle count comes
// from optional, user-editable data (`hero.particles.count`) and is fed straight
// into `Array.from({ length })`, so it MUST resolve to a safe, finite, in-range
// integer: a non-finite value (Infinity / NaN) would throw a RangeError, and a
// very large finite value would allocate and animate thousands of nodes and
// freeze the UI. These NAMED bounds are the defensive fallback/ceiling and are
// intentionally self-contained here: they guard the data, so they cannot be
// sourced from it. The per-particle layout & motion SEEDS (position/drift/
// duration/delay/easing) instead live in the data contract (`hero.particles`)
// per P5-F2; only the index-based derivation formulas remain below.
const DEFAULT_PARTICLE_COUNT = 18
const MAX_PARTICLE_COUNT = 60

function Hero() {
  const reduced = usePrefersReducedMotion()
  const typed = useTypewriter(hero.roles, { reduced })

  // Coerce the optional configured count to a finite, non-negative integer and
  // clamp it to the documented safe maximum BEFORE it ever reaches
  // `Array.from({ length })`. Nullish / non-finite values fall back to the
  // default; negatives clamp to 0 (no particles); oversized values clamp to the
  // maximum — so malformed data can never throw or freeze the render.
  const configuredParticleCount = hero.particles?.count
  const particleCount = Number.isFinite(configuredParticleCount)
    ? Math.min(Math.max(Math.floor(configuredParticleCount), 0), MAX_PARTICLE_COUNT)
    : DEFAULT_PARTICLE_COUNT
  // Build the per-particle layout & motion descriptors from the named seeds in
  // the data contract (`hero.particles`, P5-F2). Only the index-based derivation
  // FORMULAS are structural math and stay here: `left` spreads particles evenly
  // across the full width; `top` scatters the vertical start via a prime
  // multiplier wrapped to the 0–100% span; drift/duration/delay step through a
  // fixed number of buckets so the motion looks varied yet deterministic.
  const particles = useMemo(() => {
    const {
      positionPrime,
      driftMinPx,
      driftStepPx,
      driftBuckets,
      durationMinS,
      durationStepS,
      durationBuckets,
      delayStepS,
      delayBuckets,
    } = hero.particles ?? {}
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: `${(i * 100) / particleCount}%`,
      top: `${(i * positionPrime) % 100}%`,
      drift: driftMinPx + (i % driftBuckets) * driftStepPx,
      duration: durationMinS + (i % durationBuckets) * durationStepS,
      delay: (i % delayBuckets) * delayStepS,
    }))
  }, [particleCount])

  // Loop easing for the particle float, sourced from the data contract (P5-F2).
  const particleEasing = hero.particles?.easing

  const copyMotion = reduced
    ? {}
    : {
        variants: fadeInUp,
        initial: 'hidden',
        whileInView: 'visible',
        viewport: viewportOnce,
      }

  const imageMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, scale: 0.92 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: viewportOnce,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.15 },
      }

  const handleCtaClick = (event, href) => {
    if (href.startsWith('#')) {
      event.preventDefault()
      scrollToId(href.slice(1))
    }
  }

  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.background} aria-hidden="true">
        <motion.div
          className={`${styles.blob} ${styles.blob1}`}
          animate={reduced ? undefined : { x: [0, 30, 0], y: [0, -24, 0], scale: [1, 1.1, 1] }}
          transition={reduced ? undefined : { duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`${styles.blob} ${styles.blob2}`}
          animate={reduced ? undefined : { x: [0, -28, 0], y: [0, 26, 0], scale: [1, 1.12, 1] }}
          transition={reduced ? undefined : { duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        {!reduced && (
          <div className={styles.particles} aria-hidden="true">
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                className={styles.particle}
                style={{ left: particle.left, top: particle.top }}
                animate={{ y: [0, -particle.drift, 0] }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: particleEasing,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <SocialLinks items={socials} size="md" className={styles.rail} />

      <Container className={styles.grid}>
        <motion.div className={styles.copy} {...copyMotion}>
          <p className={styles.greeting}>{hero.greeting}</p>
          <h1 id="hero-heading" className={styles.name}>
            {hero.name}
          </h1>
          <p className={styles.role}>
            <span className={styles.roleText} aria-hidden="true">
              {typed}
            </span>
            <span className={styles.cursor} aria-hidden="true" />
            <span className={styles.srOnly}>{hero.roles[0]}</span>
          </p>
          <p className={styles.description}>{hero.description}</p>
          <div className={styles.actions}>
            {/* Primary CTA renders as <a>; the `primaryCta` class keeps its
                label white on hover/active — the in-scope relocation of the
                reverted Button.module.css change (P3-F1). The outline CTA needs
                no override. */}
            {hero.ctas.map((cta) => (
              <Button
                key={cta.label}
                as="a"
                href={cta.href}
                download={cta.download || undefined}
                variant={cta.variant}
                className={cta.variant === 'primary' ? styles.primaryCta : undefined}
                onClick={(event) => handleCtaClick(event, cta.href)}
              >
                {cta.label}
              </Button>
            ))}
          </div>
          <SocialLinks items={socials} />
        </motion.div>

        <motion.div className={styles.imageWrap} {...imageMotion}>
          <img
            className={styles.image}
            src={hero.image}
            alt={hero.imageAlt}
            width="400"
            height="400"
            loading="eager"
            decoding="async"
          />
        </motion.div>
      </Container>
    </section>
  )
}

export default Hero
