import Layout from '@/components/layout/Layout'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Skills from '@/sections/Skills'
import Projects from '@/sections/Projects'
import Experience from '@/sections/Experience'
import Services from '@/sections/Services'
import Resume from '@/sections/Resume'
import Contact from '@/sections/Contact'

function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Services />
      <Resume />
      <Contact />
    </Layout>
  )
}

export default Home
