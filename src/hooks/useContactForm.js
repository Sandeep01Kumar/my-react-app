import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { validateContactForm } from '@/utils'

/**
 * useContactForm — the Contact section's form state machine + validation.
 *
 * Encapsulates every concern of the Contact form so the presentational
 * component (`sections/Contact/ContactForm`) stays declarative: it owns the
 * field values, per-field error messages, "touched" tracking, a submit
 * lifecycle status, and the change/blur/submit handlers. Validation is
 * delegated to `validateContactForm` from `@/utils` (a pure, framework-agnostic
 * helper), invalid submissions are blocked, and — when real delivery is not
 * activated — a submit is acknowledged HONESTLY as a local demo (never faked as
 * "sent").
 *
 * Submit delivery is env-guarded by the EXACT-THREE credential contract
 * (AAP §0.2.3, §0.6.2). Real delivery is attempted when — and only when — all
 * three credentials (`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`,
 * `VITE_EMAILJS_PUBLIC_KEY`) are set. There is no separate opt-in flag: the
 * presence of all three credentials IS the activation switch. When any of them
 * is missing (the default — no `.env` file ships), the form stays in the safe
 * simulated "demo" mode.
 *
 * Behavior by configuration (see `.env.example` + README "Contact Form"):
 * - Default / partial (any credential absent) → DEMO: the submit is validated,
 *   a short delay is simulated, then the status is `'demo'` and the entered
 *   values are PRESERVED (never cleared). The UI states no message was sent.
 * - All three credentials set → the controlled real-send path is attempted via
 *   `@emailjs/browser`; on confirmed delivery the status is `'success'` and the
 *   form is reset. Because the SDK is intentionally absent until the post-merge
 *   wiring (below), the attempt fails visibly and recoverably as `'submitError'`
 *   rather than a false confirmation — never a blank page or infinite loading.
 *
 * IMPORTANT — activating real delivery is a multi-part change, NOT just env
 * vars. `@emailjs/browser` is intentionally NOT a declared dependency (see
 * `.env.example`), and the `@vite-ignore` dynamic import below is deliberately
 * left unbundled so the build stays green while the package is absent. Because
 * the bundler therefore never includes the SDK, even with all three credentials
 * a production build carries an unresolved bare specifier the browser cannot
 * load — surfaced here as the controlled `'submitError'`. To actually enable
 * delivery you must: (1) `npm install @emailjs/browser` (v4.x); (2) convert the
 * deferred `@vite-ignore` dynamic import below into a statically analyzable
 * import — e.g. a top-level `import emailjs from '@emailjs/browser'`, or a plain
 * `await import('@emailjs/browser')` WITHOUT `@vite-ignore` — so Vite bundles the
 * SDK into a resolvable chunk; (3) set the three credentials and rebuild. See
 * the README "Contact Form" section for the full walkthrough.
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
 * - Async submits are lifecycle-safe: the simulated-delay timer is retained and
 *   cleared on unmount, and every post-await / post-timeout state update is
 *   guarded by a mounted ref, so navigating away mid-submit never triggers a
 *   state update on an unmounted component (CWE-361/362 hardening).
 * - A submit is guarded against re-entry (an in-flight submit ignores further
 *   submits), the exact submitted values are snapshotted, and a post-delivery
 *   reset only clears the form when the current values still equal that snapshot
 *   — so a user typing during an in-flight submit can never lose their edit.
 *
 * The returned handlers are wired directly to the form's native events; the
 * controlled inputs must each carry a `name` attribute matching a field key
 * (`name` | `email` | `subject` | `message`).
 *
 * @returns {{
 *   values: { name: string, email: string, subject: string, message: string },
 *   errors: { name: string, email: string, subject: string, message: string },
 *   status: 'idle' | 'submitting' | 'success' | 'demo' | 'error' | 'submitError',
 *   isValid: boolean,
 *   handleChange: (event: import('react').ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
 *   handleBlur: (event: import('react').FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
 *   handleSubmit: (event: import('react').FormEvent<HTMLFormElement>) => Promise<void>,
 * }} The form model: current `values`, `touched`-gated `errors`, submit
 *   `status`, overall `isValid` flag (use it to disable the submit control),
 *   and the `handleChange` / `handleBlur` / `handleSubmit` handlers. The
 *   `status` distinguishes a submit blocked by validation (`'error'`), a
 *   delivery failure of an otherwise-valid submission (`'submitError'`), a
 *   confirmed real delivery (`'success'`), and an honest local demo
 *   acknowledgement that nothing was sent (`'demo'`) so the consumer can surface
 *   the correct message for each case.
 *
 * @example
 * const { values, errors, status, isValid, handleChange, handleBlur, handleSubmit } = useContactForm()
 * return (
 *   <form onSubmit={handleSubmit} noValidate>
 *     <input name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} disabled={status === 'submitting'} />
 *     {errors.name && <span role="alert">{errors.name}</span>}
 *     <button type="submit" disabled={!isValid || status === 'submitting'}>Send</button>
 *     {status === 'success' && <p>Thanks — your message has been sent.</p>}
 *     {status === 'demo' && <p>Demo mode — your message was not sent.</p>}
 *   </form>
 * )
 */

// Empty field values, reused for both the initial state and the post-success
// reset so the two can never drift apart.
const INITIAL_VALUES = { name: '', email: '', subject: '', message: '' }

