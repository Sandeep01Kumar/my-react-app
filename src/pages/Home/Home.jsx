import { useEffect } from 'react'

import Layout from '@/components/layout/Layout'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Skills from '@/sections/Skills'
import Projects from '@/sections/Projects'
import Experience from '@/sections/Experience'
import Services from '@/sections/Services'
import Resume from '@/sections/Resume'
import Contact from '@/sections/Contact'
import Statistics from '@/sections/Statistics'
import Certifications from '@/sections/Certifications'
import Testimonials from '@/sections/Testimonials'
import { navLinks } from '@/data'

/**
 * Valid in-page section ids, taken from the single source of truth
 * ({@link navLinks}). A URL hash is only acted on when it matches one of these,
 * so stray or unknown fragments are ignored.
 */
const SECTION_IDS = new Set(navLinks.map((link) => link.id))

function Home() {
  // Deep-link hash reconciliation (fixes direct-visit / reload of `/#section`).
  // `Home` is lazy-loaded, so on a cold load of a hashed URL the browser's
  // native "scroll to fragment" fires BEFORE these sections have mounted and
  // then gives up — leaving the page stuck at the top. Once this component has
  // committed, every `<section id="…">` is in the DOM, so we re-resolve the
  // current hash and scroll its section into view ourselves. `scrollIntoView`
  // honors the section's CSS `scroll-margin-top` (nav height + spacing), so the
  // target lands just below the sticky navbar — identical to an anchor click.
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1)
      // Only reconcile real section anchors; ignore empty/unknown fragments.
      if (!id || !SECTION_IDS.has(id)) {
        return
      }
      const target = document.getElementById(id)
      if (!target) {
        return
      }
      // Respect reduced-motion: jump instantly when requested, else smooth-scroll
      // (mirrors the global `scroll-behavior` rules in styles/global.css).
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      // Defer one frame so the freshly-committed layout settles before we
      // measure and scroll (this is the race the native scroll lost).
      window.requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        })
      })
    }

    // Reconcile the hash on initial mount (the direct-visit / reload case)…
    scrollToHash()
    // …and on later hash changes (e.g. browser back/forward between anchors).
    // This is idempotent with the browser's own anchor handling — it targets the
    // same section — so it never fights a working in-page click.
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [])

  return (
    <Layout>
      <Hero />
      <About />
      <Statistics />
      <Skills />
      <Projects />
      <Experience />
      <Certifications />
      <Services />
      <Resume />
      <Testimonials />
      <Contact />
    </Layout>
  )
}

export default Home
