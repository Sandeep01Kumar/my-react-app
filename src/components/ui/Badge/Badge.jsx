import styles from './Badge.module.css'

/**
 * Badge — reusable, non-interactive inline pill/chip.
 *
 * A small presentational primitive used for skill names (Skills / SkillCard)
 * and project tech-stack tags (Projects / ProjectCard / ProjectModal). It is
 * pure phrasing content, so it renders a single inline `<span>` — never a
 * block element — and carries no interactive semantics by default.
 *
 * Styling is theme-aware through the `Badge.module.css` CSS Module, whose
 * values all resolve to the design tokens in `src/styles/variables.css`.
 *
 * @param {object} props
 * @param {'solid' | 'outline' | 'soft'} [props.variant='soft'] Visual style:
 *   `solid` = royal-blue fill with white text; `outline` = transparent fill
 *   with a hairline border; `soft` (default) = subtle surface fill with
 *   royal-blue text. An unknown value simply yields no variant class.
 * @param {import('react').ReactNode} [props.icon] Optional decorative leading
 *   icon (e.g. a `react-icons` element). Rendered inside an `aria-hidden`
 *   wrapper so screen readers announce only the text label.
 * @param {string} [props.className=''] Extra class name(s) merged onto the
 *   root so consumers can extend styling without widening the prop surface.
 * @param {import('react').ReactNode} [props.children] The badge label.
 * @param {object} rest Any remaining props (`title`, `data-*`, `id`, event
 *   handlers, …) are spread onto the root `<span>`.
 * @returns {import('react').ReactElement}
 */
function Badge({ variant = 'soft', icon, className = '', children, ...rest }) {
  const classes = [styles.badge, styles[variant], className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} {...rest}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}

export default Badge
