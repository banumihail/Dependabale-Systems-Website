import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import PageCoords from '../components/PageCoords'
import { fetchMembers } from '../services/api'

const categories = [
  { key: 'all', label: 'All Members' },
  { key: 'professor', label: 'Professors' },
  { key: 'associate', label: 'Assoc. Professors' },
  { key: 'lecturer', label: 'Lecturers' },
  { key: 'assistant', label: 'Assistants' },
  { key: 'phd', label: 'PhD Students' },
]

function getInitials(name) {
  const parts = name.replace(/Prof\.|Eng\.|Assoc\.|PhD|Lecturer|Assist\./g, '').trim().split(' ')
  const caps = parts.filter(p => p.length > 1 && p[0] === p[0].toUpperCase())
  if (caps.length >= 2) {
    return caps[0][0] + caps[caps.length - 1][0]
  }
  return caps.length > 0 ? caps[0][0] : '?'
}

export default function Team() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [teamData, setTeamData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const sectionRef = useScrollReveal()

  useEffect(() => {
    let cancelled = false
    fetchMembers()
      .then((data) => {
        if (cancelled) return
        setTeamData(data || [])
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filteredTeam = useMemo(() => {
    if (activeFilter === 'all') return teamData
    return teamData.filter(m => m.category === activeFilter)
  }, [teamData, activeFilter])

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
          <PageCoords
            segments={[
              { text: 'SEC.01' },
              { text: 'Team' },
              { text: `${teamData.length || 26} Members` },
              { text: 'Live', accent: true },
            ]}
          />
          <h1>Our <em>team</em></h1>
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

          {error && (
            <div className="alert alert-warning" role="alert" style={{ borderRadius: '0.5rem' }}>
              Could not load team: {error}. Make sure the backend is running on port 3001.
            </div>
          )}

          {loading ? (
            <p className="mb-4" style={{ color: 'var(--gray-400)', fontSize: '0.88rem' }}>Loading team…</p>
          ) : (
            <p className="mb-4" style={{ color: 'var(--gray-400)', fontSize: '0.88rem' }}>
              Showing {filteredTeam.length} member{filteredTeam.length !== 1 ? 's' : ''}
            </p>
          )}

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
