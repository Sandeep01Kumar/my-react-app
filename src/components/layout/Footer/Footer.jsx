import Container from '@/components/ui/Container'
import SocialLinks from '@/components/ui/SocialLinks'
import BackToTop from '@/components/ui/BackToTop'
import Button from '@/components/ui/Button'
import Logo from '@/components/layout/Logo'
import { navLinks, siteMeta, socials } from '@/data'
import { scrollToId } from '@/utils'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useBodyScrollLocked } from '@/hooks/useBodyScrollLocked'
import styles from './Footer.module.css'

function Footer() {
  const year = new Date().getFullYear()
  const activeId = useActiveSection()
  const overlayOpen = useBodyScrollLocked()

  // Suppress the floating back-to-top control in two situations, both of which
  // otherwise let this fixed control conflict with other content/layers:
  //  - `overlayOpen`: a blocking overlay (mobile menu or modal) is open. The
  //    control's `--z-backtotop` (200) sits above the mobile menu (`--z-nav`,
  //    100) and shows through the modal scrim, so it must hide/inert while any
  //    overlay is up (QA ISSUE-08). `useBodyScrollLocked` reads the shared body
  //    scroll-lock that both the Navbar menu and Modal set.
  //  - `atBottomRegion`: the user is at the last section — the bottom
  //    interactive content (the Contact form, contact details, embedded map, and
  //    this footer). At narrow widths the fixed control overlaps that content
  //    (QA ISSUE-07), and repositioning/reserving space cannot avoid a scrolling
  //    form beneath a fixed control, so it is hidden across the whole bottom
  //    region instead. `useActiveSection` only ever sets (never clears) the
  //    active id, so once the last section becomes active it stays active through
  //    the footer — keeping the control hidden with no reappear. The id is taken
  //    from the end of `navLinks` (the single source of truth for section order)
  //    rather than hardcoded, so it tracks the real last section.
  const lastSectionId = navLinks[navLinks.length - 1]?.id
  const atBottomRegion = Boolean(lastSectionId) && activeId === lastSectionId
  const backToTopSuppressed = overlayOpen || atBottomRegion

  const handleNavClick = (event, id) => {
    event.preventDefault()
    scrollToId(id)
  }

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo />
            <p className={styles.tagline}>{siteMeta.tagline}</p>
            <SocialLinks items={socials} />
            <Button as="a" href={siteMeta.resumeUrl} download variant="outline" size="sm">
              Download Resume
            </Button>
          </div>

          <nav className={styles.column} aria-label="Footer">
            <h2 className={styles.heading}>Quick Links</h2>
            <ul className={styles.links}>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    className={styles.link}
                    href={`#${link.id}`}
                    onClick={(event) => handleNavClick(event, link.id)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.column}>
            <h2 className={styles.heading}>Get in Touch</h2>
            <ul className={styles.contact}>
              <li>
                <a className={styles.link} href={`mailto:${siteMeta.email}`}>
                  {siteMeta.email}
                </a>
              </li>
              <li className={styles.contactItem}>{siteMeta.location}</li>
              <li className={styles.contactItem}>{siteMeta.availability}</li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>
            &copy; {year} {siteMeta.name}. All rights reserved.
          </p>
          <p className={styles.role}>{siteMeta.role}</p>
        </div>
      </Container>

      <BackToTop suppressed={backToTopSuppressed} />
    </footer>
  )
}

export default Footer
