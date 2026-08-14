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
import AdminPage from './components/AdminPage'
import { useHashRoute } from './hooks/useHashRoute'

export default function App() {
  const route = useHashRoute()

  if (route === 'quote') return <QuotePage />
  if (route === 'admin') return <AdminPage />

  return (
    <>
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
    </>
  )
}
