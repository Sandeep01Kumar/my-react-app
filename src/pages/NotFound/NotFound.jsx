import { Link } from 'react-router'
import Container from '@/components/ui/Container'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import styles from './NotFound.module.css'

function NotFound() {
  return (
    <main className={styles.notFound}>
      <Container size="narrow" className={styles.inner}>
        {/* The large "404" is a decorative display number, not a heading: the
            Hero section owns the app's single <h1>, and this page's semantic
            heading is the <h2> rendered by SectionTitle below. */}
        <p className={styles.code}>404</p>
        <SectionTitle
          title="Page not found"
          subtitle="Sorry, the page you're looking for doesn't exist or may have been moved."
          align="center"
        />
        <Button as={Link} to="/" variant="primary" size="lg">
          Back to Home
        </Button>
      </Container>
    </main>
  )
}

export default NotFound
