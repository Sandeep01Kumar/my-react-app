/**
 * Experience — the portfolio's career-timeline section.
 * --------------------------------------------------------------------------
 * Renders the `#experience` landmark: a data-driven, vertical timeline that
 * covers the author's education, QA experience, React learning journey, and
 * certifications (AAP §0.1.1). It is the default export of this folder
 * (re-exported by `index.js`) and is composed by `pages/Home` at the
 * `@/sections/Experience` path.
 *
 * Composition:
 *   • A semantic <section id="experience"> landmark — the `id` is the exact
 *     anchor the Navbar / `useActiveSection` / `navLinks` bind to; the global
 *     `section[id] { scroll-margin-top }` rule handles the sticky-nav offset.
 *   • The reusable `SectionTitle` primitive supplies the single <h2> heading;
 *     its `id` is referenced by `aria-labelledby` on the <section> so the
 *     landmark inherits an accessible name. The heading is intentionally NOT
 *     wrapped in a scroll-reveal so it stays immediately visible for a11y/SEO.
 *   • The reusable `Container` primitive constrains the content width.
 *   • An ordered list (<ol role="list">) — the `role` restores list semantics
 *     that `global.css`'s `list-style: none` strips — maps every entry of the
 *     `experience` data array to a `TimelineItem`, which owns each entry's
 *     scroll-reveal animation and alternating (left/right) desktop layout.
 *
 * Data-driven: content comes entirely from `src/data/experience.js` (via the
 * `@/data` barrel), so the markup stays declarative and free of hardcoded copy.
 * `key={item.title}` is a stable, unique key (titles are unique in the data);
 * `index` is forwarded so `TimelineItem` can select its timeline side.
 *
 * @returns {JSX.Element} The Experience timeline section.
 */
import { experience } from '@/data'
import SectionTitle from '@/components/ui/SectionTitle'
import Container from '@/components/ui/Container'
import TimelineItem from './TimelineItem'
import styles from './Experience.module.css'

function Experience() {
  return (
    <section id="experience" className={styles.experience} aria-labelledby="experience-title">
      <Container>
        <SectionTitle
          id="experience-title"
          align="center"
          eyebrow="Career Path"
          title="Experience & Education"
          subtitle="A timeline of my education, QA career, React journey, and certifications."
        />
        <ol className={styles.timeline} role="list">
          {experience.map((item, index) => (
            <TimelineItem key={item.title} item={item} index={index} />
          ))}
        </ol>
      </Container>
    </section>
  )
}

export default Experience
