import Container from '@/components/ui/Container'
import SocialLinks from '@/components/ui/SocialLinks'
import BackToTop from '@/components/ui/BackToTop'
import Button from '@/components/ui/Button'
import Logo from '@/components/layout/Logo'
import { navLinks, siteMeta, socials } from '@/data'
import { scrollToId } from '@/utils'
import styles from './Footer.module.css'

function Footer() {
  const year = new Date().getFullYear()

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

      <BackToTop />
    </footer>
  )
}

export default Footer
