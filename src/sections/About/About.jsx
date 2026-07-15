import { FaBriefcase, FaLaptopCode, FaBug, FaLayerGroup, FaCheck } from 'react-icons/fa'
import SectionTitle from '@/components/ui/SectionTitle'
import Container from '@/components/ui/Container'
import Card from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import Reveal from '@/components/ui/Reveal'
import Badge from '@/components/ui/Badge'
import { about } from '@/data'
import styles from './About.module.css'

const statIcons = [FaBriefcase, FaLaptopCode, FaBug, FaLayerGroup]

function About() {
  const { summary, objective, education, experience, achievements, stats } = about

  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <Container className={styles.inner}>
        <Reveal>
          <SectionTitle
            id="about-title"
            align="center"
            eyebrow="About Me"
            title="Who I Am"
            subtitle="A software professional who both builds and breaks software — shipping polished React interfaces and testing them until they are rock solid."
          />
        </Reveal>

        <div className={styles.intro}>
          <Reveal className={styles.introText}>
            <div className={styles.textBlock}>
              <h3 className={styles.blockTitle}>Professional Summary</h3>
              <p className={styles.paragraph}>{summary}</p>
            </div>
            <div className={styles.textBlock}>
              <h3 className={styles.blockTitle}>Career Objective</h3>
              <p className={styles.paragraph}>{objective}</p>
            </div>
          </Reveal>

          <Reveal className={styles.statsGrid} delay={0.1}>
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                value={`${stat.value}${stat.suffix}`}
                label={stat.label}
                icon={statIcons[index]}
              />
            ))}
          </Reveal>
        </div>

        <div className={styles.columns}>
          <Reveal className={styles.column}>
            <h3 className={styles.blockTitle}>Education</h3>
            {education.map((item) => (
              <Card key={item.degree} variant="glass" className={`${styles.entry} ${styles.entryFill}`}>
                <div className={styles.entryHead}>
                  <h4 className={styles.entryTitle}>{item.degree}</h4>
                  <Badge variant="outline">{item.period}</Badge>
                </div>
                <p className={styles.entryMeta}>{item.institution}</p>
                <p className={styles.paragraph}>{item.description}</p>
              </Card>
            ))}
          </Reveal>

          <Reveal className={styles.column} delay={0.1}>
            <h3 className={styles.blockTitle}>Experience</h3>
            {experience.map((item) => (
              <Card key={item.role} variant="glass" className={styles.entry}>
                <div className={styles.entryHead}>
                  <h4 className={styles.entryTitle}>{item.role}</h4>
                  <Badge variant="outline">{item.period}</Badge>
                </div>
                <p className={styles.entryMeta}>{item.company}</p>
                <p className={styles.paragraph}>{item.description}</p>
              </Card>
            ))}
          </Reveal>
        </div>

        <Reveal className={styles.achievements}>
          <h3 className={styles.blockTitle}>Key Achievements</h3>
          <ul className={styles.achievementList}>
            {achievements.map((achievement) => (
              <li key={achievement} className={styles.achievementItem}>
                <FaCheck className={styles.achievementIcon} aria-hidden="true" />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}

export default About