// Delay (ms) of the simulated demo submit — long enough to exercise the
// loading state, short enough to stay snappy. Named so the value is not a bare
// literal buried in the handler.
const SIMULATED_SUBMIT_DELAY_MS = 1200

// EmailJS activation contract (AAP §0.2.3, §0.6.2) — the EXACT-THREE credential
// contract. Real delivery is activated by the presence of ALL THREE credentials;
// the credentials themselves ARE the switch, with no separate opt-in flag.
// Reading these at module scope keeps them out of every hook callback's
// dependency array. The credential vars are EMPTY by default (no `.env` file
// ships / see `.env.example`), so out of the box `isEmailJsActivated` is false
// and the form stays in the safe simulated "demo" mode. A partial configuration
// (one or two credentials) is also treated as NOT activated, so it likewise
// falls back to demo — never a broken state.
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
// Real delivery is attempted only when fully credentialed (all three present).
const isEmailJsActivated = Boolean(
  EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY,
)

export function useContactForm() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')

  // Lifecycle + concurrency refs (never trigger re-renders):
  // - isMountedRef gates post-async state updates so nothing runs after unmount.
  // - timeoutRef retains the simulated-submit timer so it can be cleared.
  // - isSubmittingRef is the synchronous in-flight/re-entry guard.
  // - valuesRef mirrors the latest values so an async submit can compare the
  //   submitted snapshot against what the user currently has typed.
  const isMountedRef = useRef(true)
  const timeoutRef = useRef(null)
  const isSubmittingRef = useRef(false)
  const valuesRef = useRef(values)

  // Keep the live mirror of values in sync for the snapshot comparison (P7-F1).
  useEffect(() => {
    valuesRef.current = values
  }, [values])

  // Mount/unmount lifecycle guard (P4-F4 / CWE-361 hardening):
  // - On (re)mount, restore the flag to true. This is mandatory for React
  //   StrictMode, whose dev-only mount -> unmount -> remount cycle would
  //   otherwise leave the flag stuck at false after the simulated unmount,
  //   silently suppressing every post-async state update.
  // - On unmount, mark unmounted and clear any pending simulated-submit timer
  //   so no state update fires after teardown.
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

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
    // Clear a prior terminal banner (success / demo / validation-error /
    // delivery-error) as soon as the user edits again.
    setStatus((prev) =>
      prev === 'success' || prev === 'demo' || prev === 'error' || prev === 'submitError'
        ? 'idle'
        : prev,
    )
  }, [])

  const handleBlur = useCallback((event) => {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault()

      // Re-entry guard: ignore a submit while one is already in flight so a
      // double-submit (Enter + click, or programmatic) cannot race (P7-F1).
      if (isSubmittingRef.current) {
        return
      }

      // Mark every field touched so all outstanding errors become visible.
      setTouched({ name: true, email: true, subject: true, message: true })

      if (!isValid) {
        setStatus('error')
        return
      }

      // Snapshot the exact values being submitted so a post-completion reset can
      // verify the user has not typed something newer underneath it (P7-F1).
      const submitted = valuesRef.current
      isSubmittingRef.current = true
      setStatus('submitting')

      // Guarded state setter — only runs while the component is still mounted.
      const safeSetStatus = (next) => {
        if (isMountedRef.current) {
          setStatus(next)
        }
      }
      // Reset the form only if the current values still equal the submitted
      // snapshot; otherwise the user edited during the submit and we keep their
      // newer input intact (P7-F1). Used only on CONFIRMED real delivery.
      const resetIfUnchanged = () => {
        if (!isMountedRef.current) {
          return
        }
        const current = valuesRef.current
        const unchanged = Object.keys(INITIAL_VALUES).every(
          (key) => current[key] === submitted[key],
        )
        if (unchanged) {
          setValues(INITIAL_VALUES)
          setTouched({})
        }
      }

      // Real delivery path — attempted only when EmailJS is fully activated
      // (all three credentials present, AAP §0.6.2). Uses a DYNAMIC import with
      // `@vite-ignore` so the bundler never resolves the (intentionally
      // uninstalled) `@emailjs/browser` package at build time; with the package
      // absent the import throws and the catch below surfaces a controlled
      // delivery error (`'submitError'`) rather than a false confirmation.
      if (isEmailJsActivated) {
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
              from_name: submitted.name,
              reply_to: submitted.email,
              subject: submitted.subject,
              message: submitted.message,
            },
            { publicKey: EMAILJS_PUBLIC_KEY },
          )
          // Confirmed delivery: success + reset (only if untouched during send).
          safeSetStatus('success')
          resetIfUnchanged()
        } catch {
          // Delivery failed on an otherwise-valid submission — surface the
          // distinct delivery-error state, NOT the validation `error` state, so
          // the UI does not misleadingly tell the user to fix their fields.
          safeSetStatus('submitError')
        } finally {
          isSubmittingRef.current = false
        }
        return
      }

      // Demo / unconfigured path (default — reached whenever the three
      // credentials are not all present, including partial configuration).
      // Simulate a short async delay via a RETAINED timer (cleared on unmount,
      // P4-F4), then TRUTHFULLY report a local demo — nothing was sent — and
      // PRESERVE the user's input (never clear it) so the form makes no false
      // "sent" claim (P4-F2 / P7-F1).
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        isSubmittingRef.current = false
        safeSetStatus('demo')
      }, SIMULATED_SUBMIT_DELAY_MS)
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
