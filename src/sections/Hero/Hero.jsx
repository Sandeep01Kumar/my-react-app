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

function Hero() {
  const reduced = usePrefersReducedMotion()
  const typed = useTypewriter(hero.roles, { reduced })

  const particleCount = hero.particles?.count ?? 18
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: `${(i * 100) / particleCount}%`,
        top: `${(i * 61) % 100}%`,
        drift: 16 + (i % 4) * 8,
        duration: 8 + (i % 5) * 2,
        delay: (i % 6) * 0.5,
      })),
    [particleCount],
  )

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
                  ease: 'easeInOut',
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
            {hero.ctas.map((cta) => (
              <Button
                key={cta.label}
                as="a"
                href={cta.href}
                download={cta.download || undefined}
                variant={cta.variant}
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
