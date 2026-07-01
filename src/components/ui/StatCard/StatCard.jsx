import Card from '@/components/ui/Card'
import styles from './StatCard.module.css'

/**
 * StatCard — reusable statistic primitive of the portfolio design system.
 *
 * Displays a single headline statistic (a big number, a caption, and an
 * optional decorative icon) on the shared glass surface. StatCard is the one
 * `components/ui` primitive that composes another primitive: it borrows its
 * entire surface (padding, background, border, radius, shadow, hover-lift)
 * from `Card` by wrapping the content in `<Card variant="glass" hover>`, so
 * the card surface is never re-implemented (honouring the "always reuse
 * components" rule). Only the centred content stack and typography live in
 * ./StatCard.module.css, whose values resolve to the design tokens in
 * src/styles/variables.css.
 *
 * The component is stateless and data-decoupled: `value`, `label` and `icon`
 * are props (fed by the About section from `@/data`), so StatCard never
 * imports content itself. The decorative icon is `aria-hidden`; the visible
 * value and label carry the meaning and read in natural source order for
 * screen readers (e.g. "50+ Projects Completed"). Any extra props (`id`,
 * `role`, `as`, `style`, `aria-*`, event handlers…) flow through `...rest`
 * to Card and onto its root element.
 *
 * @param {object} props
 * @param {string|number} props.value The headline statistic (e.g. '50+', 3).
 * @param {string} props.label The caption shown beneath the value.
 * @param {import('react').ComponentType} [props.icon] Optional react-icons
 *   component reference (a component type, not an element) rendered above the
 *   value. Omit to render no icon.
 * @param {string} [props.className] Extra classes merged with the module's
 *   layout class on the Card root.
 * @returns {import('react').ReactElement} The rendered statistic card.
 */
function StatCard({ value, label, icon, className, ...rest }) {
  // JSX treats lowercase identifiers as DOM tags, so alias the icon prop to a
  // capitalised local before using it as a component type.
  const Icon = icon
  // Always include the module layout class; append an optional consumer
  // className (filter(Boolean) drops it when absent).
  const classes = [styles.stat, className].filter(Boolean).join(' ')

  return (
    <Card variant="glass" hover className={classes} {...rest}>
      {Icon ? <Icon className={styles.icon} aria-hidden /> : null}
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </Card>
  )
}

export default StatCard
