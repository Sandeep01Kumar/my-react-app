import { motion } from 'framer-motion'
import SectionTitle from '@/components/ui/SectionTitle'
import Container from '@/components/ui/Container'
import StatCard from '@/components/ui/StatCard'
import { stats } from '@/data'
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useCountUp } from '@/hooks/useCountUp'
import styles from './Statistics.module.css'

function StatItem({ stat, reduced }) {
  const { ref, value } = useCountUp(stat.value)

  return (
    <motion.div
      ref={ref}
      className={styles.item}
      variants={reduced ? undefined : fadeInUp}
    >
      <StatCard
        value={`${value}${stat.suffix ?? ''}`}
        label={stat.label}
        icon={stat.icon}
      />
    </motion.div>
  )
}

function Statistics() {
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
      id="statistics"
      className={styles.statistics}
      aria-labelledby="statistics-title"
    >
      <Container>
        <SectionTitle
          id="statistics-title"
          eyebrow="By the Numbers"
          title="Statistics"
          subtitle="A quick snapshot of the work, experience, and impact behind the portfolio."
          align="center"
        />
        <motion.div className={styles.grid} {...containerMotion}>
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} reduced={reduced} />
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

export default Statistics
