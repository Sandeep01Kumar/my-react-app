/**
 * App — top-level client-side router for the portfolio SPA.
 * --------------------------------------------------------------------------
 * This component owns the application's routing. It builds the browser router
 * and renders it, code-splitting each page and providing the loading affordance
 * shown while a lazily-loaded page chunk is fetched.
 *
 * Router entry point (AAP §0.3.1 contract):
 *   The AAP mandates the router be bootstrapped through the `react-router/dom`
 *   entry point. In React Router v8 that entry exposes `RouterProvider`
 *   (the DOM-aware provider), while the browser history router itself is created
 *   with `createBrowserRouter` from the package root. `BrowserRouter` (the
 *   declarative component) is NOT exported from `react-router/dom` in v8, so the
 *   data-router pairing below — `createBrowserRouter` + `RouterProvider` — is the
 *   build-clean realization of the AAP's `react-router/dom` router-bootstrap
 *   requirement (AAP §0.3.1 explicitly names "RouterProvider import from
 *   react-router/dom"), keeping react-router pinned at ^8.1.0.
 *
 * Responsibilities (kept intentionally narrow):
 *   - Map the "/" path to the Home page (the full single-page portfolio) and
 *     any unknown path ("*") to the NotFound (404) page.
 *   - Code-split each page with React.lazy + dynamic import() so the initial
 *     bundle stays small (bundle-discipline requirement, AAP §0.7.3), emitting
 *     one async chunk per route.
 *   - Wrap each route element in a <Suspense> whose fallback is the eagerly
 *     imported <Loader> — the full-screen loading animation shown during the
 *     initial load and any subsequent lazy-chunk fetch.
 *
 * Composition note:
 *   The router is rendered here, inside the <ThemeProvider> that wraps <App/> in
 *   src/main.jsx, so the theme remains available app-wide (including to every
 *   router-driven page). This file exports ONLY the App component (no named
 *   exports), satisfying the react-refresh/only-export-components lint rule that
 *   guards Fast Refresh.
 */

import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
// Loader is imported EAGERLY (never lazily): it IS the Suspense fallback, so a
// lazy fallback would defeat its purpose and could not render while a chunk
// loads. Resolves via the '@' -> '/src' alias and the Loader folder barrel.
import Loader from '@/components/ui/Loader'

// Route components are code-split: each dynamic import() becomes its own async
// chunk that is fetched only when its route is first matched. Both page folders
// expose a default export through their index.js barrel.
const Home = lazy(() => import('@/pages/Home'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// The browser history router. Created once at module scope from a static route
// table (no loaders / no route-level lazy), so the router initializes
// synchronously and RouterProvider needs no HydrateFallback. Each element is
// wrapped in its own <Suspense> so the full-screen Loader covers the initial
// page load and every lazy-chunk transition.
const router = createBrowserRouter([
  {
    // Landing page: the complete single-page portfolio inside the Layout shell.
    path: '/',
    element: (
      <Suspense fallback={<Loader fullscreen />}>
        <Home />
      </Suspense>
    ),
  },
  {
    // Catch-all 404: any unmatched path renders the NotFound page.
    path: '*',
    element: (
      <Suspense fallback={<Loader fullscreen />}>
        <NotFound />
      </Suspense>
    ),
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
