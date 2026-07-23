/**
 * Hero section content.
 *
 * Data-driven source for `sections/Hero`: the greeting, the name (rendered as
 * the page's single <h1>), the cycling `roles` consumed by `hooks/useTypewriter`,
 * a short intro description, the profile image, the two call-to-action buttons
 * (Download Resume, Contact Me), and an optional decorative `particles` config.
 *
 * The profile image is imported here (not in the component) so all content stays
 * fully externalized. Vite resolves the `@/assets/images/profile.svg` import to a
 * URL string at build time, which is exposed as `hero.image` for use as an
 * <img src>. The on-brand SVG placeholder (royal-blue -> navy gradient with a
 * white avatar silhouette) stays within the design-token palette; it is a
 * placeholder pending user-supplied media.
 *
 * `particles` is additive, optional config for the Hero's decorative particle
 * layer (rendered behind the content and gated on the user's reduced-motion
 * preference). `count` is the user-editable particle count (read defensively and
 * clamped by the component). The remaining keys are the per-particle layout &
 * motion SEEDS (position prime, drift/duration/delay steps + buckets, and the
 * loop easing): the Hero derives each particle's position/float/timing from its
 * index using these named seeds instead of inline literals (P5-F2), while the
 * index-based derivation FORMULAS stay in the component as structural math.
 * Keeping the values here honors the "constants live in data files" rule.
 */
import heroImage from '@/assets/images/profile.svg'

export const hero = {
  greeting: 'Hi, I\'m',
  name: 'John Doe',
  roles: [
    'Software QA Engineer',
    'React Developer',
    'Frontend Developer',
    'Automation Enthusiast',
  ],
  description:
    'I craft accessible, high-performance React interfaces and rigorously test them across functional, API, and UI layers — so what I build simply works.',
  image: heroImage,
  imageAlt: 'Portrait of John Doe, Software QA Engineer and React Developer',
  ctas: [
    { label: 'Download Resume', href: '/resume.pdf', variant: 'primary', download: true },
    { label: 'Contact Me', href: '#contact', variant: 'outline', download: false },
  ],
  particles: {
    // Number of decorative particles rendered behind the Hero content. Optional
    // and user-editable; the component coerces/clamps it defensively before use.
    count: 18,
    // Per-particle layout & motion seeds (P5-F2). The derivation FORMULAS
    // (index-based modulo/stepping) live in Hero.jsx as structural math; only
    // these tunable values live here in the data contract.
    positionPrime: 61, // scatters each particle's vertical (top %) start
    driftMinPx: 16, // smallest vertical float distance (px)
    driftStepPx: 8, // extra float distance per drift bucket (px)
    driftBuckets: 4, // count of distinct drift distances
    durationMinS: 8, // shortest float-loop duration (s)
    durationStepS: 2, // extra loop duration per duration bucket (s)
    durationBuckets: 5, // count of distinct loop durations
    delayStepS: 0.5, // extra start delay per delay bucket (s)
    delayBuckets: 6, // count of distinct start delays
    easing: 'easeInOut', // framer easing for the continuous float loop
  },
}
