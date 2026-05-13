import { Link } from 'react-router-dom'
import logoDesy from '../assets/logo-desy.png'
import SyncStatus from './SyncStatus'

export default function Footer() {
  return (
    <footer className="desy-footer" id="site-footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-3 mb-3">
              <img src={logoDesy} alt="DeSy" className="footer-logo" />
              <span style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2 }}>
                Dependable<br />Systems
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>
              Research group at the Faculty of Automation and Computer Science,
              Technical University of Cluj-Napoca.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5>Navigation</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/team">Team</Link></li>
              <li><Link to="/teaching">Teaching</Link></li>
              <li><Link to="/publications">Publications</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/resources">Resources</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h5>Contact</h5>
            <ul className="footer-links">
              <li>📍 26-28 G. Bariţiu Str., 400027</li>
              <li style={{ paddingLeft: '1.5rem' }}>Cluj-Napoca, Romania</li>
              <li>📞 +40 264 401427</li>
              <li>📧 <a href="mailto:Liviu.Miclea@aut.utcluj.ro">Liviu.Miclea@aut.utcluj.ro</a></li>
            </ul>
          </div>

          {/* External */}
          <div className="col-lg-3 col-md-6">
            <h5>Affiliations</h5>
            <ul className="footer-links">
              <li>
                <a href="https://www.utcluj.ro" target="_blank" rel="noopener noreferrer">
                  Technical University of Cluj-Napoca
                </a>
              </li>
              <li>
                <a href="https://acs.utcluj.ro" target="_blank" rel="noopener noreferrer">
                  Faculty of Automation and Computer Science
                </a>
              </li>
              <li>
                <a href="http://desy.utcluj.ro" target="_blank" rel="noopener noreferrer">
                  DeSy Official Site
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-divider">
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Dependable Systems (DeSy) — UTCN. All rights reserved.</span>
            <SyncStatus />
            <span>
              {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
