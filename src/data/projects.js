// Project portfolio data. Each `image` is the project-specific placeholder
// thumbnail authored under @/assets/images/projects/ (one SVG per project id);
// replace with real project screenshots when supplied.
//
// Additive, backward-compatible fields:
//   `category` — a single grouping label used by `hooks/useProjectFilter` to
//                build the category filter chips. The existing `image`-based
//                card rendering is unaffected.
//   `gallery`  — an ordered list of image URLs shown in the ProjectModal image
//                carousel (`hooks/useCarousel`). It always starts with the
//                existing thumbnail so there is at least one slide; extra
//                gallery placeholders exist only for the featured projects.
import portfolioImage from '@/assets/images/projects/portfolio-website.svg'
import portfolioImage2 from '@/assets/images/projects/portfolio-website-2.svg'
import portfolioImage3 from '@/assets/images/projects/portfolio-website-3.svg'
import ecommerceImage from '@/assets/images/projects/ecommerce-test-suite.svg'
import ecommerceImage2 from '@/assets/images/projects/ecommerce-test-suite-2.svg'
import ecommerceImage3 from '@/assets/images/projects/ecommerce-test-suite-3.svg'
import taskManagerImage from '@/assets/images/projects/task-manager.svg'
import apiTestingImage from '@/assets/images/projects/api-testing-framework.svg'
import weatherImage from '@/assets/images/projects/weather-dashboard.svg'
import bugTrackerImage from '@/assets/images/projects/bug-tracker.svg'

export const projects = [
  {
    id: 'portfolio-website',
    title: 'Personal Portfolio Website',
    category: 'React',
    image: portfolioImage,
    gallery: [portfolioImage, portfolioImage2, portfolioImage3],
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
    category: 'Automation',
    image: ecommerceImage,
    gallery: [ecommerceImage, ecommerceImage2, ecommerceImage3],
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
    category: 'React',
    image: taskManagerImage,
    gallery: [taskManagerImage],
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
    category: 'Testing',
    image: apiTestingImage,
    gallery: [apiTestingImage],
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
    category: 'React',
    image: weatherImage,
    gallery: [weatherImage],
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
    category: 'React',
    image: bugTrackerImage,
    gallery: [bugTrackerImage],
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
