import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// React Router v8 exports BrowserRouter from the package root ('react-router').
// The DOM subpath ('react-router/dom') only exposes RouterProvider/HydratedRouter,
// so importing BrowserRouter from there resolves to undefined and breaks the build.
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from '@/hooks/useTheme'
import App from './App.jsx'
import './styles/global.css'

// Extend (do NOT bypass) the scaffold's createRoot + <StrictMode> bootstrap.
// Composition order (outer -> inner): StrictMode -> ThemeProvider -> BrowserRouter -> App.
//  - ThemeProvider is outermost app-wide provider so the theme is available to
//    every descendant (including any router-driven UI) and data-theme is set on
//    <html> before sections render.
//  - BrowserRouter must wrap <App/> because App renders the <Routes> table; the
//    router intentionally lives here, keeping App.jsx a pure route table.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
