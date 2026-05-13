import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import HeroMark from '../components/HeroMark'
import CountUp from '../components/CountUp'

export default function Home() {
  const sectionRef = useScrollReveal()

  return (
    <div ref={sectionRef}>
      {/* Hero Section */}
      <section className="hero-section" id="hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="hero-content">
                <div className="hero-coords">
                  <span>RG&#8209;001</span>
                  <span className="dot" />
                  <span>Cluj&#8209;Napoca</span>
                  <span className="dot" />
                  <span>UTCN&nbsp;/&nbsp;ACS</span>
                  <span className="dot" />
                  <span className="accent">Est. 2014</span>
                </div>
                <h1>
                  <span className="accent">Dependable</span> Systems
                </h1>
                <p className="subtitle">
                  A research group advancing dependability, security, cyber‑physical systems
                  and intelligent systems at the Faculty of Automation and Computer Science.
                </p>

                <div className="hero-cta">
                  <Link to="/team" className="hero-btn hero-btn--primary">
                    Meet the team
                    <span className="hero-btn__arrow" aria-hidden="true">→</span>
                  </Link>
                  <Link to="/publications" className="hero-btn hero-btn--ghost">
                    View publications
                  </Link>
                </div>

                <div className="hero-stats">
                  <div className="hero-stat">
                    <div className="stat-number"><CountUp end={26} /><span className="plus">+</span></div>
                    <div className="stat-label">Researchers</div>
                  </div>
                  <div className="hero-stat">
                    <div className="stat-number"><CountUp end={25} /><span className="plus">+</span></div>
                    <div className="stat-label">Publications</div>
                  </div>
                  <div className="hero-stat">
                    <div className="stat-number"><CountUp end={10} /><span className="plus">+</span></div>
                    <div className="stat-label">Projects</div>
                  </div>
                  <div className="hero-stat">
                    <div className="stat-number"><CountUp end={10} /><span className="plus">+</span></div>
                    <div className="stat-label">Years</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-block">
              <div className="hero-mark-wrap">
                <HeroMark />
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
                <div className="section-tag" data-index="01">Contact Details</div>
                <h2>Get in <em>touch</em></h2>
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
                <div className="section-tag" data-index="02">Infrastructure</div>
                <h2>Architecture <em>&amp;</em> Equipment</h2>
              </div>
              <div className="schematic-card">
                <div className="schematic-card__caption">
                  <span className="schematic-card__caption-num">Fig. 01</span>
                  <span className="schematic-card__caption-text">Cloud–Fog–Edge architecture</span>
                </div>

                <div className="schematic">
                  <div className="schematic-row" data-label="L4">
                    <span className="schematic-row__tag">Core</span>
                    <span className="schematic-row__name">Cloud Layer</span>
                  </div>
                  <div className="schematic-row" data-label="L3" data-accent="orange">
                    <span className="schematic-row__tag">CPS · Top</span>
                    <span className="schematic-row__name">Fog</span>
                  </div>
                  <div className="schematic-row" data-label="L2" data-accent="teal">
                    <span className="schematic-row__tag">CPS · Middle</span>
                    <span className="schematic-row__name">Web &amp; Agents</span>
                  </div>
                  <div className="schematic-row" data-label="L1" data-accent="blue">
                    <span className="schematic-row__tag">CPS · Bottom</span>
                    <span className="schematic-row__name">Edge Devices</span>
                  </div>
                </div>

                <p className="schematic-card__footnote">
                  Block schemas and equipment elaborated &amp; in use by the DeSy group, over time.
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
            <div className="section-tag" data-index="03">Areas of Expertise</div>
            <h2>Research <em>focus</em></h2>
            <p>Three core domains driving the group's work — from foundations of dependability to applied intelligent systems.</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 fade-in">
              <div className="desy-card with-marks">
                <span className="card-index">/01</span>
                <div className="card-icon orange">🔒</div>
                <h3>Dependability <em>&amp;</em> Security</h3>
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
              <div className="desy-card with-marks">
                <span className="card-index">/02</span>
                <div className="card-icon teal">⚙️</div>
                <h3>Cyber‑<em>Physical</em> Systems</h3>
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
              <div className="desy-card with-marks">
                <span className="card-index">/03</span>
                <div className="card-icon blue">🧠</div>
                <h3><em>Intelligent</em> Systems</h3>
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
            <div className="section-tag" data-index="04" style={{ justifyContent: 'center' }}>Explore</div>
            <h2>Discover our <em>work</em></h2>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-md-4 col-lg-3 fade-in">
              <Link to="/team" style={{ textDecoration: 'none' }}>
                <div className="desy-card with-marks text-center" style={{ cursor: 'pointer' }}>
                  <span className="card-index">/Team</span>
                  <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>👥</div>
                  <h3>Our <em>Team</em></h3>
                  <p>26+ researchers including professors, lecturers, and PhD students.</p>
                </div>
              </Link>
            </div>

            <div className="col-md-4 col-lg-3 fade-in" style={{ transitionDelay: '0.1s' }}>
              <Link to="/teaching" style={{ textDecoration: 'none' }}>
                <div className="desy-card with-marks text-center" style={{ cursor: 'pointer' }}>
                  <span className="card-index">/Teaching</span>
                  <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>📚</div>
                  <h3><em>Teaching</em></h3>
                  <p>Courses delivered by our professors at the Automation Department.</p>
                </div>
              </Link>
            </div>

            <div className="col-md-4 col-lg-3 fade-in" style={{ transitionDelay: '0.2s' }}>
              <Link to="/projects" style={{ textDecoration: 'none' }}>
                <div className="desy-card with-marks text-center" style={{ cursor: 'pointer' }}>
                  <span className="card-index">/Projects</span>
                  <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🚀</div>
                  <h3><em>Projects</em></h3>
                  <p>10+ representative projects over the last decade, funded by EU and national programs.</p>
                </div>
              </Link>
            </div>

            <div className="col-md-4 col-lg-3 fade-in" style={{ transitionDelay: '0.3s' }}>
              <Link to="/resources" style={{ textDecoration: 'none' }}>
                <div className="desy-card with-marks text-center" style={{ cursor: 'pointer' }}>
                  <span className="card-index">/Resources</span>
                  <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🎓</div>
                  <h3>Resources <em>&amp;</em> Services</h3>
                  <p>R&amp;D, consulting, engineering services, and training programs for industry and academia.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
