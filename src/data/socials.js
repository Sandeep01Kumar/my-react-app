/**
 * socials.js — Social link data for the portfolio.
 *
 * Consumed by the `SocialLinks` UI primitive (Hero social icon row and Footer).
 * Each entry pairs an accessible `label`, an `href`, and an `icon` component
 * reference from `react-icons/fa6`. The `SocialLinks` component renders the
 * reference as `<item.icon />` and applies `label` as the `aria-label` for
 * these icon-only links.
 *
 * The `react-icons/fa6` (Font Awesome 6) subpath is used deliberately: it
 * provides the modern X (Twitter) glyph `FaXTwitter`, and `FaGithub`,
 * `FaLinkedin`, and `FaEnvelope` also live in fa6 — so a single subpath
 * cleanly covers all four icons.
 *
 * NOTE: The external profile URLs are placeholder values pending real,
 * user-supplied content (see AAP §0.5.4). The `Email` entry uses a `mailto:`
 * scheme and MUST stay identical to `siteMeta.email` (`john.doe@example.com`).
 * External links (GitHub/LinkedIn/X) are opened with
 * `target="_blank" rel="noopener noreferrer"` at the `SocialLinks` component
 * level (safe external links) — not here.
 */
import { FaGithub, FaLinkedin, FaXTwitter, FaEnvelope } from 'react-icons/fa6'

export const socials = [
  { label: 'GitHub', href: 'https://github.com/johndoe', icon: FaGithub },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/johndoe', icon: FaLinkedin },
  { label: 'X (Twitter)', href: 'https://twitter.com/johndoe', icon: FaXTwitter },
  { label: 'Email', href: 'mailto:john.doe@example.com', icon: FaEnvelope },
]
