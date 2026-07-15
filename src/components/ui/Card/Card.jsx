import styles from './Card.module.css'

/**
 * Card — reusable surface primitive of the portfolio design system.
 *
 * A purely presentational, polymorphic wrapper that applies the shared
 * glass/solid surface, padding scale, and optional hover-lift defined in
 * ./Card.module.css (whose values resolve to the design tokens in
 * src/styles/variables.css). Reused by ProjectCard, ServiceCard, the About
 * cards, the Experience TimelineItem, and composed by StatCard — giving the
 * whole site one consistent, themeable surface.
 *
 * The component adds no roles or focus behaviour of its own. Consumers that
 * make a Card interactive pass `role`, `tabIndex`, key handlers and `aria-*`
 * through `...rest`, and choose a semantic root element via `as` (e.g.
 * `article`, `li`, `section`) so document semantics stay correct.
 *
 * @param {object} props
 * @param {'glass'|'solid'} [props.variant='glass'] Surface style variant.
 * @param {boolean} [props.hover=false] Enable the hover-lift interaction.
 * @param {'sm'|'md'|'lg'} [props.padding='md'] Inner padding scale.
 * @param {import('react').ElementType} [props.as='div'] Root element/component.
 * @param {string} [props.className] Extra classes merged with the module classes.
 * @param {import('react').ReactNode} [props.children] Card content.
 * @returns {import('react').ReactElement} The rendered surface element.
 */
function Card({
  variant = 'glass',
  hover = false,
  padding = 'md',
  as: Component = 'div',
  className,
  children,
  ...rest
}) {
  const classes = [
    styles.card,
    styles[variant],
    styles[`pad-${padding}`],
    hover && styles.hover,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}

export default Card
