/**
 * ThemeToggle — icon-only button that flips the app between light and dark.
 *
 * Self-contained: it consumes {@link useTheme} directly, so consumers (the
 * Navbar's desktop bar and mobile menu) render it with no required props —
 * `<ThemeToggle />`. The `<button>` carries the accessible name; the icon
 * inside is purely decorative.
 *
 * Icon semantics (the glyph previews the DESTINATION theme):
 *   - light theme -> a moon (clicking switches to dark)
 *   - dark theme  -> a sun  (clicking switches to light)
 *
 * Accessibility: `aria-label`/`title` describe the ACTION and update with
 * state; `aria-pressed` exposes toggle-button semantics ("dark on" = pressed);
 * the icons are `aria-hidden`; a visible keyboard focus ring is provided by
 * `.toggle:focus-visible` in the sibling CSS Module. All colours and sizes
 * resolve to design tokens, so the control themes automatically with the app.
 *
 * @see AAP §0.1.1 (dark-mode toggle), §0.5.3 (component mapping), §0.7.2
 *      (theme integration), §0.7.4 (accessibility).
 */
import { FaMoon, FaSun } from 'react-icons/fa'
import { useTheme } from '@/hooks/useTheme'
import styles from './ThemeToggle.module.css'

/**
 * @param {object} props
 * @param {string} [props.className=''] - Extra class merged onto the button.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Visual size; 'md' adds no modifier.
 * @param {object} [props.rest] - Any other attributes forwarded to the `<button>` (e.g. `data-*`).
 * @returns {import('react').ReactElement} The theme-toggle button.
 */
function ThemeToggle({ className = '', size = 'md', ...rest }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'
  const sizeClass = size === 'sm' ? styles.sm : size === 'lg' ? styles.lg : ''

  return (
    <button
      type="button"
      className={[styles.toggle, sizeClass, className].filter(Boolean).join(' ')}
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      {...rest}
    >
      <span className={styles.icon}>
        {isDark ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
      </span>
    </button>
  )
}

export default ThemeToggle
