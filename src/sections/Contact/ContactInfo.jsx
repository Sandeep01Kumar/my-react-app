import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa'
import { siteMeta, socials } from '@/data'
import Card from '@/components/ui/Card'
import SocialLinks from '@/components/ui/SocialLinks'
import styles from './ContactInfo.module.css'

const telHref = `tel:${siteMeta.phone.replace(/[^+\d]/g, '')}`

const DETAILS = [
  { key: 'email', icon: FaEnvelope, label: 'Email', value: siteMeta.email, href: `mailto:${siteMeta.email}` },
  { key: 'phone', icon: FaPhone, label: 'Phone', value: siteMeta.phone, href: telHref },
  { key: 'location', icon: FaMapMarkerAlt, label: 'Location', value: siteMeta.location, href: null },
  { key: 'availability', icon: FaClock, label: 'Availability', value: siteMeta.availability, href: null },
]

function ContactInfo() {
  return (
    <div className={styles.info}>
      <Card variant="solid" padding="lg" className={styles.card}>
        <h3 className={styles.heading}>Contact details</h3>
        <ul className={styles.list}>
          {DETAILS.map((detail) => {
            const Icon = detail.icon
            return (
              <li key={detail.key} className={styles.item}>
                <span className={styles.icon} aria-hidden="true">
                  <Icon />
                </span>
                <span className={styles.itemBody}>
                  <span className={styles.itemLabel}>{detail.label}</span>
                  {detail.href ? (
                    <a className={styles.itemValue} href={detail.href}>
                      {detail.value}
                    </a>
                  ) : (
                    <span className={styles.itemValue}>{detail.value}</span>
                  )}
                </span>
              </li>
            )
          })}
        </ul>
        <SocialLinks className={styles.socials} items={socials} />
      </Card>
      <iframe
        className={styles.map}
        title="Map showing San Francisco, CA"
        src="https://maps.google.com/maps?q=San%20Francisco%2C%20CA&z=13&output=embed"
        loading="lazy"
      />
    </div>
  )
}

export default ContactInfo
