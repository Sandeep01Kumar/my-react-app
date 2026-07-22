/**
 * Professional timeline data for the Experience section.
 *
 * Consumed by `sections/Experience` and its `TimelineItem` subcomponent to
 * render a chronological timeline covering education, QA experience, the React
 * learning journey, and certifications.
 *
 * The category icon/color for each entry is selected LOCALLY inside
 * `TimelineItem` based on the `type` field, so the allowed `type` values below
 * must remain stable and spelled exactly.
 *
 * The optional `logo`, `tech`, and `achievements` fields are additive and
 * backward-compatible: `TimelineItem` renders each only when present, so entries
 * without them continue to render exactly as before. Company/organization logos
 * are imported here (Vite resolves each `@/assets/images/experience/*.svg` to a
 * URL string) and are PLACEHOLDER art pending real, user-supplied logos
 * (post-merge manual step, AAP §0.7.2).
 *
 * @typedef {Object} ExperienceItem
 * @property {'Education' | 'Experience' | 'Journey' | 'Certification'} type
 *   Category used by `TimelineItem` to pick a category icon/color.
 * @property {string} title       Role, degree, or credential name.
 * @property {string} org         Institution, employer, or issuing body.
 * @property {string} period      Human-readable date range (e.g. '2023 - Present').
 * @property {string} description Short summary of the entry.
 * @property {string} [logo]         Optional imported organization-logo asset URL (placeholder).
 * @property {string[]} [tech]        Optional technologies/tools rendered as Badges.
 * @property {string[]} [achievements] Optional key achievements rendered as a list.
 *
 * @type {ExperienceItem[]}
 */
import stateUniversityLogo from '@/assets/images/experience/state-university.svg'
import appworksLogo from '@/assets/images/experience/appworks-studio.svg'
import techSolutionsLogo from '@/assets/images/experience/tech-solutions.svg'

export const experience = [
  {
    type: 'Education',
    title: 'B.S. in Computer Science',
    org: 'State University',
    period: '2018 - 2022',
    description:
      'Built a strong foundation in algorithms, web development, and software testing methodologies.',
    logo: stateUniversityLogo,
  },
  {
    type: 'Experience',
    title: 'Junior QA Analyst',
    org: 'AppWorks Studio',
    period: '2022 - 2023',
    description:
      'Executed functional, UI, and API test cases and authored detailed, reproducible defect reports.',
    logo: appworksLogo,
    tech: ['Manual Testing', 'API Testing', 'Postman', 'Jira'],
    achievements: [
      'Authored 300+ clear, reproducible defect reports across web and mobile.',
      'Verified fixes and reduced defect leakage into production.',
    ],
  },
  {
    type: 'Experience',
    title: 'QA Engineer',
    org: 'Tech Solutions Inc.',
    period: '2023 - Present',
    description:
      'Own the regression cycle, drive test-automation adoption, and collaborate with developers to ship quality releases.',
    logo: techSolutionsLogo,
    tech: ['Selenium', 'Cypress', 'Regression Testing', 'CI/CD', 'React'],
    achievements: [
      'Reduced the regression testing cycle time by 30% with reusable test suites.',
      'Reported and tracked 500+ defects across web and mobile products.',
      'Championed test-automation adoption across the QA team.',
    ],
  },
  {
    type: 'Journey',
    title: 'React Developer Journey',
    org: 'Self-Directed Learning',
    period: '2023 - Present',
    description:
      'Transitioned into frontend engineering, building production-grade React applications with modern tooling.',
  },
  {
    type: 'Certification',
    title: 'ISTQB Certified Tester — Foundation Level',
    org: 'ISTQB',
    period: '2023',
    description: 'Formalized testing fundamentals: test design, techniques, and management.',
  },
  {
    type: 'Certification',
    title: 'Meta Front-End Developer',
    org: 'Coursera',
    period: '2024',
    description:
      'Completed the professional certificate covering React, responsive design, and version control.',
  },
]
