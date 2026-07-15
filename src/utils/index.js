// Public surface (barrel) for the src/utils folder.
//
// Re-exports every named export from the four leaf util modules so consumers
// (hooks, ui components, sections) can import from a single, stable path:
//
//   import { validateEmail, scrollToId, BREAKPOINTS, fadeInUp } from '@/utils'
//
// Internal siblings import each other by RELATIVE path (e.g. scroll.js imports
// './constants' directly), never through this barrel — that keeps the folder
// free of a self-referential cycle. This file therefore uses relative paths
// ('./constants', not the '@/utils' alias) and stays a pure `export *` list:
// adding or removing a util module only requires touching these lines.
//
// There are no name collisions across the four modules, so `export *` is
// unambiguous. None of the leaves has a default export, so nothing is lost by
// re-exporting named bindings only.
export * from './constants'
export * from './validators'
export * from './scroll'
export * from './animations'
