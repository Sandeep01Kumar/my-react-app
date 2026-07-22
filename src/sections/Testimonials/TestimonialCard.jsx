import Card from '@/components/ui/Card'
import { FaStar, FaRegStar } from 'react-icons/fa'
import styles from './Testimonials.module.css'

/**
 * TestimonialCard — co-located card subcomponent for the Testimonials section.
 * --------------------------------------------------------------------------
 * Presents a single testimonial (author photo, star rating, quote, and
 * attribution) as one slide of the section's carousel. Purely presentational:
 * it owns no state and uses no hooks — the parent (Testimonials) supplies the
 * data and drives which testimonial is shown, keeping this component a simple,
 * reusable leaf that the carousel can swap in and out.
 *
 * Composition follows the "always reuse primitives" rule (AAP §0.5, §0.8): the
 * surface is the shared Card primitive (variant="glass" padding="lg"), so the
 * card's radius, border, shadow, glass background, and padding are owned by the
 * design system rather than restated here. Inner layout and typography come
 * from the SHARED ./Testimonials.module.css (there is deliberately no
 * TestimonialCard.module.css), whose values all resolve to the design tokens in
 * src/styles/variables.css and flip correctly between the light and dark themes.
 *
 * Accessibility: the whole star row is exposed as a single accessible unit via
 * role="img" + an aria-label of "{rating} out of 5 stars", while each
 * individual glyph is marked aria-hidden so assistive technology announces only
 * the group label rather than five separate icons. The photo carries a
 * meaningful alt (the author's name) and is lazy-loaded with explicit width/
 * height to stabilise layout; the quote uses a semantic <blockquote> and the
 * attribution uses <p> elements — no heading is introduced here because the
 * section's single <h2> is owned by SectionTitle in Testimonials.jsx.
 *
 * @param {object} props
 * @param {{ name: string, role: string, photo: string, rating: number,
 *   quote: string }} props.testimonial A single testimonial record from `@/data`
 *   `testimonials`. `role` already includes the company (e.g. "Engineering
 *   Manager, Tech Solutions Inc."), `photo` is an already-resolved asset URL
 *   rendered directly (no asset import happens here), and `rating` is a 1–5
 *   integer used to fill the five-star row.
 * @returns {import('react').ReactElement} The rendered testimonial card.
 */
function TestimonialCard({ testimonial }) {
  return (
    <Card variant="glass" padding="lg" className={styles.card}>
      <img
        className={styles.photo}
        src={testimonial.photo}
        alt={testimonial.name}
        width="96"
        height="96"
        loading="lazy"
        decoding="async"
      />
      <span
        className={styles.rating}
        role="img"
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, index) =>
          index < testimonial.rating ? (
            <FaStar key={`star-${index}`} aria-hidden />
          ) : (
            <FaRegStar key={`star-${index}`} aria-hidden />
          ),
        )}
      </span>
      <blockquote className={styles.quote}>{testimonial.quote}</blockquote>
      <p className={styles.name}>{testimonial.name}</p>
      <p className={styles.role}>{testimonial.role}</p>
    </Card>
  )
}

export default TestimonialCard
