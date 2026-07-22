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

/**
 * Maximum accepted length (in characters) for each contact-form field.
 *
 * Single source of truth for the upper bounds enforced BOTH in the UI (as the
 * native `maxLength` attribute on each input/textarea in
 * `sections/Contact/ContactForm`) AND here in the validators, so an oversized
 * value can never pass validation and reach the (future) send path — a paste or
 * programmatic value that slips past the input attribute is still rejected,
 * flipping the form's derived `isValid` to `false` and blocking submit.
 *
 * Bounds are pragmatic: `email` uses the RFC 5321 maximum address length (254);
 * the rest are generous limits that comfortably fit legitimate input while
 * capping abusive payloads.
 */
export const FIELD_MAX_LENGTHS = Object.freeze({
  name: 100,
  email: 254,
  subject: 150,
  message: 2000,
})

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
  if (v.length > FIELD_MAX_LENGTHS.name)
    return `Name must be at most ${FIELD_MAX_LENGTHS.name} characters.`
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
  if (v.length > FIELD_MAX_LENGTHS.email)
    return `Email must be at most ${FIELD_MAX_LENGTHS.email} characters.`
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
  if (v.length > FIELD_MAX_LENGTHS.subject)
    return `Subject must be at most ${FIELD_MAX_LENGTHS.subject} characters.`
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
  if (v.length > FIELD_MAX_LENGTHS.message)
    return `Message must be at most ${FIELD_MAX_LENGTHS.message} characters.`
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
