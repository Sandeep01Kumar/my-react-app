import { skills } from '@/data'
import SectionTitle from '@/components/ui/SectionTitle'
import Container from '@/components/ui/Container'
import Reveal from '@/components/ui/Reveal'
import SkillCard from './SkillCard.jsx'
import styles from './Skills.module.css'

function Skills() {
  return (
    <section id='skills' className={styles.skills} aria-labelledby='skills-title'>
      <Container>
        <Reveal>
          <SectionTitle
            id='skills-title'
            eyebrow='My Skills'
            title='Skills & Technologies'
            subtitle='A blend of frontend development craft and rigorous QA discipline.'
            align='center'
          />
        </Reveal>
        <div className={styles.grid}>
          {skills.map((group, index) => (
            <Reveal key={group.category} delay={index * 0.1}>
              <SkillCard group={group} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Skills
