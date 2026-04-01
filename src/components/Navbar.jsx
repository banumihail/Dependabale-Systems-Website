import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import DesyLogo from './DesyLogo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={`navbar navbar-expand-lg desy-navbar ${scrolled ? 'scrolled' : ''}`} id="main-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={closeMenu}>
          <DesyLogo size={36} />
          <span>De<span className="brand-accent">Sy</span></span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-controls="navbarNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end onClick={closeMenu}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/team" onClick={closeMenu}>Team</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/publications" onClick={closeMenu}>Publications</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/projects" onClick={closeMenu}>Projects</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/resources" onClick={closeMenu}>Resources</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
