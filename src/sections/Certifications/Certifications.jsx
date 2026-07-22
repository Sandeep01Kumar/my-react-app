import { motion } from 'framer-motion'
import SectionTitle from '@/components/ui/SectionTitle'
import Container from '@/components/ui/Container'
import { certifications } from '@/data'
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import CertificationCard from './CertificationCard.jsx'
import styles from './Certifications.module.css'

/**
 * Certifications — professional certifications displayed as a responsive card
 * grid. Follows the established section scaffold (AAP §0.6.2) and mirrors the
 * Services section's staggered viewport reveal: each card fades/rises in once,
 * with the whole grid gated on the user's reduced-motion preference.
 *
 * Content comes from the `certifications` data module via the `@/data` barrel;
 * the section reuses the shared SectionTitle, Container and CertificationCard
 * (which itself reuses Card/Badge/Button) so no new markup is introduced.
 *
 * The section `id="certifications"` MUST match the corresponding `navLinks`
 * entry so the Navbar smooth-scroll, Footer quick links and the
 * `useActiveSection` scroll-spy observer all resolve to this section.
 *
 * @returns {import('react').ReactElement} The Certifications section.
 */
function Certifications() {
  const reduced = usePrefersReducedMotion()
  const containerMotion = reduced
    ? {}
    : {
        variants: staggerContainer,
        initial: 'hidden',
        whileInView: 'visible',
        viewport: viewportOnce,
      }

  return (
    <section
      id="certifications"
      className={styles.certifications}
      aria-labelledby="certifications-title"
    >
      <Container>
        <SectionTitle
          id="certifications-title"
          eyebrow="Credentials"
          title="Certifications"
          subtitle="Industry certifications and professional credentials that back my QA and front-end engineering expertise."
          align="center"
        />
        <motion.div className={styles.grid} {...containerMotion}>
          {certifications.map((cert) => (
            <motion.div
              key={cert.name}
              className={styles.item}
              variants={reduced ? undefined : fadeInUp}
            >
              <CertificationCard cert={cert} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

export default Certifications
