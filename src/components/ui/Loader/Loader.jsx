/**
 * Loader — reusable loading-animation UI primitive.
 * --------------------------------------------------------------------------
 * A tiny, pure, side-effect-free component that renders an accessible,
 * token-styled CSS spinner. It is the app's single loading affordance:
 *   - the `<Suspense fallback>` for lazy routes and initial load in
 *     src/App.jsx (`<Suspense fallback={<Loader fullscreen />}>`), and
 *   - an inline fallback for section-level loading.
 *
 * It is imported EAGERLY (never lazily) precisely because it IS the Suspense
 * fallback — a lazy fallback would defeat its purpose.
 *
 * Three presentation modes are selected via props; all visual styling lives in
 * ./Loader.module.css (which in turn consumes design tokens from
 * src/styles/variables.css). This component only selects the mode and wires
 * the accessibility semantics.
 *
 * @param {object}  props
 * @param {boolean} [props.fullscreen=false] Full-viewport centered overlay
 *   (theme-aware background). Use for route/initial Suspense fallbacks.
 * @param {boolean} [props.inline=false]     Smaller in-content spinner. Use for
 *   section-level loading.
 * @param {string}  [props.label='Loading']  Accessible label announced by
 *   assistive technology via the status live region.
 * @param {string}  [props.className='']     Extra class names merged onto the
 *   wrapper so callers can position/space the loader from the outside.
 * @returns {JSX.Element} An accessible status region containing a decorative
 *   spinner.
 *
 * @example
 * <Suspense fallback={<Loader fullscreen />}> ... </Suspense>
 * @example
 * <Loader inline label="Loading projects" />
 */

import styles from './Loader.module.css'

const Loader = ({
  fullscreen = false,
  inline = false,
  label = 'Loading',
  className = '',
}) => {
  // Compose the wrapper class list: base + conditional mode modifiers + any
  // caller-supplied className. `.filter(Boolean)` drops the empty strings from
  // unselected modes / an omitted className so `.join(' ')` never emits stray
  // whitespace or a dangling class.
  const classNames = [
    styles.loader,
    fullscreen ? styles.fullscreen : '',
    inline ? styles.inline : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    // The wrapper is the live region: role="status" + aria-live="polite" make
    // screen readers announce the `label` when the loader appears/updates.
    <div
      className={classNames}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {/* Spinner is purely decorative — the live region above conveys status,
          so it is hidden from assistive technology to avoid double-announcing. */}
      <span className={styles.spinner} aria-hidden="true" />
    </div>
  )
}

export default Loader
