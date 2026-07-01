/**
 * Professional timeline data for the Experience section.
 *
 * Consumed by `sections/Experience` and its `TimelineItem` subcomponent to
 * render a chronological timeline covering education, QA experience, the React
 * learning journey, and certifications.
 *
 * This module is intentionally icon-free and dependency-free (plain data only):
 * the category icon/color for each entry is selected LOCALLY inside
 * `TimelineItem` based on the `type` field, so the allowed `type` values below
 * must remain stable and spelled exactly.
 *
 * @typedef {Object} ExperienceItem
 * @property {'Education' | 'Experience' | 'Journey' | 'Certification'} type
 *   Category used by `TimelineItem` to pick a category icon/color.
 * @property {string} title       Role, degree, or credential name.
 * @property {string} org         Institution, employer, or issuing body.
 * @property {string} period      Human-readable date range (e.g. '2023 - Present').
 * @property {string} description Short summary of the entry.
 *
 * @type {ExperienceItem[]}
 */
export const experience = [
  {
    type: 'Education',
    title: 'B.S. in Computer Science',
    org: 'State University',
    period: '2018 - 2022',
    description:
      'Built a strong foundation in algorithms, web development, and software testing methodologies.',
  },
  {
    type: 'Experience',
    title: 'Junior QA Analyst',
    org: 'AppWorks Studio',
    period: '2022 - 2023',
    description:
      'Executed functional, UI, and API test cases and authored detailed, reproducible defect reports.',
  },
  {
    type: 'Experience',
    title: 'QA Engineer',
    org: 'Tech Solutions Inc.',
    period: '2023 - Present',
    description:
      'Own the regression cycle, drive test-automation adoption, and collaborate with developers to ship quality releases.',
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
