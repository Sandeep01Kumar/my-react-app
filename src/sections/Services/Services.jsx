import { motion } from 'framer-motion'
import SectionTitle from '@/components/ui/SectionTitle'
import Container from '@/components/ui/Container'
import { services } from '@/data'
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import ServiceCard from './ServiceCard.jsx'
import styles from './Services.module.css'

function Services() {
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
      id="services"
      className={styles.services}
      aria-labelledby="services-title"
    >
      <Container>
        <SectionTitle
          id="services-title"
          eyebrow="What I Do"
          title="Services"
          subtitle="Development and quality-assurance services that cover the full journey — from building polished React interfaces to testing them until they break."
          align="center"
        />
        <motion.div className={styles.grid} {...containerMotion}>
          {services.map((service) => (
            <motion.div
              key={service.title}
              className={styles.item}
              variants={reduced ? undefined : fadeInUp}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

export default Services
