import Card from '@/components/ui/Card'
import CircularProgress from '@/components/ui/CircularProgress'
import styles from './SkillCard.module.css'

function SkillCard({ group }) {
  return (
    <Card variant='glass' className={styles.card}>
      <h3 className={styles.title}>{group.category}</h3>
      <ul className={styles.list}>
        {group.skills.map((skill) => (
          <li key={skill.name}>
            <CircularProgress
              value={skill.level}
              label={skill.name}
              showValue
            />
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default SkillCard
