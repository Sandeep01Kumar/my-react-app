/**
 * SectionTitle — reusable section-heading primitive.
 * --------------------------------------------------------------------------
 * Renders a section's heading block with a uniform typographic cadence:
 * an optional decorative `eyebrow` kicker (a <span>, never a heading), a
 * mandatory <h2> `title`, and an optional `subtitle` paragraph.
 *
 * Consumed by every content section (About, Skills, Projects, Experience,
 * Services, Resume, Contact) so their headings stay visually and
 * semantically consistent.
 *
 * Semantic/SEO contract: the title always renders as an <h2> — never an
 * <h1> (the Hero section owns the page's single <h1>) — so heading levels
 * are never skipped. The eyebrow is decorative text, not a heading element.
 *
 * All visual styling comes from the co-located CSS Module, whose values
 * resolve to the design tokens in src/styles/variables.css.
 *
 * @param {Object} props
 * @param {string} [props.eyebrow]   Optional overline/kicker; renders a small
 *                                   uppercase <span> only when provided.
 * @param {string} props.title       Main heading text rendered inside the <h2>.
 * @param {string} [props.subtitle]  Optional supporting text; renders a <p>
 *                                   only when provided.
 * @param {'left'|'center'} [props.align='left'] Alignment; 'center' centers
 *                                   the block and its text.
 * @param {string} [props.className=''] Optional extra class merged onto the
 *                                   wrapper.
 * @param {Object} [props.rest]      Remaining props (e.g. `id`, `aria-*`)
 *                                   spread onto the wrapper <div> — enables
 *                                   `aria-labelledby` on a consuming section.
 * @returns {JSX.Element} The heading block.
 */
import styles from './SectionTitle.module.css'

function SectionTitle({ eyebrow, title, subtitle, align = 'left', className = '', ...rest }) {
  const wrapperClass = [
    styles.sectionTitle,
    align === 'center' && styles.center,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={wrapperClass} {...rest}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}

export default SectionTitle
