import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import styles from './Certifications.module.css'

/**
 * CertificationCard — co-located card subcomponent for the Certifications
 * section.
 * --------------------------------------------------------------------------
 * Presents a single professional certification: the issuing organization's
 * logo, the credential name, the issuing organization (as a soft Badge), the
 * issue date, and an outline "View credential" button that opens the credential
 * URL safely in a new tab. Purely presentational: it owns no state and uses no
 * hooks — the parent (Certifications) supplies the data — mirroring the
 * ServiceCard/ProjectCard colocated convention.
 *
 * Composition follows the "always reuse primitives" rule (AAP §0.7.1): the
 * surface is the shared Card primitive, the organization tag is a Badge chip,
 * and the action is a Button rendered as an external <a>. Inner layout and
 * typography come from ./Certifications.module.css (the single module shared
 * with the section), whose values all resolve to the design tokens in
 * src/styles/variables.css.
 *
 * @param {object} props
 * @param {{ name: string, org: string, date: string, credentialUrl: string,
 *   logo: string }} props.cert A single certification record from `@/data`
 *   `certifications`. `cert.logo` is an already-resolved/imported asset URL and
 *   is rendered directly (no asset import happens here); `cert.credentialUrl`
 *   is a placeholder verification link (real value is a post-merge manual step).
 * @returns {import('react').ReactElement} The rendered certification card.
 */
function CertificationCard({ cert }) {
  return (
    <Card variant="glass" hover padding="lg" className={styles.card}>
      <img
        className={styles.logo}
        src={cert.logo}
        alt={`${cert.org} logo`}
        width="64"
        height="64"
        loading="lazy"
        decoding="async"
      />
      <h3 className={styles.name}>{cert.name}</h3>
      <Badge variant="soft">{cert.org}</Badge>
      <p className={styles.date}>{cert.date}</p>
      <Button
        as="a"
        href={cert.credentialUrl}
        target="_blank"
        rel="noopener noreferrer"
        variant="outline"
        size="sm"
        className={styles.action}
      >
        View credential
      </Button>
    </Card>
  )
}

export default CertificationCard
