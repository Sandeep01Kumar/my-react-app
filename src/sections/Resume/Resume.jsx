/**
 * Resume — the "Resume" page section (`id="resume"`).
 * --------------------------------------------------------------------------
 * One of the eight content sections composed by `pages/Home` inside the
 * `Layout` shell. It presents a short availability prompt and two working
 * resume actions — Download and View — both built from the shared reusable
 * `Button` primitive so the call-to-action styling stays consistent with the
 * rest of the site (Hero, Contact, NotFound).
 *
 * Stateless and purely presentational: it uses no hooks and owns almost no
 * styling of its own. The premium glass surface, radius and shadow come from
 * the `Card` primitive; the width constraint and heading cadence come from
 * `Container` and `SectionTitle`; the staggered scroll-reveal comes from
 * `Reveal` (which is already `prefers-reduced-motion`-aware, so no extra
 * motion gating is needed here). The availability copy and the resume URL are
 * single-sourced from `siteMeta` in `@/data` — never hardcoded.
 *
 * Contract highlights (see AAP §0.1.1 Resume, §0.4.1 Group 4):
 * - The root is a semantic <section id="resume"> so the Navbar/Footer anchor
 *   links and `useActiveSection` can smooth-scroll to `#resume`. The id MUST
 *   be exactly `resume` (matches `data/navLinks.js`). The sticky-nav scroll
 *   offset is applied globally via `section[id]` in `global.css`.
 * - `aria-labelledby="resume-heading"` gives the section its accessible name
 *   from the SectionTitle's <h2>. The two ids are intentionally distinct:
 *   `resume` (scroll anchor) on the section, `resume-heading` (label target)
 *   on the title block.
 * - Download uses a bare `download` attribute; View opens the PDF in a new
 *   tab with the mandatory `rel="noopener noreferrer"`. Both resolve to
 *   `siteMeta.resumeUrl` ('/resume.pdf', served from `public/resume.pdf`).
 *
 * @returns {JSX.Element} The Resume section.
 */
import { FaDownload, FaEye } from 'react-icons/fa'
import SectionTitle from '@/components/ui/SectionTitle'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Reveal from '@/components/ui/Reveal'
import { siteMeta } from '@/data'
import styles from './Resume.module.css'

function Resume() {
  return (
    <section id="resume" className={styles.resume} aria-labelledby="resume-heading">
      <Container size="narrow" className={styles.container}>
        <Reveal>
          <SectionTitle
            id="resume-heading"
            eyebrow="Resume"
            title="My Resume"
            subtitle="Download a copy of my resume or preview it right here in your browser."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <Card variant="glass" padding="lg" className={styles.panel}>
            <p className={styles.availability}>{siteMeta.availability}</p>

            <div className={styles.actions}>
              <Button
                as="a"
                href={siteMeta.resumeUrl}
                download
                variant="primary"
                icon={<FaDownload />}
              >
                Download Resume
              </Button>

              <Button
                as="a"
                href={siteMeta.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                icon={<FaEye />}
              >
                View Resume
              </Button>
            </div>
          </Card>
        </Reveal>
      </Container>
    </section>
  )
}

export default Resume
