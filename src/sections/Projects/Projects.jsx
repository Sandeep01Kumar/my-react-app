import { useState } from 'react'
import SectionTitle from '@/components/ui/SectionTitle'
import Container from '@/components/ui/Container'
import Reveal from '@/components/ui/Reveal'
import { projects } from '@/data'
import ProjectCard from './ProjectCard.jsx'
import ProjectModal from './ProjectModal.jsx'
import styles from './Projects.module.css'

/**
 * Projects — the "Featured Projects" content section (`id="projects"`).
 * --------------------------------------------------------------------------
 * Renders the responsive project card grid and owns the single piece of state
 * for the section: which project (if any) is currently expanded in the details
 * modal. This is the only stateful component in the Projects folder — the
 * co-located ProjectCard and ProjectModal are purely presentational, so all
 * open/close orchestration lives here in one place.
 *
 * Composition follows the "always reuse primitives" rule (AAP §0.7.1): the
 * heading is the shared SectionTitle (<h2>), the width wrapper is Container,
 * and the grid animates via the Reveal primitive. Each project record from
 * `@/data` `projects` maps to a ProjectCard inside a semantic <li>; the whole
 * grid is a <ul> (rendered by Reveal via `as='ul'`), giving the six cards
 * correct list semantics for assistive technology.
 *
 * Anchor contract: the `id="projects"` MUST match the canonical anchor in
 * `data/navLinks.js` — the Navbar smooth-scrolls to it and `useActiveSection`
 * observes it, so it is never renamed or prefixed. The section is labelled by
 * its heading via `aria-labelledby='projects-heading'`, paired with the
 * matching `id` on SectionTitle (whose `...rest` spreads that id onto its
 * wrapper, and whose inner <h2> supplies the accessible name).
 *
 * Motion: scroll-reveal (and its `prefers-reduced-motion` guard) is delegated
 * entirely to the Reveal primitive, so this component imports no framer-motion
 * and contains no manual animation code.
 *
 * Modal lifecycle: `selected` is `null` while the modal is closed and holds the
 * chosen project record while open. A card's "Details" trigger calls
 * `onOpen={() => setSelected(project)}`; the modal reports `isOpen` as
 * `selected !== null` and closes via `onClose={() => setSelected(null)}`.
 * ProjectModal is rendered unconditionally (outside Container, at the end of
 * the section) so its internal AnimatePresence can play the open/close
 * animation with the last-selected content still visible; because it portals
 * to `document.body`, its position in this tree does not affect layout.
 *
 * @returns {import('react').ReactElement} The Projects section.
 */
function Projects() {
  const [selected, setSelected] = useState(null)

  return (
    <section id='projects' className={styles.section} aria-labelledby='projects-heading'>
      <Container>
        <SectionTitle
          id='projects-heading'
          eyebrow='My Work'
          title='Featured Projects'
          subtitle='A selection of projects spanning React development and quality-assurance engineering.'
          align='center'
        />
        <Reveal as='ul' className={styles.grid}>
          {projects.map((project) => (
            <li key={project.id} className={styles.gridItem}>
              <ProjectCard project={project} onOpen={() => setSelected(project)} />
            </li>
          ))}
        </Reveal>
      </Container>
      <ProjectModal
        project={selected}
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
      />
    </section>
  )
}

export default Projects
