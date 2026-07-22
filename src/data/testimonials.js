/**
 * testimonials — client / colleague testimonials for the Testimonials carousel.
 *
 * Consumed by `sections/Testimonials` and its `TestimonialCard` subcomponent,
 * driven by `hooks/useCarousel` (auto-slide, pause on hover/focus, disabled
 * under reduced motion) inside a framer-motion `AnimatePresence`. Each entry
 * renders the author `photo`, `name`, `role` (role + company), a star `rating`
 * (1–5, drawn with `react-icons` stars colored via `--color-warning`), and the
 * `quote`.
 *
 * The `photo` images are imported here so content stays externalized; Vite
 * resolves each `@/assets/images/testimonials/*.svg` import to a URL string.
 *
 * NOTE: all names, roles, quotes, and photos are PLACEHOLDERS pending real,
 * user-supplied content — replacing them (and the avatar SVGs) is a post-merge
 * manual step (AAP §0.7.2).
 *
 * @typedef {Object} Testimonial
 * @property {string} name   Author's full name.
 * @property {string} role   Author's role and company.
 * @property {string} photo  Imported author photo asset URL (placeholder).
 * @property {number} rating Star rating from 1 to 5.
 * @property {string} quote  The testimonial text.
 *
 * @type {Testimonial[]}
 */
import avatar1 from '@/assets/images/testimonials/avatar-1.svg'
import avatar2 from '@/assets/images/testimonials/avatar-2.svg'
import avatar3 from '@/assets/images/testimonials/avatar-3.svg'

export const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Engineering Manager, Tech Solutions Inc.',
    photo: avatar1,
    rating: 5,
    quote:
      'John\'s QA rigor and eye for detail dramatically cut our production defects. He pairs sharp testing instincts with genuinely clean React code — a rare combination.',
  },
  {
    name: 'Michael Torres',
    role: 'Product Owner, AppWorks Studio',
    photo: avatar2,
    rating: 5,
    quote:
      'Every release John touched shipped smoother. His defect reports were so clear and reproducible that our developers fixed issues in a fraction of the usual time.',
  },
  {
    name: 'Priya Sharma',
    role: 'Lead Frontend Developer, Freelance Project',
    photo: avatar3,
    rating: 4,
    quote:
      'John built us a reusable component library that still powers three of our apps. Reliable, accessible, and thoroughly tested — exactly what we needed.',
  },
]
