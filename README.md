# Portfolio — Software QA Engineer & React Developer

A modern, premium, fully responsive single-page portfolio built with **React 19** and **Vite**. It presents a professional's work through a sticky navigation bar, a hero with an animated typing effect, and content sections for about, skills (with animated progress bars), projects (with a details modal), an experience timeline, services, resume actions, and a validated contact form — all with light/dark theme support.

## ✨ Features

- **Sticky navigation** with smooth scrolling, active-section highlighting, and a mobile menu.
- **Hero** with a large heading, animated typing effect, profile image, call-to-action buttons, and social links.
- **About** section with a professional summary, career objective, education, experience, achievements, and statistics cards.
- **Skills** grouped into Frontend, Backend basics, Testing, and Automation, presented with animated progress bars.
- **Projects** as responsive cards (image, description, tech stack, GitHub & Live Demo buttons, features) that open an accessible details modal.
- **Experience timeline** covering education, QA experience, the React learning journey, and certifications.
- **Services** grid highlighting the offerings (Website, React, Frontend, QA Testing, API Testing, Automation Support).
- **Resume** actions to download and view the resume.
- **Contact form** with per-field validation, success/error states, and a Google Maps embed placeholder.
- **Light/dark theme** toggle persisted to `localStorage` and seeded from the OS `prefers-color-scheme`.
- **Accessible & SEO-friendly**: semantic landmarks, keyboard support, `aria-label`s, `alt` text, and contrast-checked colors.
- **Performant**: route-level code splitting via `React.lazy` + `Suspense`, memoization, optimized images, and a small bundle.

## 🧰 Tech Stack

| Technology | Version | Role |
| --- | --- | --- |
| [React](https://react.dev) | `^19.2.7` | UI library — functional components and Hooks only. |
| [Vite](https://vite.dev) | `^8.1.0` | Dev server, production build, and the `@` → `/src` path alias. |
| [Framer Motion](https://motion.dev) (`framer-motion`) | `^12.42.2` | Entrance & scroll-reveal animations, hover micro-interactions, and `AnimatePresence`. |
| [React Router](https://reactrouter.com) (`react-router`) | `^8.1.0` | Client-side routing (Home + 404). |
| [React Icons](https://react-icons.github.io/react-icons/) (`react-icons`) | `^5.6.0` | Tree-shakable SVG icons for social links, skills, and services. |
| CSS Modules + CSS Variables | — | Custom in-repo design-token system (no third-party UI library). |
| [ESLint](https://eslint.org) (flat config) | `^10.5.0` | Code quality and the "no warnings" contract. |

## 📁 Project Structure

The application follows a scalable, feature-oriented layout under `src/`:

```text
my-react-app/
├─ public/                 # Static assets served as-is (favicon.svg, resume.pdf placeholder)
├─ index.html              # HTML shell (title, meta, #root mount)
├─ vite.config.js          # Vite config (React plugin, @ → /src alias, build target)
├─ eslint.config.js        # Flat ESLint config (core + React Hooks + React Refresh)
└─ src/
   ├─ main.jsx             # App bootstrap: createRoot + StrictMode, ThemeProvider, Router
   ├─ App.jsx              # Route table (/ → Home, * → NotFound) with lazy + Suspense
   ├─ components/          # Reusable UI primitives (ui/) and the layout shell (layout/)
   ├─ sections/            # Page sections: Hero, About, Skills, Projects, Experience, Services, Resume, Contact
   ├─ pages/               # Route pages: Home (composes all sections) and NotFound (404)
   ├─ assets/              # Images and static imports (profile & project placeholders)
   ├─ hooks/               # Custom hooks: useTheme, useTypewriter, useActiveSection, useScrollToTop, useContactForm, useMediaQuery, usePrefersReducedMotion
   ├─ utils/               # Helpers: validators, scroll, constants, animations, and a barrel index
   ├─ data/                # Content data modules: navLinks, hero, about, skills, projects, experience, services, socials, siteMeta
   └─ styles/              # Global design tokens (variables.css) and reset/base styles (global.css)
```

The `public/` folder holds the browser `favicon.svg` and a downloadable `resume.pdf` placeholder that backs the Hero and Resume actions.

## 🚀 Getting Started

### Prerequisites

- **Node.js 22+** (required by React Router v8) and **npm**.

### Install

```bash
npm install
```

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

## 🎨 Customization

All display content is data-driven and lives in `src/data/*`, so the portfolio can be tailored without touching component code. The following are **placeholders** intended to be replaced with real, user-supplied content:

- **Resume** — `public/resume.pdf` is a placeholder; swap in the real PDF.
- **Images** — the profile image and project thumbnails under `src/assets/` are placeholders.
- **Google Maps** — the Contact section embeds a placeholder `<iframe>`; replace it with a real embed.
- **Project & demo URLs** — the GitHub and Live Demo links in `src/data/projects.js` are placeholders; point them at real repositories and deployments.
- **Biographical content** — summary text, education, experience, certifications, and social links in `src/data/*` are sample values pending real content.
