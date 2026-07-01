import Card from '@/components/ui/Card'
import styles from './ServiceCard.module.css'

function ServiceCard({ service }) {
  const Icon = service.icon

  return (
    <Card variant="glass" hover padding="lg" className={styles.card}>
      <span className={styles.icon}>
        <Icon aria-hidden />
      </span>
      <h3 className={styles.title}>{service.title}</h3>
      <p className={styles.description}>{service.description}</p>
    </Card>
  )
}

export default ServiceCard
