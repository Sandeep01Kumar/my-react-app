import Card from '@/components/ui/Card'
import CircularProgress from '@/components/ui/CircularProgress'
import styles from './SkillCard.module.css'

function SkillCard({ group }) {
  return (
    <Card variant='glass' className={styles.card}>
      <h3 className={styles.title}>{group.category}</h3>
      <ul className={styles.list}>
        {group.skills.map((skill) => (
          <li key={skill.name} className={styles.skill}>
            <CircularProgress
              value={skill.level}
              label={skill.name}
              showValue
            />
            {/* Visible skill name (P4-F1): the dial previously exposed the name
                only via the progressbar's aria-label, so sighted users saw just
                a percentage. Rendering it here makes each skill identifiable
                on screen. It is aria-hidden because the CircularProgress
                progressbar already carries this exact name as its accessible
                name (label={skill.name}) — hiding the visual duplicate avoids a
                redundant screen-reader announcement while keeping the value/name
                semantics on the progressbar itself. */}
            <span className={styles.skillName} aria-hidden="true">
              {skill.name}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default SkillCard
