# Portfolio — Software QA Engineer & React Developer

A modern, premium, fully responsive single-page portfolio built with **React 19** and **Vite**. It presents a professional's work through a sticky navigation bar, a hero with an animated typing effect, and content sections for about, animated statistics, skills (with circular progress indicators), projects (with category filtering, search, and a details modal), an experience timeline, certifications, services, resume actions, testimonials, and a validated contact form — all with light/dark theme support.

## ✨ Features

- **Sticky navigation** with smooth scrolling, active-section highlighting, and a mobile menu.
- **Hero** with a large heading, animated typing effect, profile image, call-to-action buttons, and social links.
- **About** section with a professional summary, career objective, education, experience, achievements, and statistics cards.
- **Skills** grouped into Frontend, Backend basics, Testing, and Automation, presented with circular progress indicators.
- **Projects** as responsive cards (image, description, tech stack, GitHub & Live Demo buttons, features) with category filtering and text search, each opening an accessible details modal with an image carousel.
- **Experience timeline** covering education, QA experience, the React learning journey, and certifications.
- **Services** grid highlighting the offerings (Website, React, Frontend, QA Testing, API Testing, Automation Support).
- **Resume** actions to download and view the resume.
- **Contact form** with per-field validation, success/error states, and a Google Maps embed placeholder.
- **Light/dark theme** toggle persisted to `localStorage` and seeded from the OS `prefers-color-scheme`.
- **Accessible & SEO-friendly**: semantic landmarks, keyboard support, `aria-label`s, `alt` text, and contrast-checked colors.
- **Performant**: route-level code splitting via `React.lazy` + `Suspense`, memoization, optimized images, and a small bundle.
- **Statistics** section with animated count-up counters (projects completed, years of experience, technologies learned, and happy clients) that animate when scrolled into view and respect reduced-motion.
- **Certifications** as a responsive grid of cards showing the certification name, issuing organization, issue date, and a "View credential" link.
- **Testimonials** as an accessible, auto-sliding carousel with star ratings, photos, quotes, and role/company — pausing on hover/focus and disabled under reduced-motion.
- **Enhanced sections**: the Hero adds a lightweight animated particle background and a floating social icon rail; Skills adds circular progress indicators; the Experience timeline now shows company logos, technology badges, and achievements; Projects adds category filtering, text search, and an image carousel in the details modal; the Footer adds a resume-download link; and the Contact form adds an optional, environment-variable-guarded EmailJS integration that falls back to the existing simulated submit when unconfigured.

## 🧰 Tech Stack

