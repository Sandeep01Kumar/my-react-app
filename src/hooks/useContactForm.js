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
 * Submit delivery is env-guarded. When `VITE_EMAILJS_SERVICE_ID`,
 * `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` are all set, the
 * submit sends the message via `@emailjs/browser`, loaded lazily through a
 * dynamic (`@vite-ignore`) import so the bundler never resolves it at build
 * time. When they are not all set (the default), the submit falls back to the
 * existing simulated client-side delay — so the form works out of the box with
 * no configuration. `@emailjs/browser` is an optional post-merge install and is
 * intentionally NOT a declared dependency (see `.env.example`).
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

// EmailJS placeholder wiring (AAP §0.6.2). These Vite env vars are read at
// module scope so they are not reactive dependencies of any hook callback.
// They are EMPTY by default (no `.env` file / see `.env.example`), so
// `isEmailJsConfigured` is false and the real-send branch below is inert —
// the form always falls back to the existing simulated submit. Real delivery
// is activated post-merge by installing `@emailjs/browser` and setting these.
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const isEmailJsConfigured = Boolean(
  EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY,
)

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

      // Real delivery path — only when all EmailJS env vars are present. Uses a
      // DYNAMIC import with `@vite-ignore` so the bundler never tries to resolve
      // the (intentionally uninstalled) `@emailjs/browser` package at build
      // time. This branch is inert by default because the env vars are empty.
      if (isEmailJsConfigured) {
        try {
          // Hold the package name in a variable so BOTH Vite's dev
          // import-analysis and Rollup's build analysis treat this as a fully
          // runtime dynamic import and never try to resolve the intentionally
          // uninstalled `@emailjs/browser` package. `@vite-ignore` suppresses
          // the dev-only "dynamic import cannot be analyzed" warning. (A bare
          // inline string literal here is eagerly resolved by the dev server
          // and would 500 the whole app whenever the package is absent.)
          const emailjsModule = '@emailjs/browser'
          const { default: emailjs } = await import(/* @vite-ignore */ emailjsModule)
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              from_name: values.name,
              reply_to: values.email,
              subject: values.subject,
              message: values.message,
            },
            { publicKey: EMAILJS_PUBLIC_KEY },
          )
          setStatus('success')
          setValues(INITIAL_VALUES)
          setTouched({})
        } catch {
          setStatus('error')
        }
        return
      }

      try {
        // Simulated async submit — the backward-compatible fallback used
        // whenever EmailJS is not configured (the default). The form works out
        // of the box client-side with no env configuration required.
        await new Promise((resolve) => setTimeout(resolve, 1200))
        setStatus('success')
        setValues(INITIAL_VALUES)
        setTouched({})
      } catch {
        setStatus('error')
      }
    },
    [isValid, values],
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
