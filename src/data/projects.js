// Placeholder project data. `image` reuses the retained hero.png as a stand-in
// thumbnail; replace with real project images (e.g. under @/assets/images/) later.
import projectImage from '@/assets/hero.png'

export const projects = [
  {
    id: 'portfolio-website',
    title: 'Personal Portfolio Website',
    image: projectImage,
    description:
      'A modern, responsive portfolio SPA with dark mode, scroll-reveal animations, and fully accessible, reusable components.',
    tech: ['React', 'Vite', 'CSS Modules', 'Framer Motion'],
    github: 'https://github.com/johndoe/portfolio',
    demo: 'https://johndoe.dev',
    features: [
      'Light/dark theme with persistence',
      'Scroll-reveal animations',
      'Mobile-first responsive layout',
      'Accessible, keyboard-navigable UI',
    ],
  },
  {
    id: 'ecommerce-test-suite',
    title: 'E-Commerce Test Automation Suite',
    image: projectImage,
    description:
      'An end-to-end automated regression suite covering checkout, cart, and search flows for an e-commerce platform.',
    tech: ['Selenium', 'JavaScript', 'TestNG', 'Jenkins'],
    github: 'https://github.com/johndoe/ecommerce-test-suite',
    demo: 'https://example.com/ecommerce-test-report',
    features: [
      '200+ automated end-to-end cases',
      'Cross-browser coverage',
      'CI pipeline integration',
      'HTML test reports',
    ],
  },
  {
    id: 'task-manager',
    title: 'Task Manager App',
    image: projectImage,
    description:
      'A React task manager with drag-and-drop boards, filtering, and offline persistence via localStorage.',
    tech: ['React', 'React Hooks', 'CSS Modules', 'localStorage'],
    github: 'https://github.com/johndoe/task-manager',
    demo: 'https://johndoe-tasks.example.com',
    features: [
      'Drag-and-drop task boards',
      'Filter and search',
      'Offline persistence',
      'Responsive design',
    ],
  },
  {
    id: 'api-testing-framework',
    title: 'API Testing Framework',
    image: projectImage,
    description:
      'A reusable REST API testing framework with data-driven test cases and JSON schema validation.',
    tech: ['Postman', 'Newman', 'JavaScript', 'REST'],
    github: 'https://github.com/johndoe/api-testing-framework',
    demo: 'https://example.com/api-test-report',
    features: [
      'Data-driven test collections',
      'JSON schema validation',
      'Automated Newman runs',
      'Environment configs',
    ],
  },
  {
    id: 'weather-dashboard',
    title: 'Weather Dashboard',
    image: projectImage,
    description:
      'A React weather dashboard consuming a public API with city search, geolocation, and forecast charts.',
    tech: ['React', 'REST API', 'Chart.js', 'CSS Modules'],
    github: 'https://github.com/johndoe/weather-dashboard',
    demo: 'https://johndoe-weather.example.com',
    features: [
      'City search & geolocation',
      '5-day forecast charts',
      'Responsive cards',
      'Loading and error states',
    ],
  },
  {
    id: 'bug-tracker',
    title: 'Bug Tracking Dashboard',
    image: projectImage,
    description:
      'A full-featured dashboard for logging, triaging, and monitoring defects across multiple projects.',
    tech: ['React', 'React Router', 'CSS Modules', 'Chart.js'],
    github: 'https://github.com/johndoe/bug-tracker',
    demo: 'https://johndoe-bugtracker.example.com',
    features: [
      'Defect logging & triage',
      'Status & severity filters',
      'Analytics charts',
      'Role-based views (demo)',
    ],
  },
]
