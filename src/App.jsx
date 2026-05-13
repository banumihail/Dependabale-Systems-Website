import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ScrollProgress from './components/ScrollProgress'
import Home from './pages/Home'
import Team from './pages/Team'
import Teaching from './pages/Teaching'
import Publications from './pages/Publications'
import Projects from './pages/Projects'
import Resources from './pages/Resources'

function App() {
  const location = useLocation()

  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <main key={location.pathname} className="page-transition">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/teaching" element={<Teaching />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
