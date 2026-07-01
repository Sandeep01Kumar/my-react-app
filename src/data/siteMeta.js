/**
 * siteMeta — site-wide display and contact metadata.
 *
 * Single source of the portfolio owner's brand/display identity and contact
 * details, reused across the layout (Navbar, Footer, Logo), the Hero and
 * Contact (ContactInfo) sections, and the Resume actions. Content values are
 * intentional placeholders pending user-supplied details.
 *
 * Consistency contract:
 * - `name`/`role` mirror the document title and author meta tags in
 *   index.html (single consistent placeholder identity for the whole app).
 * - `description` mirrors the SEO meta description in index.html.
 * - `email` matches the mailto target used by data/socials.js and the Contact
 *   section (john.doe@example.com).
 * - `resumeUrl` is a public-folder runtime path (served from public/resume.pdf)
 *   — a plain href string, NOT a bundler import — so it stays valid even before
 *   the PDF asset is added.
 */
export const siteMeta = {
  name: 'John Doe',
  role: 'Software QA Engineer & React Developer',
  initials: 'JD',
  tagline: 'Building reliable, accessible web experiences — and testing them until they break.',
  description:
    'Software QA Engineer & React Developer building tested, accessible, and high-quality web applications.',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  availability: 'Open to freelance and full-time opportunities',
  resumeUrl: '/resume.pdf',
}
