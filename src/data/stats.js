/**
 * stats — headline portfolio statistics for the animated Statistics section.
 *
 * Consumed by `sections/Statistics`: each entry's numeric `value` is the
 * count-up target fed to `hooks/useCountUp`, `suffix` is appended after the
 * animated number, `label` is the caption, and `icon` is a decorative
 * `react-icons` component reference rendered by the shared `StatCard` primitive
 * (`components/ui/StatCard`). The four counters mirror the user-requested
 * metrics — projects completed, years of experience, technologies learned, and
 * happy clients — and their numbers stay consistent with `data/about.js`
 * (2+ years, 20+ projects, 15+ technologies) so the two sections never disagree.
 *
 * The icon is a component reference (not an element), matching the convention in
 * `data/services.js`; `StatCard` renders it as `<Icon />` and marks it
 * `aria-hidden`, so the visible value + label carry the meaning for assistive
 * technology.
 *
 * @typedef {Object} Stat
 * @property {number} value  Count-up target (the final number to animate to).
 * @property {string} suffix Symbol appended after the number (e.g. '+').
 * @property {string} label  Caption shown beneath the value.
 * @property {import('react').ComponentType} icon Decorative react-icons component reference.
 *
 * @type {Stat[]}
 */
import { FaDiagramProject, FaBriefcase, FaCode, FaUsers } from 'react-icons/fa6'

export const stats = [
  { value: 20, suffix: '+', label: 'Projects Completed', icon: FaDiagramProject },
  { value: 2, suffix: '+', label: 'Years of Experience', icon: FaBriefcase },
  { value: 15, suffix: '+', label: 'Technologies Learned', icon: FaCode },
  { value: 30, suffix: '+', label: 'Happy Clients', icon: FaUsers },
]
