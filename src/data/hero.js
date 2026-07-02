/**
 * Hero section content.
 *
 * Data-driven source for `sections/Hero`: the greeting, the name (rendered as
 * the page's single <h1>), the cycling `roles` consumed by `hooks/useTypewriter`,
 * a short intro description, the profile image, and the two call-to-action
 * buttons (Download Resume, Hire Me).
 *
 * The profile image is imported here (not in the component) so all content stays
 * fully externalized. Vite resolves the `@/assets/images/profile.svg` import to a
 * URL string at build time, which is exposed as `hero.image` for use as an
 * <img src>. The on-brand SVG placeholder (royal-blue -> navy gradient with a
 * white avatar silhouette) stays within the design-token palette; it is a
 * placeholder pending user-supplied media.
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
    { label: 'Hire Me', href: '#contact', variant: 'outline', download: false },
  ],
}
