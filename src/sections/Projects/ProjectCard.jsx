import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { FaGithub, FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa'
import styles from './ProjectCard.module.css'

/**
 * ProjectCard — co-located card subcomponent for the Projects section.
 * --------------------------------------------------------------------------
 * Presents a single project (thumbnail, title, summary, tech stack) and hosts
 * the affordances that open the project-details modal and link out to the
 * source repository and live demo. Purely presentational: it owns no state and
 * uses no hooks — the parent (Projects) supplies both the data and the modal
 * trigger, keeping this component reusable across the six-card grid.
 *
 * Composition follows the "always reuse primitives" rule (AAP §0.7.1): the
 * surface is the shared Card primitive (as an <article> for correct document
 * semantics), the tech tags are Badge chips, the highlighted `features` are an
 * accessible <ul>, and every action is a Button. Inner layout/typography come
 * from ./ProjectCard.module.css, whose values all resolve to the design tokens
 * in src/styles/variables.css.
 *
 * Interaction model: the details modal is opened solely by the explicit,
 * keyboard-focusable "Details" <button> (onClick={onOpen}); the card surface
 * itself is intentionally NOT clickable. This keeps the trigger fully
 * keyboard- and AT-operable, avoids any mouse-only behavior, and prevents a
 * nested-interactive (button/link inside a clickable region) violation. The
 * "Code" and "Demo" actions are real external <a> links that navigate via href.
 *
 * @param {object} props
 * @param {{ id: string, title: string, category: string, image: string,
 *   description: string, tech: string[], github: string, demo: string,
 *   features: string[] }}
 *   props.project A single project record from `@/data` `projects`.
 *   `project.image` is already a resolved/imported asset URL and is rendered
 *   directly (no asset import happens here). `project.category` renders as a
 *   soft Badge above the title (guarded, so it is skipped when a project
 *   omits it).
 * @param {() => void} props.onOpen Callback that opens the details modal for
 *   this project (the parent passes `() => setSelected(project)`).
 * @returns {import('react').ReactElement} The rendered project card.
 */
function ProjectCard({ project, onOpen }) {
  return (
    <Card as='article' hover className={styles.card}>
      <div className={styles.media}>
        <img
          className={styles.image}
          src={project.image}
          alt={project.title}
          width='640'
          height='360'
          loading='lazy'
          decoding='async'
        />
      </div>
      <div className={styles.body}>
        {project.category && (
          <Badge variant='soft' className={styles.category}>
            {project.category}
          </Badge>
        )}
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
        <ul className={styles.tech}>
          {project.tech.map((tech) => (
            <li key={tech}>
              <Badge variant='soft'>{tech}</Badge>
            </li>
          ))}
        </ul>
        <ul
          className={styles.features}
          aria-label={`Key features of ${project.title}`}
        >
          {project.features.map((feature) => (
            <li key={feature} className={styles.feature}>
              <FaCheckCircle className={styles.featureIcon} aria-hidden />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.actions}>
        <Button
          variant='ghost'
          size='sm'
          onClick={onOpen}
          aria-label={`View details for ${project.title}`}
        >
          Details
        </Button>
        <Button
          as='a'
          href={project.github}
          target='_blank'
          rel='noopener noreferrer'
          variant='outline'
          size='sm'
          icon={<FaGithub />}
          aria-label={`View ${project.title} source code on GitHub`}
        >
          Code
        </Button>
        <Button
          as='a'
          href={project.demo}
          target='_blank'
          rel='noopener noreferrer'
          variant='primary'
          size='sm'
          className={styles.demoLink}
          icon={<FaExternalLinkAlt />}
          aria-label={`Open the live demo of ${project.title}`}
        >
          Demo
        </Button>
      </div>
    </Card>
  )
}

export default ProjectCard
