/**
 * navLinks — single source of truth for the primary site navigation and the
 * canonical list of in-page section `id` anchors.
 *
 * Each entry's `id` maps 1:1 to the `id` attribute of the corresponding
 * <section> rendered in `pages/Home` (the `home` id belongs to the Hero
 * section). These same ids are consumed by:
 *   - `components/layout/Navbar`  — renders the links + smooth-scroll targets
 *   - `components/layout/Footer`  — renders the quick links
 *   - `hooks/useActiveSection`    — IntersectionObserver highlights the active link
 *
 * Consumers build the anchor href themselves as `#${link.id}`, so no `href`
 * field is stored here (the shape is intentionally minimal: `{ id, label }`).
 *
 * Order matters: it is the left-to-right (desktop) / top-to-bottom (mobile)
 * order of the nav and matches the vertical order of the sections on the page.
 * Keep every `id` stable and lowercase.
 *
 * @type {{ id: string, label: string }[]}
 */
export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'services', label: 'Services' },
  { id: 'resume', label: 'Resume' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
]
