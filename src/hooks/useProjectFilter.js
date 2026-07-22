import { useMemo, useState } from 'react'

/**
 * useProjectFilter — the Projects section's category + text-search derivation.
 *
 * Owns the *derived view* of the project list and nothing else: which category
 * chip is active, the current search query, the set of selectable categories,
 * and the resulting filtered list. It renders no markup — the consuming
 * component (`sections/Projects`) provides the category filter control and the
 * search input, wires them to `setCategory`/`setQuery`, and maps over
 * `filteredProjects`. Logic lives here, presentation stays in the component, per
 * the app's "business logic in hooks" rule (AAP §0.6.2).
 *
 * This is a PURE derivation built from `useState` + `useMemo` ONLY — there are
 * intentionally NO effects. The two outputs (`categories`, `filteredProjects`)
 * are DERIVED from the inputs with `useMemo`, never stored in state, mirroring
 * the derived-state pattern in `useContactForm` (`errors`/`isValid`/
 * `visibleErrors`). Deriving rather than storing eliminates a whole class of
 * stale-list bugs (a cached result drifting out of sync with the query) and
 * keeps every dependency array trivially correct. Because nothing is written to
 * state inside an effect, the ESLint `react-hooks/set-state-in-effect` rule does
 * not apply, and there are no timers, subscriptions, or cleanup concerns.
 *
 * Filtering semantics:
 * - Category: the synthetic `'All'` option (and an empty value) means "no
 *   category constraint"; any other value is an exact, case-sensitive match
 *   against a project's `category` field.
 * - Text search: case-insensitive and matched against a project's `title`,
 *   `description`, and every entry of its `tech` array joined into a single
 *   haystack, so a query like `"selenium"` matches a project whose description
 *   mentions "Selenium automation" and `"react"` matches via the title or a
 *   `tech` entry. A blank/whitespace-only query imposes no text constraint.
 * - The two constraints are combined with AND — a project must satisfy both the
 *   active category and the current query to appear in `filteredProjects`.
 *
 * Defensive by construction: the hook never mutates the incoming `projects`
 * array, tolerates a missing `category` on any project (such a project simply
 * never matches a specific category and is only shown under `'All'`), guards a
 * missing `tech` array with `?? []`, and drops any `undefined`/empty haystack
 * pieces with `filter(Boolean)` before joining — so a partially-populated
 * project can never throw. Both outputs are memoized, so their identity is
 * stable between renders unless the relevant inputs actually change, keeping any
 * memoized children (e.g. the mapped project cards) from re-rendering needlessly.
 *
 * @param {Array<{
 *   id?: string,
 *   title?: string,
 *   description?: string,
 *   tech?: string[],
 *   category?: string,
 * }>} [projects=[]] - The full project list (typically the `projects` constant
 *   from `@/data`). Only `title`, `description`, `tech`, and `category` are read
 *   here; all other fields are ignored by the filter and passed through
 *   untouched. Missing optional fields are handled defensively.
 * @returns {{
 *   category: string,
 *   setCategory: (category: string) => void,
 *   query: string,
 *   setQuery: (query: string) => void,
 *   categories: string[],
 *   filteredProjects: Array<object>,
 * }} The active `category` and its `setCategory` setter, the current search
 *   `query` and its `setQuery` setter, the derived `categories` list
 *   (`['All', ...unique defined categories]`) for rendering the filter control,
 *   and the memoized `filteredProjects` list to render.
 *
 * @example
 * const {
 *   category,
 *   setCategory,
 *   query,
 *   setQuery,
 *   categories,
 *   filteredProjects,
 * } = useProjectFilter(projects)
 * return (
 *   <>
 *     <div role="group" aria-label="Filter projects by category">
 *       {categories.map((name) => (
 *         <Button
 *           key={name}
 *           variant={name === category ? 'primary' : 'ghost'}
 *           onClick={() => setCategory(name)}
 *         >
 *           {name}
 *         </Button>
 *       ))}
 *     </div>
 *     <input
 *       type="search"
 *       value={query}
 *       onChange={(event) => setQuery(event.target.value)}
 *       placeholder="Search projects…"
 *     />
 *     {filteredProjects.map((project) => (
 *       <ProjectCard key={project.id} project={project} />
 *     ))}
 *   </>
 * )
 */

// The synthetic "show everything" category. It is prepended to the derived
// `categories` list and treated as the absence of a category filter, so the
// filter control always has a neutral default and the user can clear a
// selection by returning to it.
const ALL_CATEGORY = 'All'

export function useProjectFilter(projects = []) {
  const [category, setCategory] = useState(ALL_CATEGORY)
  const [query, setQuery] = useState('')

  // The selectable categories: every unique, defined `category` value found in
  // the data, in first-seen order, with the synthetic "All" option prepended.
  // `filter(Boolean)` drops projects that have no category so it never leaks an
  // `undefined` chip; `new Set` de-duplicates. Recomputed only when the
  // `projects` reference changes.
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(projects.map((project) => project.category).filter(Boolean)),
    )
    return [ALL_CATEGORY, ...unique]
  }, [projects])

  // The filtered list: a project is kept only when it satisfies BOTH the active
  // category (an "All"/empty selection imposes no constraint) AND the current
  // search query (case-insensitive across title, description, and each `tech`
  // entry). Pure derivation — the source array is read, never mutated — so the
  // result is recomputed only when `projects`, `category`, or `query` change.
  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesCategory =
        !category || category === ALL_CATEGORY || project.category === category
      if (!matchesCategory) {
        return false
      }
      // An empty query means "match everything that passed the category test".
      if (!normalizedQuery) {
        return true
      }
      // Build one lower-cased haystack from the searchable fields, guarding a
      // missing `tech` array and dropping any undefined/empty pieces so a
      // partially-populated project can never throw.
      const haystack = [project.title, project.description, ...(project.tech ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [projects, category, query])

  return { category, setCategory, query, setQuery, categories, filteredProjects }
}
