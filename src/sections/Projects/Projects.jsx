import { useState } from 'react'
import SectionTitle from '@/components/ui/SectionTitle'
import Container from '@/components/ui/Container'
import Reveal from '@/components/ui/Reveal'
import Button from '@/components/ui/Button'
import { useProjectFilter } from '@/hooks/useProjectFilter'
import { projects } from '@/data'
import ProjectCard from './ProjectCard.jsx'
import ProjectModal from './ProjectModal.jsx'
import styles from './Projects.module.css'

/**
 * Projects — the "Featured Projects" content section (`id="projects"`).
 * --------------------------------------------------------------------------
 * Renders the responsive project card grid and drives it from
 * `useProjectFilter(projects)` — a category filter plus a case-insensitive
 * text search over each project's title, description, and tech — so the grid
 * shows the derived `filteredProjects` rather than the full list. Alongside the
 * filter state it owns the modal `selected` state: which project (if any) is
 * currently expanded in the details modal. This is the only stateful component
 * in the Projects folder — the co-located ProjectCard and ProjectModal are
 * purely presentational, so all filtering and open/close orchestration lives
 * here in one place.
 *
 * Composition follows the "always reuse primitives" rule (AAP §0.7.1): the
 * heading is the shared SectionTitle (<h2>), the width wrapper is Container,
 * and the grid animates via the Reveal primitive. Between the heading and the
 * grid sits a filter/search bar — the category chips reuse the shared Button
 * primitive (active chip `variant='primary'`, the rest `variant='outline'`) and
 * a labelled search input drives the query. Each record in `filteredProjects`
 * maps to a ProjectCard inside a semantic <li>; the whole grid is a <ul>
 * (rendered by Reveal via `as='ul'`), giving the cards correct list semantics
 * for assistive technology. When no project matches the active filters the grid
 * is replaced by a graceful empty-state message exposed as a `role='status'`
 * live region so assistive tech announces the change.
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
  const { category, setCategory, query, setQuery, categories, filteredProjects } =
    useProjectFilter(projects)

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
        <div className={styles.filterBar}>
          <div
            className={styles.filters}
            role='group'
            aria-label='Filter projects by category'
          >
            {categories.map((item) => (
              <Button
                key={item}
                variant={category === item ? 'primary' : 'outline'}
                size='sm'
                className={styles.filterButton}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </Button>
            ))}
          </div>
          <div className={styles.search}>
            <label htmlFor='project-search' className={styles.searchLabel}>
              Search projects
            </label>
            <input
              id='project-search'
              type='search'
              className={styles.searchInput}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search projects...'
            />
          </div>
        </div>
        {filteredProjects.length === 0 ? (
          <p className={styles.empty} role='status'>
            No projects match your filters.
          </p>
        ) : (
          <Reveal as='ul' className={styles.grid}>
            {filteredProjects.map((project) => (
              <li key={project.id} className={styles.gridItem}>
                <ProjectCard project={project} onOpen={() => setSelected(project)} />
              </li>
            ))}
          </Reveal>
        )}
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
