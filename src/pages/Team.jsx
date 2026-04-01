import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import teamData from '../data/team.json'

const categories = [
  { key: 'all', label: 'All Members' },
  { key: 'professor', label: 'Professors' },
  { key: 'associate', label: 'Assoc. Professors' },
  { key: 'lecturer', label: 'Lecturers' },
  { key: 'assistant', label: 'Assistants' },
  { key: 'phd', label: 'PhD Students' },
]

function getInitials(name) {
  // Extract initials from the person's last name (capitalized word)
  const parts = name.replace(/Prof\.|Eng\.|Assoc\.|PhD|Lecturer|Assist\./g, '').trim().split(' ')
  const caps = parts.filter(p => p.length > 1 && p[0] === p[0].toUpperCase())
  if (caps.length >= 2) {
    return caps[0][0] + caps[caps.length - 1][0]
  }
  return caps.length > 0 ? caps[0][0] : '?'
}

export default function Team() {
  const [activeFilter, setActiveFilter] = useState('all')
  const sectionRef = useScrollReveal()

  const filteredTeam = useMemo(() => {
    if (activeFilter === 'all') return teamData
    return teamData.filter(m => m.category === activeFilter)
  }, [activeFilter])

  return (
    <div ref={sectionRef}>
      {/* Page Header */}
      <div className="page-header" id="team-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Team</span>
          </div>
          <h1>Our Team</h1>
          <p className="page-subtitle">
            Meet the researchers driving innovation in dependable systems, cyber-physical systems, and intelligent systems.
          </p>
        </div>
      </div>

      {/* Team Grid */}
      <section className="section" id="team-grid">
        <div className="container">
          {/* Filter Bar */}
          <div className="filter-bar fade-in">
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`filter-btn ${activeFilter === cat.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <p className="mb-4" style={{
            color: 'var(--gray-400)',
            fontSize: '0.88rem'
          }}>
            Showing {filteredTeam.length} member{filteredTeam.length !== 1 ? 's' : ''}
          </p>

          {/* Cards */}
          <div className="row g-4">
            {filteredTeam.map((member, idx) => (
              <div className="col-xl-3 col-lg-4 col-md-6 fade-in" key={member.id}
                style={{ transitionDelay: `${Math.min(idx * 0.05, 0.5)}s` }}>
                <a
                  href={member.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="team-card">
                    <div className={`team-avatar ${member.category}`}>
                      {getInitials(member.name)}
                    </div>
                    <h4>{member.name}</h4>
                    <div className="team-role">{member.role}</div>
                    {member.link && member.link !== '#' && (
                      <div className="team-link">
                        View Profile →
                      </div>
                    )}
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
