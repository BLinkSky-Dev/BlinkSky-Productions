import { AnimatePresence, motion } from 'framer-motion'
import BrandIntro from './components/BrandIntro'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import InstagramFeed from './components/InstagramFeed'
import About from './components/About'
import Brands from './components/Brands'
import Reviews from './components/Reviews'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingCTA from './components/FloatingCTA'
import QuotePage from './components/QuotePage'
import { useHashRoute } from './hooks/useHashRoute'

const EASE = [0.22, 1, 0.36, 1]

export default function App() {
  const route = useHashRoute()

  return (
    <AnimatePresence mode="wait">
      {route === 'quote' ? (
        <motion.div
          key="quote"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="min-h-screen"
        >
          <QuotePage />
        </motion.div>
      ) : (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <BrandIntro />
          <Nav />
          <main>
            <Hero />
            <Services />
            <Portfolio />
            <InstagramFeed />
            <About />
            <Brands />
            <Reviews />
            <Contact />
          </main>
          <Footer />
          <FloatingCTA />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
