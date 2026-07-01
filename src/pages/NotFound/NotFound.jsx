import { Link } from 'react-router'
import Container from '@/components/ui/Container'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import styles from './NotFound.module.css'

function NotFound() {
  return (
    <main className={styles.notFound}>
      <Container size="narrow" className={styles.inner}>
        <h1 className={styles.code}>404</h1>
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
