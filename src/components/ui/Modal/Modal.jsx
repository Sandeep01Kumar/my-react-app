/**
 * Modal — accessible, animated, portal-based dialog/popup primitive.
 *
 * Renders a full-viewport scrim + centered panel into `document.body` via a
 * React portal, so the dialog escapes any section stacking/overflow context.
 * The overlay and panel animate in and out with Framer Motion (`fadeIn` for the
 * scrim, `scaleIn` for the panel) through `AnimatePresence`, so both open and
 * close are animated. This is the single reusable dialog primitive
 * (AAP §0.4.1 Group 2, §0.5.3); its first consumer is
 * `src/sections/Projects/ProjectModal`, so this file defines the API contract
 * (`isOpen`, `onClose`, `title`, `children`) every consumer follows.
 *
 * Behavior while open (all handled in one effect keyed on [isOpen, onClose]):
 *   - Body scroll is locked, and the prior overflow is restored on close.
 *   - ESC, a scrim (overlay) click, and the close button each invoke `onClose`;
 *     a click inside the panel does NOT close it (propagation is stopped).
 *   - Focus is moved into the dialog on open and trapped (Tab / Shift+Tab wrap
 *     around the first/last focusable element); on close, focus is restored to
 *     the element that was focused before the dialog opened.
 *
 * Accessibility: the panel is `role="dialog"` + `aria-modal="true"` and is
 * labelled by the header `<h2>` through a `useId`-generated `aria-labelledby`,
 * so it stays collision-free even if several modals mount. The close button
 * carries an `aria-label` and its icon is `aria-hidden`. Visible focus rings
 * come from the sibling CSS Module's `.close:focus-visible` plus the global
 * `:focus-visible` rule.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the dialog is currently visible.
 * @param {() => void} props.onClose - Invoked on ESC, overlay click, and close click.
 * @param {string} props.title - Dialog title; rendered as the header `<h2>` and
 *   referenced by the panel's `aria-labelledby`.
 * @param {import('react').ReactNode} props.children - Dialog body content.
 * @returns {import('react').ReactPortal} The dialog rendered into `document.body`.
 */
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose } from 'react-icons/md'
import { fadeIn, scaleIn } from '@/utils'
import styles from './Modal.module.css'

// Elements treated as focusable by the focus trap and the initial-focus logic.
// Declared once at module scope so it is a stable, non-reactive value: it never
// needs to be an effect dependency, which keeps the dependency array clean.
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function Modal({ isOpen, onClose, title, children }) {
  // Stable, SSR-safe id that ties the panel's aria-labelledby to the <h2>.
  const titleId = useId()
  // Ref to the dialog panel — used for initial focus and the focus trap.
  const panelRef = useRef(null)
  // Remembers the element focused before opening, to restore focus on close.
  const previousActiveRef = useRef(null)

  useEffect(() => {
    // Only wire up dialog behavior while open; when closed the guard returns
    // early and the previous run's cleanup has already restored everything.
    if (!isOpen) return

    // Remember what had focus so it can be restored when the dialog closes.
    previousActiveRef.current = document.activeElement

    // Lock body scroll while the dialog is open, preserving the prior value.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // ESC closes; Tab / Shift+Tab are kept within the dialog (focus trap).
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return

      const focusable = panel.querySelectorAll(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) {
        // Nothing focusable inside — keep focus pinned to the panel itself.
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Move initial focus into the dialog: the first focusable element, or the
    // panel itself (it has tabIndex={-1}) when there is nothing focusable.
    const panel = panelRef.current
    if (panel) {
      const focusable = panel.querySelectorAll(FOCUSABLE_SELECTOR)
      const target = focusable.length > 0 ? focusable[0] : panel
      target.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      const previous = previousActiveRef.current
      if (previous && typeof previous.focus === 'function') previous.focus()
    }
  }, [isOpen, onClose])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            className={styles.panel}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Close"
              >
                <MdClose aria-hidden="true" />
              </button>
            </div>
            <div className={styles.body}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default Modal
