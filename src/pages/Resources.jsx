import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import PageCoords from '../components/PageCoords'

export default function Resources() {
  const sectionRef = useScrollReveal()

  return (
    <div ref={sectionRef}>
      {/* Page Header */}
      <div className="page-header" id="resources-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Resources</span>
          </div>
          <PageCoords
            segments={[
              { text: 'SEC.05' },
              { text: 'Resources' },
              { text: 'R&D' },
              { text: 'Consulting' },
              { text: 'Training', accent: true },
            ]}
          />
          <h1>Resources <em>&amp;</em> Services</h1>
          <p className="page-subtitle">
            The offer addressed to the economic environment — research, consulting, engineering, and training.
          </p>
        </div>
      </div>

      {/* Services */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-tag" data-index="01">Our Offer</div>
            <h2>Addressed to the <em>economic</em> environment</h2>
            <p>Comprehensive services spanning the full spectrum of dependable systems expertise.</p>
          </div>

          <div className="row g-4">
            {/* Research & Development */}
            <div className="col-lg-6 fade-in">
              <div className="service-card">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-md)',
                    background: 'rgba(232, 122, 30, 0.1)', color: 'var(--desy-orange)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', flexShrink: 0
                  }}>🔬</div>
                  <h3 style={{ margin: 0 }}>Research & Development</h3>
                </div>
                <ul>
                  <li>Abstractions definition, architectures design and tools implementation to achieve the development of highly dependable and secure CPSs</li>
                  <li>Expansion of artificial intelligence techniques in order to implement some modelling and control applications</li>
                  <li>Analysis, design, implementation and validation of dependable CPSs used in water resources management, electrical power generation and transport, cloud-fog-edge infrastructure</li>
                  <li>Analysis, design, implementation and validation of information systems applied in various fields</li>
                  <li>Application of artificial intelligence techniques in energy production, medicine, food quality control</li>
                </ul>
              </div>
            </div>

            {/* Consulting */}
            <div className="col-lg-6 fade-in" style={{ transitionDelay: '0.15s' }}>
              <div className="service-card">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-md)',
                    background: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent-teal)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', flexShrink: 0
                  }}>💼</div>
                  <h3 style={{ margin: 0 }}>Consulting</h3>
                </div>
                <ul>
                  <li>Consulting, research, design, development of dependable information systems and intelligent systems for industrial and scientific environment</li>
                </ul>
              </div>
            </div>

            {/* Applied Engineering Services */}
            <div className="col-lg-6 fade-in" style={{ transitionDelay: '0.1s' }}>
              <div className="service-card">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-md)',
                    background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', flexShrink: 0
                  }}>🛠️</div>
                  <h3 style={{ margin: 0 }}>Applied Engineering Services</h3>
                </div>
                <ul>
                  <li>Computer testing services</li>
                  <li>Programming and software and hardware consultancy services</li>
                  <li>Intelligent systems design and implementation services</li>
                </ul>
              </div>
            </div>

            {/* Training */}
            <div className="col-lg-6 fade-in" style={{ transitionDelay: '0.25s' }}>
              <div className="service-card">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-md)',
                    background: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-green)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem', flexShrink: 0
                  }}>🎓</div>
                  <h3 style={{ margin: 0 }}>Training</h3>
                </div>
                <ul>
                  <li><strong>Dependability basics:</strong> availability, reliability, safety, integrity and maintainability</li>
                  <li><strong>CPS basics:</strong> hardware and software architecture, physical devices development and programming, decision support, historical databases design and management, historical data pre- and post-processing</li>
                  <li><strong>Software testing techniques:</strong> functional testing, structural testing, use of software testing frameworks</li>
                  <li><strong>Artificial intelligence techniques:</strong> AI agents, multi-agent systems, machine learning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
