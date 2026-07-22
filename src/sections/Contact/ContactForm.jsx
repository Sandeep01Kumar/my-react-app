import { useContactForm } from '@/hooks/useContactForm'
import { FIELD_MAX_LENGTHS } from '@/utils'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import styles from './ContactForm.module.css'

const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', placeholder: 'Your name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'you@example.com' },
  { name: 'subject', label: 'Subject', type: 'text', autoComplete: 'off', placeholder: 'How can I help?' },
]

function ContactForm() {
  const { values, errors, status, isValid, handleChange, handleBlur, handleSubmit } = useContactForm()
  const isSubmitting = status === 'submitting'

  return (
    <Card variant="glass" padding="lg" className={styles.card}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="contact-form-heading"
      >
        <h3 id="contact-form-heading" className={styles.formTitle}>
          Send a message
        </h3>

        {FIELDS.map((field) => {
          const hasError = Boolean(errors[field.name])
          const errorId = `contact-${field.name}-error`
          return (
            <div key={field.name} className={styles.field}>
              <label className={styles.label} htmlFor={`contact-${field.name}`}>
                {field.label}
              </label>
              <input
                className={hasError ? `${styles.input} ${styles.inputError}` : styles.input}
                id={`contact-${field.name}`}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                maxLength={FIELD_MAX_LENGTHS[field.name]}
                value={values[field.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={hasError || undefined}
                aria-describedby={hasError ? errorId : undefined}
              />
              {hasError && (
                <span className={styles.error} id={errorId} role="alert">
                  {errors[field.name]}
                </span>
              )}
            </div>
          )
        })}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-message">
            Message
          </label>
          <textarea
            className={errors.message ? `${styles.textarea} ${styles.inputError}` : styles.textarea}
            id="contact-message"
            name="message"
            rows={5}
            maxLength={FIELD_MAX_LENGTHS.message}
            placeholder="Tell me about your project..."
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.message) || undefined}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
          />
          {errors.message && (
            <span className={styles.error} id="contact-message-error" role="alert">
              {errors.message}
            </span>
          )}
        </div>

        {status === 'success' && (
          <p className={styles.success} role="status">
            Thanks for reaching out. Your message has been sent and I will reply soon.
          </p>
        )}
        {status === 'error' && (
          <p className={styles.errorBanner} role="alert">
            Please fix the highlighted fields and try again.
          </p>
        )}
        {status === 'submitError' && (
          <p className={styles.errorBanner} role="alert">
            Something went wrong sending your message. Please try again in a
            moment, or email me directly.
          </p>
        )}

        <Button
          className={styles.submit}
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
        >
          Send Message
        </Button>
      </form>
    </Card>
  )
}

export default ContactForm
