import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/hooks/useTheme'
import App from './App.jsx'
import './styles/global.css'

// Extend (do NOT bypass) the scaffold's createRoot + <StrictMode> bootstrap.
// Composition order (outer -> inner): StrictMode -> ThemeProvider -> App.
//  - ThemeProvider is the outermost app-wide provider so the theme is available
//    to every descendant (including the router-driven pages) and data-theme is
//    set on <html> before any section renders.
//  - App owns the router: it renders <RouterProvider> (React Router v8's
//    DOM-aware provider from 'react-router/dom') around the route table, so the
//    router lives inside the theme context. Keeping RouterProvider in App — not
//    here — lets main.jsx stay a thin bootstrap and keeps App a single default
//    export (Fast Refresh friendly).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
