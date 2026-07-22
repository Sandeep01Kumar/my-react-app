/**
 * certifications — professional certifications for the Certifications section.
 *
 * Consumed by `sections/Certifications` and its `CertificationCard`
 * subcomponent, which render each entry on the shared glass `Card` surface with
 * the issuing organization as a `Badge`, the issue `date`, the `logo` image, and
 * an outline `Button` ("View credential") linking to `credentialUrl` via
 * `as="a"` with `target="_blank"` / `rel="noopener"`.
 *
 * The `logo` images are imported here (not in the component) so all content
 * stays fully externalized; Vite resolves each
 * `@/assets/images/certifications/*.svg` import to a URL string at build time.
 * The ISTQB and Meta entries stay consistent with the matching `Certification`
 * items in `data/experience.js`.
 *
 * NOTE: `credentialUrl` and `logo` are PLACEHOLDERS pending real, user-supplied
 * content — replacing the credential verification links and swapping the SVG
 * placeholders for real badge artwork is a post-merge manual step (AAP §0.7.2).
 *
 * @typedef {Object} Certification
 * @property {string} name          Credential name.
 * @property {string} org           Issuing organization.
 * @property {string} date          Human-readable issue date (e.g. '2023').
 * @property {string} credentialUrl Verification/credential URL (placeholder).
 * @property {string} logo          Imported logo asset URL (placeholder).
 *
 * @type {Certification[]}
 */
import istqbLogo from '@/assets/images/certifications/istqb.svg'
import metaLogo from '@/assets/images/certifications/meta-frontend.svg'
import awsLogo from '@/assets/images/certifications/aws-cloud-practitioner.svg'

export const certifications = [
  {
    name: 'ISTQB Certified Tester — Foundation Level',
    org: 'ISTQB',
    date: '2023',
    credentialUrl: 'https://www.credly.com/badges/istqb-ctfl-placeholder',
    logo: istqbLogo,
  },
  {
    name: 'Meta Front-End Developer',
    org: 'Coursera',
    date: '2024',
    credentialUrl: 'https://coursera.org/verify/professional-cert/META-FE-PLACEHOLDER',
    logo: metaLogo,
  },
  {
    name: 'AWS Certified Cloud Practitioner',
    org: 'Amazon Web Services',
    date: '2024',
    credentialUrl: 'https://www.credly.com/badges/aws-ccp-placeholder',
    logo: awsLogo,
  },
]
