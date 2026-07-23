import { motion, AnimatePresence } from 'framer-motion'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useCarousel } from '@/hooks/useCarousel'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { FaGithub, FaExternalLinkAlt, FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { motionTokens } from '@/data'
import styles from './ProjectModal.module.css'

/**
 * ProjectModal — co-located details-modal subcomponent for the Projects section.
 * --------------------------------------------------------------------------
 * Wraps the shared Modal primitive (components/ui/Modal) and renders the full
 * details of the currently selected project: an image gallery carousel,
 * description, tech stack, key features, and the "View Code" / "Live Demo"
 * actions. The gallery is composed here from the `useCarousel` hook (active
 * index + prev / next / goTo navigation, with autoplay OFF so a details dialog
 * never auto-advances moving content) and `framer-motion`'s `AnimatePresence`,
 * with the slide transition gated on `usePrefersReducedMotion` (the slide swaps
 * instantly under reduced motion). The Modal primitive still owns the overlay,
 * the animated open/close (its own AnimatePresence), the focus trap, ESC /
 * overlay / close-button dismissal, and body scroll-lock; this component only
 * composes body content.
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
 * @param {{ id: string, title: string, image: string, gallery: string[],
 *   description: string, tech: string[], github: string, demo: string,
 *   features: string[] } | null}
 *   props.project The currently selected project record from `@/data`
 *   `projects`, or `null` while the modal is closed. `project.image` is an
 *   already-resolved asset URL; `project.gallery` is the ordered list of
 *   already-resolved gallery image URLs shown in the carousel (`gallery[0]`
 *   equals `image`, and it always has at least one entry). Both are rendered
 *   directly (no asset import happens here).
 * @param {boolean} props.isOpen Whether the modal is open (the parent passes
 *   `selected !== null`).
 * @param {() => void} props.onClose Clears the selection and closes the modal
 *   (the parent passes `() => setSelected(null)`); invoked by ESC, an overlay
 *   click, and the close button inside the Modal primitive.
 * @returns {import('react').ReactElement} The Modal populated with the selected
 *   project's details (empty body while closed).
 */
function ProjectModal({ project, isOpen, onClose }) {
  const reduced = usePrefersReducedMotion()
  // Gallery images: prefer the project's `gallery`, otherwise fall back to the
  // single `image` so a project without a gallery still renders one slide. This
  // is empty ONLY while the modal is closed (`project` is null), which is what
  // lets the hooks below stay unconditional (Rules of Hooks) — `useCarousel` is
  // a no-op at length 0 and returns `activeIndex: 0`.
  const images = project?.gallery?.length
    ? project.gallery
    : project
      ? [project.image]
      : []
  // Manual-only gallery: autoplay OFF so a details dialog never auto-advances
  // moving content. `resetKey` is the selected project's id, so switching to a
  // different project — or closing (id -> undefined) and reopening the same one —
  // snaps the gallery back to the first image instead of resuming the stale index
  // left over from the previously viewed project. `useCarousel` applies this
  // reset DURING RENDER (comparing the key to its previous value), so it needs no
  // effect, and `activeIndex` also stays wrap-safe/in-range for any length.
  const { activeIndex, next, prev, goTo } = useCarousel({
    length: images.length,
    autoPlay: false,
    resetKey: project?.id,
  })

  // Slide transition props. Under reduced motion this is an empty object, so the
  // slide swaps INSTANTLY (no fade) while still being tracked by AnimatePresence
  // — mirroring the Modal primitive's own reduced-motion pattern. The crossfade
  // duration comes from the shared motion token contract (`motionTokens`, P5-F2)
  // rather than a bare literal.
  const slideMotion = reduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: motionTokens.modalCrossfadeS },
      }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project?.title ?? ''}>
      {project && (
        <div className={styles.content}>
          <div
            className={styles.gallery}
            role='group'
            aria-roledescription='carousel'
            aria-label={`${project.title} images`}
          >
            <div className={styles.viewport} aria-live='polite'>
              <AnimatePresence mode='wait' initial={false}>
                <motion.img
                  key={activeIndex}
                  className={styles.slide}
                  src={images[activeIndex]}
                  alt={`${project.title} — image ${activeIndex + 1} of ${images.length}`}
                  width='640'
                  height='400'
                  loading='lazy'
                  decoding='async'
                  {...slideMotion}
                />
              </AnimatePresence>
            </div>
            {images.length > 1 && (
              <div className={styles.galleryControls}>
                <Button
                  variant='outline'
                  size='sm'
                  className={styles.galleryButton}
                  onClick={prev}
                  aria-label='Previous image'
                  icon={<FaChevronLeft />}
                />
                <div className={styles.dots}>
                  {images.map((image, index) => (
                    <button
                      key={`${project.id}-${index}`}
                      type='button'
                      className={
                        index === activeIndex
                          ? `${styles.dot} ${styles.dotActive}`
                          : styles.dot
                      }
                      onClick={() => goTo(index)}
                      aria-label={`Go to image ${index + 1}`}
                      aria-current={index === activeIndex}
                    />
                  ))}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className={styles.galleryButton}
                  onClick={next}
                  aria-label='Next image'
                  icon={<FaChevronRight />}
                />
              </div>
            )}
          </div>
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
              className={styles.demoLink}
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
