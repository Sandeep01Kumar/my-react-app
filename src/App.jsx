/**
 * App — top-level client-side route table for the portfolio SPA.
 * --------------------------------------------------------------------------
 * This component is the application's routing shell. It declares the route
 * table and provides the Suspense boundary that shows a loading affordance
 * while a lazily-loaded page chunk is fetched.
 *
 * Responsibilities (kept intentionally narrow):
 *   - Map the "/" path to the Home page (the full single-page portfolio) and
 *     any unknown path ("*") to the NotFound (404) page.
 *   - Code-split each page with React.lazy + dynamic import() so the initial
 *     bundle stays small (bundle-discipline requirement), emitting one async
 *     chunk per route.
 *   - Wrap <Routes> in a single <Suspense> whose fallback is the eagerly
 *     imported <Loader> — the full-screen loading animation shown during the
 *     initial load and any subsequent lazy-chunk fetch.
 *
 * What this component deliberately does NOT do:
 *   - It does NOT create a Router. <Routes> is rendered inside the
 *     <BrowserRouter> that wraps <App/> in src/main.jsx; adding another Router
 *     here would nest routers and break navigation.
 *   - It exports ONLY the App component (no named exports), satisfying the
 *     react-refresh/only-export-components lint rule that guards Fast Refresh.
 */

import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
// Loader is imported EAGERLY (never lazily): it IS the Suspense fallback, so a
// lazy fallback would defeat its purpose and could not render while a chunk
// loads. Resolves via the '@' -> '/src' alias and the Loader folder barrel.
import Loader from '@/components/ui/Loader'

// Route components are code-split: each dynamic import() becomes its own async
// chunk that is fetched only when its route is first matched. Both page folders
// expose a default export through their index.js barrel.
const Home = lazy(() => import('@/pages/Home'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function App() {
  return (
    // Single Suspense boundary for the whole route tree: the full-screen Loader
    // covers the initial page load and every lazy-chunk transition.
    <Suspense fallback={<Loader fullscreen />}>
      <Routes>
        {/* Landing page: the complete single-page portfolio inside the Layout shell. */}
        <Route path="/" element={<Home />} />
        {/* Catch-all 404: any unmatched path renders the NotFound page. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
