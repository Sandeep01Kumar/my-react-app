/* eslint-disable react-refresh/only-export-components */
/**
 * useTheme — the application's light/dark theme system.
 *
 * Provides a module-private theme context plus its {@link ThemeProvider} and
 * the {@link useTheme} consumer hook. Together they replace the deleted
 * `src/index.css` `@media (prefers-color-scheme: dark)` *automatic* dark mode
 * with a *user-controlled, persisted* toggle — without regressing the OS
 * preference as the first-run default (AAP §0.7.2).
 *
 * Mechanism (coordinated with `src/styles/variables.css`):
 *   1. The active theme (`'light'` | `'dark'`) is mirrored onto a `data-theme`
 *      attribute on `document.documentElement` (`<html>`). `variables.css`
 *      styles `[data-theme="dark"]`; `:root` is the light default.
 *   2. The choice is persisted to `localStorage` under the `'theme'` key so it
 *      survives reloads and return visits.
 *   3. On first load only (no stored value), the initial theme is *seeded* from
 *      the OS `prefers-color-scheme`. An explicit user choice always wins
 *      thereafter.
 *
 * Client-only (Vite SPA, SSR is out of scope), so `window`/`document` are
 * always defined — no `typeof window` guard is required (matches the sibling
 * `useMediaQuery` convention).
 *
 * The file-scoped `react-refresh/only-export-components` disable above is
 * required: this module intentionally exports BOTH a component
 * (`ThemeProvider`) and a hook (`useTheme`), which Fast Refresh flags. Keeping
 * them co-located is the deliberate single-file API mandated by the AAP
 * (§0.4.1, Group 6) — do not split into a separate context module.
 *
 * @example
 * // At the render root (src/main.jsx):
 * <ThemeProvider><App /></ThemeProvider>
 *
 * @example
 * // In any descendant component (e.g. components/ui/ThemeToggle):
 * const { theme, toggleTheme, setTheme } = useTheme()
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * `localStorage` key under which the user's explicit theme choice is persisted.
 * @type {string}
 */
const STORAGE_KEY = 'theme'

/**
 * Theme context. Kept module-private (never exported): consumers must go
 * through {@link useTheme}, and the `null` default powers its
 * "used outside a ThemeProvider" guard.
 *
 * @type {import('react').Context<{
 *   theme: 'light' | 'dark',
 *   toggleTheme: () => void,
 *   setTheme: (next: 'light' | 'dark') => void,
 * } | null>}
 */
const ThemeContext = createContext(null)

/**
 * Resolve the theme to use on first render.
 *
 * Precedence: a previously persisted, valid choice (`'light'` / `'dark'`) wins;
 * otherwise the OS `prefers-color-scheme: dark` preference seeds the default.
 * This is what "preserve the OS default without regressing it" means — the seed
 * only applies while no explicit choice has been stored.
 *
 * @returns {'light' | 'dark'} The initial theme.
 */
function getInitialTheme() {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * ThemeProvider — supplies the theme value and its mutators to the tree and
 * keeps the DOM / `localStorage` in sync with the active theme.
 *
 * Composed once at the render root so `data-theme` is applied to `<html>`
 * app-wide before any section renders.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children - The subtree that can read the theme.
 * @returns {import('react').ReactElement} The provider wrapping `children`.
 */
export function ThemeProvider({ children }) {
  // Lazy initializer: read localStorage / matchMedia exactly once on mount by
  // passing the function reference (NOT calling it), avoiding a read on every
  // render.
  const [theme, setThemeState] = useState(getInitialTheme)

  // The single home for side effects: reflect the theme onto <html> and persist
  // it. Runs on mount and whenever `theme` changes. Idempotent, so StrictMode's
  // dev double-invoke is harmless (it sets the same attribute/value).
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  // Set an explicit theme, ignoring anything that is not a valid value. Depends
  // only on the stable `setThemeState`, so its dependency array is empty.
  const setTheme = useCallback((next) => {
    setThemeState((prev) => (next === 'light' || next === 'dark' ? next : prev))
  }, [])

  // Flip between light and dark. Stable identity (empty dependency array).
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  // Memoized context value so consumers don't re-render when the provider
  // re-renders for unrelated reasons; its identity changes only when `theme`
  // does (the callbacks are stable).
  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * useTheme — access the current theme and its mutators.
 *
 * Must be called from within a {@link ThemeProvider}; otherwise it throws a
 * descriptive error instead of letting a destructure-of-`null` crash surface.
 *
 * @returns {{
 *   theme: 'light' | 'dark',
 *   toggleTheme: () => void,
 *   setTheme: (next: 'light' | 'dark') => void,
 * }} The active theme plus `toggleTheme` and `setTheme`.
 * @throws {Error} If called outside a `ThemeProvider`.
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
