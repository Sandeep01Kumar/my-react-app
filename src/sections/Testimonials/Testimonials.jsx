import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import SectionTitle from '@/components/ui/SectionTitle'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { testimonials } from '@/data'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useCarousel } from '@/hooks/useCarousel'
import TestimonialCard from './TestimonialCard.jsx'
import styles from './Testimonials.module.css'

/**
 * Testimonials — the "Testimonials" content section (`id="testimonials"`).
 * --------------------------------------------------------------------------
 * Renders an accessible, auto-sliding carousel of client / colleague
 * testimonials: one testimonial is shown at a time and advances automatically,
 * with prev/next controls and dot indicators for manual navigation. This is a
 * thin composition layer — it owns NO carousel state of its own. All of the
 * behavior (the active slide index, the auto-advance timer, and the imperative
 * next / prev / goTo / pause / resume actions) lives in the `useCarousel` hook,
 * per the app's "business logic in hooks" rule; this component only composes
 * the presentation and wires the accessibility + pause/resume events.
 *
 * Composition follows the "always reuse primitives" rule (AAP §0.5, §0.8): the
 * heading is the shared SectionTitle (<h2>), the width wrapper is Container, the
 * prev/next controls are the Button primitive (rendered as round icon buttons
 * via `.controlButton`), and each slide is a co-located TestimonialCard — which
 * itself reuses the Card primitive for its glass surface. No new markup or
 * duplicate components are introduced, and no new dependency is added: the slide
 * transition is driven by the already-installed framer-motion.
 *
 * Anchor contract: the `id="testimonials"` MUST match the canonical anchor in
 * `data/navLinks.js` — the Navbar smooth-scrolls to it, the Footer Quick Links
 * point at it, and `useActiveSection` observes it — so it is never renamed or
 * prefixed. The section is labelled by its heading via
 * `aria-labelledby="testimonials-title"`, paired with the matching `id` on
 * SectionTitle (whose `...rest` spreads that id onto its wrapper <div>, and
 * whose inner <h2> supplies the accessible name).
 *
 * Carousel accessibility: the carousel container carries
 * `aria-roledescription="carousel"` with an accessible `aria-label`, and the
 * active slide sits inside an `aria-live="polite"` region so slide changes are
 * announced to assistive technology. Autoplay pauses whenever the user is
 * reading or interacting: `onMouseEnter`/`onFocus` call `pause` and
 * `onMouseLeave`/`onBlur` call `resume` (React's onFocus/onBlur bubble, so
 * focusing any inner control — a Button or a dot — pauses the slideshow). The
 * prev/next Buttons and each dot carry explicit `aria-label`s, and the active
 * dot is marked with `aria-current`.
 *
 * Motion: all motion is gated on `usePrefersReducedMotion`. When the user
 * prefers reduced motion, `slideMotion` collapses to `{}` so `<motion.div>`
 * swaps slides INSTANTLY (no enter/exit animation) — mirroring the Modal
 * primitive's `reduced ? {} : {…}` pattern. Autoplay is ALSO disabled under
 * reduced motion inside `useCarousel` itself, so the two layers reinforce each
 * other. `AnimatePresence mode="wait"` keyed on `activeIndex` plays a single
 * one-slide-at-a-time enter/exit transition when motion is allowed.
 *
 * @returns {import('react').ReactElement} The Testimonials section.
 */
function Testimonials() {
  const reduced = usePrefersReducedMotion()
  const { activeIndex, next, prev, goTo, pause, resume } = useCarousel({
    length: testimonials.length,
    autoPlay: true,
    interval: 5000,
  })

  // Slide transition gated on reduced motion: instant swap when reduced,
  // horizontal fade-slide otherwise. These are JavaScript motion values (not
  // CSS), and the [0.4, 0, 0.2, 1] bezier equals the `--ease` design token.
  const slideMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      }

  return (
    <section
      id="testimonials"
      className={styles.testimonials}
      aria-labelledby="testimonials-title"
    >
      <Container>
        <SectionTitle
          id="testimonials-title"
          eyebrow="Kind Words"
          title="Testimonials"
          subtitle="What colleagues and clients say about working with me."
          align="center"
        />

        <div
          className={styles.carousel}
          aria-roledescription="carousel"
          aria-label="Testimonials"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={pause}
          onBlur={resume}
        >
          <div className={styles.viewport} aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={activeIndex} className={styles.slide} {...slideMotion}>
                <TestimonialCard testimonial={testimonials[activeIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.controls}>
            <Button
              variant="outline"
              size="md"
              className={styles.controlButton}
              icon={<FaChevronLeft />}
              onClick={prev}
              aria-label="Previous testimonial"
            />
            <Button
              variant="outline"
              size="md"
              className={styles.controlButton}
              icon={<FaChevronRight />}
              onClick={next}
              aria-label="Next testimonial"
            />
          </div>

          <div className={styles.dots}>
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name}
                type="button"
                className={index === activeIndex ? `${styles.dot} ${styles.dotActive}` : styles.dot}
                onClick={() => goTo(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Testimonials
