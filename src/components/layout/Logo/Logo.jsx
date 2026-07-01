import { siteMeta } from '@/data'
import styles from './Logo.module.css'

function Logo({ as: Component = 'span', showName = true, className = '', ...rest }) {
  const classes = [styles.logo, className].filter(Boolean).join(' ')
  const ariaLabel = showName ? undefined : siteMeta.name

  return (
    <Component className={classes} aria-label={ariaLabel} {...rest}>
      <span className={styles.mark} aria-hidden="true">
        {siteMeta.initials}
      </span>
      {showName && <span className={styles.name}>{siteMeta.name}</span>}
    </Component>
  )
}

export default Logo
