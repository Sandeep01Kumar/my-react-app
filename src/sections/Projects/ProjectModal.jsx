import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { FaGithub, FaExternalLinkAlt, FaCheck } from 'react-icons/fa'
import styles from './ProjectModal.module.css'

/**
 * ProjectModal — co-located details-modal subcomponent for the Projects section.
 * --------------------------------------------------------------------------
 * Wraps the shared Modal primitive (components/ui/Modal) and renders the full
 * details of the currently selected project: hero image, description, tech
 * stack, key features, and the "View Code" / "Live Demo" actions. Purely
 * presentational — it owns no state, uses no hooks, and never imports
 * framer-motion. The Modal primitive alone supplies the overlay, the animated
 * open/close (AnimatePresence), the focus trap, ESC / overlay / close-button
 * dismissal, and body scroll-lock; this component only composes body content.
 *
 * Composition follows the "always reuse primitives" rule (AAP §0.7.1): the tech
 * tags are Badge chips and both actions are Button (rendered as external <a>
 * links). Inner layout/typography come from ./ProjectModal.module.css, whose
 * values all resolve to the design tokens in src/styles/variables.css.
 *
 * Accessibility: the Modal header renders the project title as the dialog's
 * single <h2> and owns role="dialog" / aria-modal / aria-labelledby, so the
 * "Key Features" heading here is correctly an <h3>. The check icon is purely
 * decorative (aria-hidden), with the feature text in the adjacent <span>, and
 * each action Button carries both visible text and an explicit aria-label.
 *
 * Null-safety & exit animation: `project` is `null` whenever the modal is
 * closed, so the Modal title falls back to '' via optional chaining and the
 * body is guarded behind `{project && (…)}` (inside the guard `project` is
 * non-null, so its fields need no further optional chaining). The Modal is
 * intentionally kept mounted — never early-returned or conditionally rendered —
 * so its internal AnimatePresence can play the exit animation with the
 * last-rendered content still visible: no blank flash and no crash on close,
 * which is why no useRef / local content cache is needed.
 *
 * @param {object} props
 * @param {{ id: string, title: string, image: string, description: string,
 *   tech: string[], github: string, demo: string, features: string[] } | null}
 *   props.project The currently selected project record from `@/data`
 *   `projects`, or `null` while the modal is closed. `project.image` is an
 *   already-resolved asset URL rendered directly (no asset import happens here).
 * @param {boolean} props.isOpen Whether the modal is open (the parent passes
 *   `selected !== null`).
 * @param {() => void} props.onClose Clears the selection and closes the modal
 *   (the parent passes `() => setSelected(null)`); invoked by ESC, an overlay
 *   click, and the close button inside the Modal primitive.
 * @returns {import('react').ReactElement} The Modal populated with the selected
 *   project's details (empty body while closed).
 */
function ProjectModal({ project, isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project?.title ?? ''}>
      {project && (
        <div className={styles.content}>
          <img
            className={styles.image}
            src={project.image}
            alt={project.title}
            width='640'
            height='360'
            loading='lazy'
            decoding='async'
          />
          <p className={styles.description}>{project.description}</p>
          <ul className={styles.tech}>
            {project.tech.map((tech) => (
              <li key={tech}>
                <Badge variant='soft'>{tech}</Badge>
              </li>
            ))}
          </ul>
          <div className={styles.features}>
            <h3 className={styles.featuresTitle}>Key Features</h3>
            <ul className={styles.featureList}>
              {project.features.map((feature) => (
                <li key={feature} className={styles.featureItem}>
                  <FaCheck className={styles.featureIcon} aria-hidden='true' />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.actions}>
            <Button
              as='a'
              href={project.github}
              target='_blank'
              rel='noopener noreferrer'
              variant='outline'
              icon={<FaGithub />}
              aria-label={`View ${project.title} source code on GitHub`}
            >
              View Code
            </Button>
            <Button
              as='a'
              href={project.demo}
              target='_blank'
              rel='noopener noreferrer'
              variant='primary'
              icon={<FaExternalLinkAlt />}
              aria-label={`Open the live demo of ${project.title}`}
            >
              Live Demo
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ProjectModal
