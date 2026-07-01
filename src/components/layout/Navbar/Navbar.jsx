import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaBars, FaTimes } from 'react-icons/fa'
import Container from '@/components/ui/Container'
import ThemeToggle from '@/components/ui/ThemeToggle'
import Logo from '@/components/layout/Logo'
import { navLinks } from '@/data'
import { scrollToId } from '@/utils'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import styles from './Navbar.module.css'

const SCROLL_THRESHOLD = 8

function Navbar() {
  const activeId = useActiveSection()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const reduced = usePrefersReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
