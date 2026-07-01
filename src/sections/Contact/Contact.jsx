import SectionTitle from '@/components/ui/SectionTitle'
import Container from '@/components/ui/Container'
import Reveal from '@/components/ui/Reveal'
import ContactForm from './ContactForm'
import ContactInfo from './ContactInfo'
import styles from './Contact.module.css'

function Contact() {
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-title">
      <Container>
        <Reveal>
          <SectionTitle
            id="contact-title"
            eyebrow="Contact"
            title="Get in touch"
            subtitle="Have a project in mind or a role to fill? Send a message and I will get back to you."
            align="center"
          />
        </Reveal>
        <div className={styles.grid}>
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal delay={0.1}>
            <ContactInfo />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

export default Contact