| Technology | Declared range | Role |
| --- | --- | --- |
| [React](https://react.dev) | `^19.2.7` | UI library — functional components and Hooks only. |
| [Vite](https://vite.dev) | `^8.1.0` | Dev server, production build, and the `@` → `/src` path alias. |
| [Framer Motion](https://motion.dev) (`framer-motion`) | `^12.42.2` | Entrance & scroll-reveal animations, hover micro-interactions, and `AnimatePresence`. |
| [React Router](https://reactrouter.com) (`react-router`) | `^8.1.0` | Client-side routing (Home + 404). |
| [React Icons](https://react-icons.github.io/react-icons/) (`react-icons`) | `^5.6.0` | Tree-shakable SVG icons for social links, skills, and services. |
| CSS Modules + CSS Variables | — | Custom in-repo design-token system (no third-party UI library). |
| [ESLint](https://eslint.org) (flat config) | `^10.5.0` | Code quality and the "no warnings" contract. |

> **Declared ranges vs. installed versions.** The table above lists the
> **declared** [caret (`^`) ranges](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#dependencies)
> from `package.json`; a caret range allows newer compatible minor/patch
> releases. The exact versions resolved in `package-lock.json` (the source of
> truth for a reproducible `npm ci` install) are:
>
> | Package | Declared | Installed (lockfile) |
> | --- | --- | --- |
> | `react` / `react-dom` | `^19.2.7` | `19.2.7` |
> | `framer-motion` | `^12.42.2` | `12.42.2` |
> | `react-router` | `^8.1.0` | `8.1.0` |
> | `react-icons` | `^5.6.0` | `5.7.0` |
> | `vite` | `^8.1.0` | `8.1.0` |
> | `@vitejs/plugin-react` | `^6.0.2` | `6.0.3` |
> | `eslint` | `^10.5.0` | `10.5.0` |
>
> `react-icons` (`5.7.0`) and `@vitejs/plugin-react` (`6.0.3`) resolve to a
> newer compatible release than the declared base — expected caret-range
> behavior. Run `npm ci` to install these exact lockfile versions.
>
> **Security audit.** Production dependencies are clean: `npm audit --omit=dev`
> reports **0 vulnerabilities**. A full `npm audit` (which also scans dev-only
> tooling) reports **1 high-severity advisory and 0 critical** — a transitive
> **dev-only** dependency (`brace-expansion`, pulled in through the ESLint
> toolchain). It is a build/lint-time dependency only: it is **not bundled into
> the production build and never runs in the browser**, so it does not affect
> shipped code. Maintainers may clear it at their discretion with `npm audit fix`.

## 📁 Project Structure

The application follows a scalable, feature-oriented layout under `src/`:

```text
my-react-app/
├─ public/                 # Static assets served as-is (favicon.svg, resume.pdf placeholder)
├─ index.html              # HTML shell (title, meta, #root mount)
├─ vite.config.js          # Vite config (React plugin, @ → /src alias, build target)
├─ eslint.config.js        # Flat ESLint config (core + React Hooks + React Refresh)
├─ .env.example            # EmailJS placeholder env vars (VITE_EMAILJS_*), copy to .env.local
└─ src/
   ├─ main.jsx             # App bootstrap: createRoot + StrictMode, ThemeProvider, Router
   ├─ App.jsx              # Route table (/ → Home, * → NotFound) with lazy + Suspense
   ├─ components/          # Reusable UI primitives (ui/, incl. new CircularProgress) and the layout shell (layout/)
   ├─ sections/            # Page sections: Hero, About, Statistics, Skills, Projects, Experience, Certifications, Services, Resume, Testimonials, Contact
   ├─ pages/               # Route pages: Home (composes all sections) and NotFound (404)
   ├─ assets/              # Images and static imports (profile & project placeholders)
   ├─ hooks/               # Custom hooks: useTheme, useTypewriter, useActiveSection, useScrollToTop, useContactForm, useMediaQuery, usePrefersReducedMotion, useCountUp, useCarousel, useProjectFilter
   ├─ utils/               # Helpers: validators, scroll, constants, animations, and a barrel index
   ├─ data/                # Content data modules: navLinks, hero, about, skills, projects, experience, services, socials, siteMeta, stats, certifications, testimonials
   └─ styles/              # Global design tokens (variables.css) and reset/base styles (global.css)
```

The `public/` folder holds the browser `favicon.svg` and a downloadable `resume.pdf` placeholder that backs the Hero and Resume actions.

## 🚀 Getting Started

### Prerequisites

- **Node.js 22.22+** and **npm**. React Router v8 declares `engines.node` `>=22.22.0`, so earlier Node 22 releases (e.g. 22.12) will fail `npm install`.

### Install

Install the exact, reproducible dependency versions from `package-lock.json`:

```bash
npm ci
```

> Use `npm ci` for a clean, reproducible install that matches the lockfile
> (`lockfileVersion 3`). Use `npm install` only when you intend to add, update,
> or remove a dependency — it may modify `package-lock.json`.

## 📜 Scripts

The following npm scripts are defined in `package.json`:

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `vite` | Start the Vite dev server with hot module replacement (HMR). |
| `npm run build` | `vite build` | Create a production build in `dist/`. |
| `npm run lint` | `eslint .` | Run ESLint across the project (must report zero errors and zero warnings). |
| `npm run preview` | `vite preview` | Serve the production build locally for a final preview. |

### Theming

The site ships with a light/dark theme toggle. The selected theme is persisted to `localStorage` and, on first visit, seeded from the operating system's `prefers-color-scheme` preference.

## 📧 Contact Form & EmailJS (optional)

The **Contact form works out of the box** with a client-side **simulated submit** — it validates every field and shows success/error states without requiring any backend or third-party account.

To enable **real email delivery**, the form can be wired to [EmailJS](https://www.emailjs.com). Note that this takes **more than setting environment variables**: the EmailJS SDK is intentionally not installed or bundled by default, so enabling delivery also requires installing the SDK and a small one-line code change (plus a rebuild) — the full walkthrough is under **Post-Merge Manual Steps** below. Delivery is configured through three **Vite** environment variables; Vite only exposes variables prefixed with `VITE_` to client-side code, so the following names are used:

| Variable | Purpose |
| --- | --- |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service identifier. |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS email-template identifier. |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public (publishable) key. |

Setting **all three** of these is what activates real delivery — the credentials themselves are the switch, so there is **no separate on/off flag**.

The repository ships an `.env.example` documenting these variables. Copy it to a git-ignored local env file and fill in your real values:

```bash
cp .env.example .env.local
```

The project's `.gitignore` already ignores `*.local`, so your credentials stay out of version control. When real delivery is **not activated** (the default), `useContactForm` runs a safe client-side **demo submit**: a valid message is validated and acknowledged honestly as a local demo, **no email is sent**, and your input is preserved (never cleared). Real delivery is activated by the presence of **all three credentials** — a partial configuration (one or two set) stays in demo mode, so **setting only some keys never switches on delivery and never puts the form into an error state**. Activating delivery also requires installing and wiring in the SDK (see **Post-Merge Manual Steps**); once all three credentials are set but the SDK has not yet been wired in, a submit surfaces a controlled "couldn't send" message rather than a false confirmation.

> **Note:** No email dependency is bundled by default. The `@vite-ignore` dynamic import in `useContactForm` is deliberately left unresolved so the build stays green while the SDK is absent — which also means a production build carries an unresolvable bare import until you both install the SDK **and** convert that import into a statically analyzable one. Installing and wiring in the EmailJS browser SDK is an optional step documented under **Post-Merge Manual Steps** below.

## 🎨 Customization

Portfolio/content records are **primarily data-driven** and live in `src/data/*`, so most of the portfolio can be tailored without touching component code. (A few section headings, eyebrows, and control labels remain inline in their components.) The following are **placeholders** intended to be replaced with real, user-supplied content:

- **Resume** — `public/resume.pdf` is a placeholder; swap in the real PDF.
- **Images** — the profile image and project thumbnails under `src/assets/` are placeholders.
- **Google Maps** — the Contact section embeds a placeholder `<iframe>`; replace it with a real embed.
- **Project & demo URLs** — the GitHub and Live Demo links in `src/data/projects.js` are placeholders; point them at real repositories and deployments.
- **Biographical content** — summary text, education, experience, certifications, and social links in `src/data/*` are sample values pending real content.
- **Statistics** — the counters in `src/data/stats.js` (projects completed, years of experience, technologies learned, and happy clients) are sample values.
- **Certifications** — the entries in `src/data/certifications.js` (name, issuing organization, issue date, credential URL, and logo) are placeholders.
- **Testimonials** — the entries in `src/data/testimonials.js` (name, role/company, photo, rating, and quote) are placeholders.
- **Section images** — the placeholder SVGs under `src/assets/images/**` (certification/organization logos, testimonial photos, company logos, and project gallery images) should be replaced with real artwork.

## ✅ Post-Merge Manual Steps

Everything in this project builds and runs with placeholder content. After merging, complete these steps to swap in real content and (optionally) enable live email delivery:

- [ ] **Enable EmailJS (optional).** Real delivery is a multi-step change — environment variables alone are **not** enough:
  1. Install the browser SDK: `npm install @emailjs/browser` (v4.x).
  2. In `src/hooks/useContactForm.js`, convert the deferred `@vite-ignore` dynamic import in the real-send branch into a statically analyzable import (e.g. a top-level `import emailjs from '@emailjs/browser'`, or a plain `await import('@emailjs/browser')` without `@vite-ignore`) so Vite bundles the SDK into a resolvable chunk. The default deferred form keeps the build green while the package is absent, but leaves an unresolvable bare specifier in the output that the browser cannot load.
  3. Create an EmailJS service and email template, then set all three of `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` in `.env.local` (copy from `.env.example`). Setting all three is what activates delivery — there is no separate flag.
  4. Rebuild with `npm run build`.

  Until all of the above are done, the Contact form stays in its built-in demo mode (a valid submit is acknowledged honestly as a local demo and no email is sent). If you set all three credentials before finishing the SDK wiring step, the form surfaces a controlled "couldn't send" message rather than a false confirmation.
- [ ] **Resume.** Replace the `public/resume.pdf` placeholder with the real PDF — it backs the Hero, the Resume section, and the new Footer download link.
- [ ] **Images.** Replace the placeholder SVGs under `src/assets/images/**` — certification/organization logos, testimonial photos, company logos, and project gallery images.
- [ ] **URLs & content.** Update placeholder values with real ones: credential links in `src/data/certifications.js`, testimonial content in `src/data/testimonials.js`, statistics in `src/data/stats.js`, social/profile URLs in `src/data/socials.js`, and project GitHub / Live Demo URLs in `src/data/projects.js`. Once a real domain exists, update the canonical / OpenGraph / JSON-LD host in `index.html` (and `public/sitemap.xml` and `public/robots.txt`).
- [ ] **Verify.** Run `npm run lint`, `npm run build`, and `npm run dev` to confirm the project is still green.
