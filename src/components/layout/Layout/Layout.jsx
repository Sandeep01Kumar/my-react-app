import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import styles from './Layout.module.css'

function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main id="main" className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
