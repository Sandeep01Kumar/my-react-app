import { motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa'
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
 * with prev/next controls, a persistent Play/Pause toggle, and dot indicators
 * for manual navigation. This is a thin composition layer — it owns NO carousel
 * state of its own. All of the behavior (the active slide index, the
 * auto-advance timer, the imperative next / prev / goTo actions, the independent
 * pause reasons, and the Play/Pause toggle) lives in the `useCarousel` hook, per
 * the app's "business logic in hooks" rule; this component only composes the
 * presentation and wires the accessibility + pause/resume events.
 *
 * Composition follows the "always reuse primitives" rule (AAP §0.5, §0.8): the
 * heading is the shared SectionTitle (<h2>), the width wrapper is Container, the
 * prev/next/Play-Pause controls are the Button primitive (rendered as round icon
 * buttons via `.controlButton`), and each slide is a co-located TestimonialCard —
 * which itself reuses the Card primitive for its glass surface. No new markup or
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
 * Boundary handling: with zero testimonials the section renders a labelled empty
 * state (announced via `role="status"`) instead of dereferencing an absent first
 * slide, and with a single testimonial the navigation controls (prev/next,
 * Play/Pause, dots) are omitted since there is nothing to advance to.
 *
 * Carousel accessibility: the carousel container carries an explicit
 * `role="group"` alongside `aria-roledescription="carousel"` and an accessible
 * `aria-label` — the base role is required for the custom role description to be
 * exposed correctly. Autoplay pauses independently for pointer and focus so
 * releasing one never resumes while the other still holds:
 * `onMouseEnter`/`onMouseLeave` toggle the `pointer` reason and `onFocus`/`onBlur`
 * toggle the `focus` reason (React's onFocus/onBlur bubble, so focusing any inner
 * control pauses the slideshow). A persistent Play/Pause Button lets the visitor
 * stop autoplay entirely, independent of hover/focus. The active slide sits in a
 * live region that is `polite` ONLY for user-initiated changes and `off` for
 * automatic rotations, so a screen reader is never interrupted every interval.
 * The prev/next/Play-Pause Buttons and each dot carry explicit `aria-label`s, and
 * the active dot is marked with `aria-current`.
 *
 * Layout stability (no moving targets): every slide is rendered stacked in the
 * SAME grid cell (see `.viewport`/`.slide` in the CSS), so the viewport always
 * sizes to the TALLEST testimonial and its height never changes as slides
 * advance — which is what keeps the controls from shifting between slides of
 * different quote lengths. Only the active slide is opaque and interactive; the
 * others are transparent, `aria-hidden`, and `inert`.
 *
 * Motion: all motion is gated on `usePrefersReducedMotion`. When the user prefers
 * reduced motion the crossfade `transition` collapses to `{ duration: 0 }` so
 * slides swap INSTANTLY, and autoplay is ALSO disabled inside `useCarousel`
 * itself, so the two layers reinforce each other.
 *
 * @returns {import('react').ReactElement} The Testimonials section.
 */
function Testimonials() {
  const reduced = usePrefersReducedMotion()
  const count = testimonials.length
  const {
    activeIndex,
    next,
    prev,
    goTo,
    pause,
    resume,
    isPlaying,
    togglePlay,
    changeSource,
  } = useCarousel({ length: count, autoPlay: true, interval: 5000 })

  // The section shell (id / heading / landmark) is identical whether populated
  // or empty, so the SectionTitle is built once and reused by both branches to
  // keep the anchor + accessible-name contract stable.
  const heading = (
    <SectionTitle
      id="testimonials-title"
      eyebrow="Kind Words"
      title="Testimonials"
      subtitle="What colleagues and clients say about working with me."
      align="center"
    />
  )

  // Boundary: no testimonials -> labelled empty state, never index into an empty
  // list (which previously passed `undefined` into TestimonialCard and threw).
  if (count === 0) {
    return (
      <section
        id="testimonials"
        className={styles.testimonials}
        aria-labelledby="testimonials-title"
      >
        <Container>
          {heading}
          <p className={styles.empty} role="status">
            No testimonials to show yet.
          </p>
        </Container>
      </section>
    )
  }

  // Navigation only makes sense with more than one slide; a single testimonial
  // shows on its own with no controls. The Play/Pause toggle is additionally
  // gated on motion being allowed, because autoplay never runs under reduced
  // motion and the toggle would otherwise control nothing.
  const showControls = count > 1
  const showPlayToggle = showControls && !reduced

  // Announce ONLY user-initiated changes: silent ('off') for autoplay ticks and
  // before any interaction, polite for manual navigation.
  const liveMode = changeSource === 'user' ? 'polite' : 'off'

  // Crossfade transition; instant under reduced motion. The [0.4, 0, 0.2, 1]
  // bezier equals the `--ease` design token.
  const transition = reduced ? { duration: 0 } : { duration: 0.4, ease: [0.4, 0, 0.2, 1] }

  return (
    <section
      id="testimonials"
      className={styles.testimonials}
      aria-labelledby="testimonials-title"
    >
      <Container>
        {heading}

        <div
          className={styles.carousel}
          role="group"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          onMouseEnter={() => pause('pointer')}
          onMouseLeave={() => resume('pointer')}
          onFocus={() => pause('focus')}
          onBlur={() => resume('focus')}
        >
          <div className={styles.viewport} aria-live={liveMode}>
            {testimonials.map((testimonial, index) => {
              const active = index === activeIndex
              return (
                <motion.div
                  key={testimonial.name}
                  className={styles.slide}
                  aria-hidden={!active}
                  inert={active ? undefined : true}
                  initial={false}
                  animate={{ opacity: active ? 1 : 0 }}
                  transition={transition}
                >
                  <TestimonialCard testimonial={testimonial} />
                </motion.div>
              )
            })}
          </div>

          {showControls && (
            <div className={styles.controls}>
              <Button
                variant="outline"
                size="md"
                className={styles.controlButton}
                icon={<FaChevronLeft />}
                onClick={prev}
                aria-label="Previous testimonial"
              />
              {showPlayToggle && (
                <Button
                  variant="outline"
                  size="md"
                  className={styles.controlButton}
                  icon={isPlaying ? <FaPause /> : <FaPlay />}
                  onClick={togglePlay}
                  aria-label={
                    isPlaying ? 'Pause testimonial autoplay' : 'Play testimonial autoplay'
                  }
                />
              )}
              <Button
                variant="outline"
                size="md"
                className={styles.controlButton}
                icon={<FaChevronRight />}
                onClick={next}
                aria-label="Next testimonial"
              />
            </div>
          )}

          {showControls && (
            <div className={styles.dots}>
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.name}
                  type="button"
                  className={
                    index === activeIndex ? `${styles.dot} ${styles.dotActive}` : styles.dot
                  }
                  onClick={() => goTo(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === activeIndex}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

export default Testimonials
