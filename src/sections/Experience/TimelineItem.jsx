import { FaGraduationCap, FaBriefcase, FaRocket, FaCertificate } from 'react-icons/fa'
import Reveal from '@/components/ui/Reveal'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import styles from './TimelineItem.module.css'

/**
 * Category -> icon lookup for the timeline marker.
 *
 * The Experience data module (`src/data/experience.js`) is intentionally
 * icon-free, so the mapping from an entry's `type` to its Font Awesome glyph
 * lives HERE, co-located with the presentation. Keys mirror the four allowed
 * `type` values exactly; an unknown type falls back to `FaBriefcase` (see the
 * component below), which also keeps every imported icon referenced.
 *
 * This is a module-level constant and is deliberately NOT exported, so the
 * file exposes a single default export and satisfies react-refresh's
 * `only-export-components` rule.
 */
const TYPE_ICONS = {
  Education: FaGraduationCap,
  Experience: FaBriefcase,
  Journey: FaRocket,
  Certification: FaCertificate,
}

/**
 * TimelineItem — renders a single entry of the Experience timeline.
 *
 * Presentational, data-driven leaf consumed only by `Experience.jsx`. It maps
 * the entry's category to an icon locally, then composes the shared design
 * primitives: the whole entry is a `Reveal` rendered as an `<li>` (which
 * handles the scroll-in animation and `prefers-reduced-motion` gating
 * internally), containing a decorative category marker and a `Card` rendered
 * as an `<article>` with the type `Badge`, period, title, org, and description.
 *
 * @param {object} props
 * @param {{ type: 'Education'|'Experience'|'Journey'|'Certification', title: string, org: string, period: string, description: string }} props.item
 *   The timeline entry to render.
 * @param {number} props.index Position in the list; its parity selects the
 *   left/right side on the desktop alternating layout.
 * @returns {import('react').ReactElement} The rendered `<li>` timeline entry.
 */
function TimelineItem({ item, index }) {
  const Icon = TYPE_ICONS[item.type] ?? FaBriefcase
  const sideClass = index % 2 === 0 ? styles.left : styles.right
  const itemClass = [styles.item, sideClass].filter(Boolean).join(' ')

  return (
    <Reveal as="li" variant="fadeInUp" className={itemClass}>
      <span className={styles.marker} data-type={item.type} aria-hidden="true">
        <Icon />
      </span>
      <Card as="article" hover padding="lg" className={styles.card}>
        <div className={styles.header}>
          <Badge variant="soft">{item.type}</Badge>
          <span className={styles.period}>{item.period}</span>
        </div>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.org}>{item.org}</p>
        <p className={styles.description}>{item.description}</p>
      </Card>
    </Reveal>
  )
}

export default TimelineItem
