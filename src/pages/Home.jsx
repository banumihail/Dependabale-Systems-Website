import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Home() {
  const sectionRef = useScrollReveal()

  return (
    <div ref={sectionRef}>
      {/* Hero Section */}
      <section className="hero-section" id="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="hero-content">
                <div className="hero-badge">
                  🏛️ Technical University of Cluj-Napoca
                </div>
                <h1>
                  <span className="highlight">Dependable</span> Systems
                </h1>
                <p className="subtitle">
                  Research group advancing dependability, security, cyber-physical systems,
                  and intelligent systems at the Faculty of Automation and Computer Science.
                </p>

                <div className="d-flex gap-3 flex-wrap">
                  <Link to="/team" className="btn btn-lg" style={{
                    background: 'linear-gradient(135deg, #E87A1E, #F5A623)',
                    color: '#fff',
                    fontWeight: 600,
                    borderRadius: '10px',
                    padding: '0.7rem 1.8rem',
                    fontSize: '0.95rem',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(232,122,30,0.3)'
                  }}>
                    Meet the Team →
                  </Link>
                  <Link to="/publications" className="btn btn-lg" style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontWeight: 500,
                    borderRadius: '10px',
                    padding: '0.7rem 1.8rem',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    View Publications
                  </Link>
                </div>

                <div className="hero-stats">
                  <div className="hero-stat">
                    <div className="stat-number">26+</div>
                    <div className="stat-label">Researchers</div>
                  </div>
                  <div className="hero-stat">
                    <div className="stat-number">25+</div>
                    <div className="stat-label">Publications</div>
                  </div>
                  <div className="hero-stat">
                    <div className="stat-number">10+</div>
                    <div className="stat-label">Projects</div>
                  </div>
                  <div className="hero-stat">
                    <div className="stat-number">10+</div>
                    <div className="stat-label">Years</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="section section-alt" id="contact-details">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-6 fade-in">
              <div className="section-header">
                <div className="section-tag">Contact Details</div>
                <h2>Get in Touch</h2>
              </div>

              <div className="desy-card">
                <table className="contact-table">
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <td>Dependable Systems</td>
                    </tr>
                    <tr>
                      <th>Acronym</th>
                      <td><strong>DeSy</strong></td>
                    </tr>
                    <tr>
                      <th>Site</th>
                      <td><a href="http://desy.utcluj.ro" target="_blank" rel="noopener noreferrer">http://desy.utcluj.ro</a></td>
                    </tr>
                    <tr>
                      <th>Address</th>
                      <td>26-28 G. Bariţiu Str., 400027, Cluj-Napoca, Romania</td>
                    </tr>
                    <tr>
                      <th>Faculty</th>
                      <td>Faculty of Automation and Computer Science</td>
                    </tr>
                    <tr>
                      <th>Department</th>
                      <td>Automation Department</td>
                    </tr>
                    <tr>
                      <th>Telephone</th>
                      <td>+40 264 401427</td>
                    </tr>
                    <tr>
                      <th>Fax</th>
                      <td>+40 264 594835</td>
                    </tr>
                    <tr>
                      <th>Director</th>
                      <td>Prof. Eng. Liviu Miclea, PhD</td>
                    </tr>
                    <tr>
                      <th>E-mail</th>
                      <td><a href="mailto:Liviu.Miclea@aut.utcluj.ro">Liviu.Miclea@aut.utcluj.ro</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-lg-6 fade-in" style={{ transitionDelay: '0.2s' }}>
              <div className="section-header">
                <div className="section-tag">Infrastructure</div>
                <h2>Architecture & Equipment</h2>
              </div>
              <div className="desy-card" style={{ textAlign: 'center', padding: '2rem' }}>
                <h4 style={{ color: 'var(--desy-orange)', marginBottom: '1.5rem', fontSize: '1rem' }}>
                  Overall Cloud-Fog-Edge Architecture
                </h4>
                <div style={{
                  background: 'linear-gradient(135deg, var(--gray-50), var(--gray-100))',
                  borderRadius: 'var(--radius-md)',
                  padding: '2rem',
                  border: '1px solid var(--gray-200)'
                }}>
                  {/* Architecture diagram representation */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                      background: 'var(--desy-navy)',
                      color: '#fff',
                      padding: '0.6rem 2rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      width: '80%'
                    }}>
                      ☁️ CORE — Cloud Layer
                    </div>
                    <div style={{ color: 'var(--gray-400)', fontSize: '1.2rem' }}>↕</div>
                    <div style={{
                      background: 'var(--desy-orange)',
                      color: '#fff',
                      padding: '0.6rem 2rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      width: '80%'
                    }}>
                      🌫️ CPS Top Layer — Fog
                    </div>
                    <div style={{ color: 'var(--gray-400)', fontSize: '1.2rem' }}>↕</div>
                    <div style={{
                      background: 'var(--accent-teal)',
                      color: '#fff',
                      padding: '0.6rem 2rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      width: '80%'
                    }}>
                      🖥️ CPS Middle Layer — Web & Agents
                    </div>
                    <div style={{ color: 'var(--gray-400)', fontSize: '1.2rem' }}>↕</div>
                    <div style={{
                      background: 'var(--accent-blue)',
                      color: '#fff',
                      padding: '0.6rem 2rem',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      width: '80%'
                    }}>
                      ⚡ CPS Bottom Layer — Edge Devices
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.83rem', color: 'var(--gray-400)', marginTop: '1rem' }}>
                  Block schemas and equipment elaborated/in use by the DESY group, over time
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Expertise */}
      <section className="section" id="expertise">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-tag">Areas of Expertise</div>
            <h2>Research Focus</h2>
            <p>Our three core research domains driving innovation and academic excellence.</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 fade-in">
              <div className="desy-card">
                <div className="card-icon orange">🔒</div>
                <h3>Dependability & Security</h3>
                <p>
                  Development of intelligent techniques for dependability (availability, reliability, safety,
                  security, integrity and maintainability), security (confidentiality) and testing of information
                  systems. Analysis, design, implementation and testing of information systems with dependability
                  properties used in various fields (e.g. critical infrastructure — energy, water, environment,
                  transport, medicine).
                </p>
              </div>
            </div>

            <div className="col-lg-4 fade-in" style={{ transitionDelay: '0.15s' }}>
              <div className="desy-card">
                <div className="card-icon teal">⚙️</div>
                <h3>Cyber–Physical Systems (CPSs)</h3>
                <p>
                  Development of abstractions, models, architectures and tools to allow implementation
                  of reliable CPSs (including areas as cloud-fog-edge architectures) made from unsafe
                  components and resistant CPSs at cyber or physical attacks. Development of the semantic
                  basics for heterogeneous models' composition and for modelling languages that describe
                  various physical processes of a CPS and their associated logic.
                </p>
              </div>
            </div>

            <div className="col-lg-4 fade-in" style={{ transitionDelay: '0.3s' }}>
              <div className="desy-card">
                <div className="card-icon blue">🧠</div>
                <h3>Intelligent Systems</h3>
                <p>
                  Analyses, design, implementation and testing of intelligent real-time control and
                  monitoring systems using artificial intelligence techniques (intelligent agents,
                  fuzzy logic, machine learning, decision support systems, deep neural networks).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="section section-alt" id="quick-links">
        <div className="container">
          <div className="section-header text-center fade-in">
            <div className="section-tag" style={{ justifyContent: 'center' }}>Explore</div>
            <h2>Discover Our Work</h2>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-md-4 fade-in">
              <Link to="/team" style={{ textDecoration: 'none' }}>
                <div className="desy-card text-center" style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
                  <h3>Our Team</h3>
                  <p>26+ researchers including professors, lecturers, and PhD students.</p>
                </div>
              </Link>
            </div>

            <div className="col-md-4 fade-in" style={{ transitionDelay: '0.15s' }}>
              <Link to="/projects" style={{ textDecoration: 'none' }}>
                <div className="desy-card text-center" style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
                  <h3>Projects</h3>
                  <p>10+ representative projects over the last decade, funded by EU and national programs.</p>
                </div>
              </Link>
            </div>

            <div className="col-md-4 fade-in" style={{ transitionDelay: '0.3s' }}>
              <Link to="/resources" style={{ textDecoration: 'none' }}>
                <div className="desy-card text-center" style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎓</div>
                  <h3>Resources & Services</h3>
                  <p>R&D, consulting, engineering services, and training programs for industry and academia.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
