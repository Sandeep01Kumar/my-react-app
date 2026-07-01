import { useCallback, useMemo, useState } from 'react'
import { validateContactForm } from '@/utils'

/**
 * useContactForm — the Contact section's form state machine + validation.
 *
 * Encapsulates every concern of the Contact form so the presentational
 * component (`sections/Contact/ContactForm`) stays declarative: it owns the
 * field values, per-field error messages, "touched" tracking, a submit
 * lifecycle status, and the change/blur/submit handlers. Validation is
 * delegated to `validateContactForm` from `@/utils` (a pure, framework-agnostic
 * helper), invalid submissions are blocked, and a successful submit is
 * simulated client-side.
 *
 * There is intentionally NO backend call here. Per AAP §0.3.2 / §0.6.1 an
 * email-delivery integration (e.g. `@emailjs/browser`) is an explicitly
 * out-of-scope future enhancement; the submit is a short simulated async delay
 * that resolves into the success state. Swap the simulated `Promise` for a real
 * request when a delivery service is wired up.
 *
 * Design notes (why it is shaped this way):
 * - `errors` and `isValid` are DERIVED from `values` with `useMemo`, never
 *   stored in state. This eliminates a whole class of stale-error bugs (state
 *   that drifts out of sync with the inputs) and keeps every dependency array
 *   trivially correct.
 * - `visibleErrors` gates each field's error behind its `touched` flag, so an
 *   error is only surfaced after the user has blurred that field (or after a
 *   submit attempt, which marks every field touched). This yields a polished UX
 *   — no errors shouted before the user has interacted — while still enforcing
 *   full validation on submit.
 * - `handleChange` uses the FUNCTIONAL `setStatus` updater so it does not depend
 *   on `status`, letting the handler stay dependency-free (`[]`) and
 *   referentially stable across renders.
 *
 * The returned handlers are wired directly to the form's native events; the
 * controlled inputs must each carry a `name` attribute matching a field key
 * (`name` | `email` | `subject` | `message`).
 *
 * @returns {{
 *   values: { name: string, email: string, subject: string, message: string },
 *   errors: { name: string, email: string, subject: string, message: string },
 *   status: 'idle' | 'submitting' | 'success' | 'error',
 *   isValid: boolean,
 *   handleChange: (event: import('react').ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
 *   handleBlur: (event: import('react').FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
 *   handleSubmit: (event: import('react').FormEvent<HTMLFormElement>) => Promise<void>,
 * }} The form model: current `values`, `touched`-gated `errors`, submit
 *   `status`, overall `isValid` flag (use it to disable the submit control),
 *   and the `handleChange` / `handleBlur` / `handleSubmit` handlers.
 *
 * @example
 * const { values, errors, status, isValid, handleChange, handleBlur, handleSubmit } = useContactForm()
 * return (
 *   <form onSubmit={handleSubmit} noValidate>
 *     <input name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} />
 *     {errors.name && <span role="alert">{errors.name}</span>}
 *     <button type="submit" disabled={!isValid || status === 'submitting'}>Send</button>
 *     {status === 'success' && <p>Thanks — your message has been sent.</p>}
 *   </form>
 * )
 */

// Empty field values, reused for both the initial state and the post-success
// reset so the two can never drift apart.
const INITIAL_VALUES = { name: '', email: '', subject: '', message: '' }

export function useContactForm() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')

  // Derived (not stored): full per-field errors recomputed whenever values
  // change. `validateContactForm` is a module-scope import, so it is not a
  // reactive dependency.
  const errors = useMemo(() => validateContactForm(values), [values])

  // The whole form is valid only when every field's error message is empty.
  const isValid = useMemo(() => Object.values(errors).every((message) => !message), [errors])

  // Only surface a field's error once it has been touched (blurred or submitted).
  const visibleErrors = useMemo(
    () =>
      Object.keys(values).reduce((acc, field) => {
        acc[field] = touched[field] ? errors[field] : ''
        return acc
      }, {}),
    [values, touched, errors],
  )

  const handleChange = useCallback((event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // Clear a prior success/error banner as soon as the user edits again.
    setStatus((prev) => (prev === 'success' || prev === 'error' ? 'idle' : prev))
  }, [])

  const handleBlur = useCallback((event) => {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()
      // Mark every field touched so all outstanding errors become visible.
      setTouched({ name: true, email: true, subject: true, message: true })

      if (!isValid) {
        setStatus('error')
        return
      }

      setStatus('submitting')
      try {
        // Simulated async submit (client-side only; swap for a real request later).
        await new Promise((resolve) => setTimeout(resolve, 1200))
        setStatus('success')
        setValues(INITIAL_VALUES)
        setTouched({})
      } catch {
        setStatus('error')
      }
    },
    [isValid],
  )

  return {
    values,
    errors: visibleErrors,
    status,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  }
}
