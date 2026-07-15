import styles from './Button.module.css'

/**
 * Button — the single reusable Button / CTA primitive for the whole portfolio.
 * --------------------------------------------------------------------------
 * Presentational and dependency-free: it imports ONLY its CSS Module. The icon
 * and the polymorphic element/type are supplied BY the consumer, so this file
 * never pulls in react-icons, react-router or framer-motion. All hover / active
 * / focus micro-interactions and the layout-stable loading state live in
 * Button.module.css (per AAP §0.7.3 animation restraint).
 *
 * @param {object}   props
 * @param {'primary'|'secondary'|'outline'|'ghost'} [props.variant='primary']
 *   Visual style; maps 1:1 to a class in Button.module.css.
 * @param {'sm'|'md'|'lg'} [props.size='md']
 *   Size ramp; maps 1:1 to a class in Button.module.css.
 * @param {React.ElementType} [props.as='button']
 *   Polymorphic element/type. Aliased to the Capitalized identifier `Component`
 *   so JSX renders it dynamically: a string tag (`'button'`, `'a'`) or a
 *   component type (e.g. a React Router `Link` passed by the consumer).
 * @param {'button'|'submit'|'reset'} [props.type='button']
 *   Applied ONLY when rendering a native `<button>` (never on `<a>`/`Link`).
 * @param {React.ReactNode} [props.icon]
 *   Optional leading icon element (decorative; wrapped with aria-hidden).
 * @param {boolean} [props.loading=false]
 *   Shows the spinner, sets aria-busy and disables the native button while busy.
 * @param {boolean} [props.disabled=false]
 *   Explicit disabled state (combined with `loading`) for native buttons.
 * @param {string}  [props.className='']
 *   Extra class names merged with the module classes.
 * @param {React.ReactNode} [props.children]
 *   Button label / content (also the accessible name).
 * @param {object}  [props.rest]
 *   Everything else (onClick, href, target, rel, download, aria-label, to, ...)
 *   is spread onto the rendered element.
 */
function Button({
  variant = 'primary',
  size = 'md',
  as: Component = 'button',
  type = 'button',
  icon,
  loading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const isNativeButton = Component === 'button'

  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // `type` / `disabled` are only valid on a native <button>; never spread them
  // onto an <a> / Link (they would be invalid DOM attributes there).
  const nativeProps = isNativeButton
    ? { type, disabled: disabled || loading }
    : {}

  return (
    <Component
      className={classes}
      aria-busy={loading || undefined}
      {...nativeProps}
      {...rest}
    >
      <span className={styles.content}>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </span>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
    </Component>
  )
}

export default Button
