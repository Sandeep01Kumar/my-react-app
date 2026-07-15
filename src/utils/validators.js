/**
 * Contact-form field validators.
 *
 * Pure, framework-agnostic validation helpers consumed by
 * `src/hooks/useContactForm.js` to validate the Contact section form
 * (Name, Email, Subject, Message), drive per-field error states, and
 * prevent invalid submission.
 *
 * Contract: each validator accepts a single value and returns a user-facing
 * error message string, or an empty string ('') when the value is valid.
 * An empty string always means "valid"; a non-empty string is the message to
 * display. Validators never return `null` or `undefined`, so callers can
 * render `errors[field]` directly and compute overall validity with
 * `Object.values(errors).every((e) => !e)`.
 */

// Pragmatic, robust email shape: one-or-more non-space/non-`@` characters, an
// `@`, a domain label, a literal dot, and a TLD. Kept module-private on
// purpose — it is an implementation detail of `validateEmail`.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validate the contact form "Name" field.
 *
 * @param {string} [value] Raw field value (may be `undefined`/`null`).
 * @returns {string} Error message to display, or '' when the value is valid.
 */
export function validateName(value) {
  const v = (value ?? '').trim()
  if (!v) return 'Please enter your name.'
  if (v.length < 2) return 'Name must be at least 2 characters.'
  return ''
}

/**
 * Validate the contact form "Email" field.
 *
 * @param {string} [value] Raw field value (may be `undefined`/`null`).
 * @returns {string} Error message to display, or '' when the value is valid.
 */
export function validateEmail(value) {
  const v = (value ?? '').trim()
  if (!v) return 'Please enter your email address.'
  if (!EMAIL_REGEX.test(v)) return 'Please enter a valid email address.'
  return ''
}

/**
 * Validate the contact form "Subject" field.
 *
 * @param {string} [value] Raw field value (may be `undefined`/`null`).
 * @returns {string} Error message to display, or '' when the value is valid.
 */
export function validateSubject(value) {
  const v = (value ?? '').trim()
  if (!v) return 'Please enter a subject.'
  if (v.length < 3) return 'Subject must be at least 3 characters.'
  return ''
}

/**
 * Validate the contact form "Message" field.
 *
 * @param {string} [value] Raw field value (may be `undefined`/`null`).
 * @returns {string} Error message to display, or '' when the value is valid.
 */
export function validateMessage(value) {
  const v = (value ?? '').trim()
  if (!v) return 'Please enter a message.'
  if (v.length < 10) return 'Message must be at least 10 characters.'
  return ''
}

/**
 * Validate every contact-form field in one pass.
 *
 * @param {{ name?: string, email?: string, subject?: string, message?: string }} values
 *   The current form values.
 * @returns {{ name: string, email: string, subject: string, message: string }}
 *   Per-field error messages. When every value is '', the whole form is valid.
 */
export function validateContactForm(values) {
  return {
    name: validateName(values.name),
    email: validateEmail(values.email),
    subject: validateSubject(values.subject),
    message: validateMessage(values.message),
  }
}
