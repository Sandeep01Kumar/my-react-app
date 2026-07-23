import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaBars, FaTimes } from 'react-icons/fa'
import Container from '@/components/ui/Container'
import ThemeToggle from '@/components/ui/ThemeToggle'
import Logo from '@/components/layout/Logo'
import { navLinks } from '@/data'
import { scrollToId, BREAKPOINTS } from '@/utils'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import styles from './Navbar.module.css'

const SCROLL_THRESHOLD = 8

function Navbar() {
  const activeId = useActiveSection()
  // Collapse to the mobile hamburger below the `lg` breakpoint (1024px). This
  // query is the EXACT complement of the CSS `@media (min-width: 1024px)` in
  // Navbar.module.css: `BREAKPOINTS.lg - 0.02` = 1023.98px, so at every integer
  // viewport width JS and CSS agree — a width is never simultaneously treated as
  // "mobile" here while the desktop links are shown. Collapsing at `lg` (not
  // `md`/768px) is required because the full desktop row needs ~842px on one
  // line; revealing it below 1024px overflowed ~19px and clipped the ThemeToggle
  // across the ~768-786px band, and left the hamburger a dead control at 768px.
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.lg - 0.02}px)`)
  const reduced = usePrefersReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // Ref to the hamburger toggle so focus can be returned to it when the mobile
  // menu is dismissed with Escape (keyboard users must not be dropped onto
  // <body> when the currently-focused in-menu link unmounts on close).
  const hamburgerRef = useRef(null)

  // The mobile dropdown is only meaningful at the mobile breakpoint. Deriving
  // its visibility from `isMobile` (instead of synchronizing it inside an
  // effect) guarantees the menu can never linger on desktop after a viewport
  // resize, and avoids the cascading-render pattern flagged by
  // react-hooks/set-state-in-effect (see React's "You Might Not Need an Effect").
  const mobileMenuOpen = isMobile && menuOpen

  // Mobile-menu entrance/exit motion, gated on the user's reduced-motion
  // preference. When reduced motion is requested we pass no motion props, so
  // the menu appears/disappears instantly (still tracked by AnimatePresence)
  // instead of sliding/fading — honoring the accessibility rule (AAP §0.7.4).
  const menuMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
      }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the mobile menu on Escape and return focus to the hamburger toggle,
  // mirroring the Escape-close affordance in `components/ui/Modal` (AAP §0.7.4
  // keyboard accessibility; WAI-ARIA APG disclosure pattern). The listener is
  // attached only while the menu is open, so it costs nothing when closed and
  // is removed automatically when the menu closes or the viewport resizes back
  // to desktop — both flip `mobileMenuOpen` to false, re-running this cleanup.
  useEffect(() => {
    if (!mobileMenuOpen) return

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      const toggle = hamburgerRef.current
      if (toggle && typeof toggle.focus === 'function') toggle.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  // Lock body scroll while the mobile menu is open, mirroring the reusable
  // `components/ui/Modal` dialog (which locks the same way while open). This
  // (a) is the standard overlay/disclosure behavior — the page behind a
  // full-width open mobile menu should not scroll — and (b) provides the single
  // app-wide "a blocking overlay is open" signal (`body { overflow: hidden }`)
  // that `useBodyScrollLocked` reads so the floating BackToTop control hides
  // while the menu is open. Without this, BackToTop (`--z-backtotop`, 200)
  // floats above the menu (which sits at `--z-nav`, 100), creating a conflicting
  // control layered over the transient menu (see QA ISSUE-08). The prior
  // overflow value is captured and restored on cleanup, so nested locks (e.g. a
  // Modal opened elsewhere) compose correctly and the lock is always released
  // when the menu closes or the viewport returns to desktop — both flip
  // `mobileMenuOpen` to false, re-running this cleanup.
  useEffect(() => {
    if (!mobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileMenuOpen])

  const handleNavClick = (event, id) => {
    event.preventDefault()
    scrollToId(id)
    setMenuOpen(false)
  }

  const renderNavItems = () =>
    navLinks.map((link) => (
      <li key={link.id}>
        <a
          href={`#${link.id}`}
          className={activeId === link.id ? styles.active : ''}
          aria-current={activeId === link.id ? 'page' : undefined}
          onClick={(event) => handleNavClick(event, link.id)}
        >
          {link.label}
        </a>
      </li>
    ))

  return (
    <header
      className={[styles.header, scrolled && styles.scrolled]
        .filter(Boolean)
        .join(' ')}
    >
      <Container>
        <nav className={styles.nav} aria-label="Primary">
          <Logo as="a" href="#home" onClick={(event) => handleNavClick(event, 'home')} />
          <ul className={styles.links}>{renderNavItems()}</ul>
          <div className={styles.actions}>
            <ThemeToggle />
            <button
              ref={hamburgerRef}
              type="button"
              className={styles.hamburger}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <FaTimes aria-hidden /> : <FaBars aria-hidden />}
            </button>
          </div>
        </nav>
      </Container>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-menu"
            className={styles.mobileMenu}
            aria-label="Mobile"
            {...menuMotion}
          >
            <ul className={styles.mobileLinks}>{renderNavItems()}</ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
