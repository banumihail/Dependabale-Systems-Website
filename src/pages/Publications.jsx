import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import { fetchPublications, fetchPatents } from '../services/api'

const typeFilters = ['All', 'journal', 'conference']

export default function Publications() {
  const [yearFilter, setYearFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [publications, setPublications] = useState([])
  const [allPublications, setAllPublications] = useState([])
  const [patents, setPatents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const sectionRef = useScrollReveal()

  // First load: fetch every publication once so the histogram has the full distribution
  // independent of the active filter.
  useEffect(() => {
    let cancelled = false
    fetchPublications({ limit: 1000 })
      .then((data) => {
        if (cancelled) return
        setAllPublications(data.items || [])
      })
      .catch(() => { /* histogram falls back to filtered data below */ })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetchPublications({ year: yearFilter, type: typeFilter, limit: 500 }),
      fetchPatents(),
    ])
      .then(([pubData, patData]) => {
        if (cancelled) return
        setPublications(pubData.items || [])
        setPatents(patData || [])
        setError(null)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [yearFilter, typeFilter])

  // Year histogram — counts per year, ascending. Falls back to the filtered set
  // until the full all-publications fetch resolves.
  const yearBars = useMemo(() => {
    const source = allPublications.length ? allPublications : publications
    const counts = new Map()
    for (const p of source) {
      if (!p.year) continue
      counts.set(p.year, (counts.get(p.year) || 0) + 1)
    }
    const years = Array.from(counts.keys()).sort((a, b) => a - b)
    const max = years.length ? Math.max(...years.map((y) => counts.get(y))) : 1
    return years.map((y) => ({
      year: y,
      count: counts.get(y),
      pct: counts.get(y) / max,
    }))
  }, [allPublications, publications])

  const totalForHistogram = allPublications.length || publications.length

  const filteredPubs = useMemo(() => {
    if (!searchQuery.trim()) return publications
    const q = searchQuery.toLowerCase()
    return publications.filter((p) =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.authors || '').toLowerCase().includes(q) ||
      (p.journal || '').toLowerCase().includes(q),
    )
  }, [publications, searchQuery])

  return (
    <div ref={sectionRef}>
      {/* Page Header */}
      <div className="page-header" id="publications-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Publications</span>
          </div>
          <h1>Publications <em>&amp;</em> Results</h1>
          <p className="page-subtitle">
            Automatically synchronized from OpenAlex — authored or co-authored by DeSy group members.
          </p>
        </div>
      </div>

      {/* Publications List */}
      <section className="section" id="publications-list">
        <div className="container">
          {/* Search */}
          <div className="search-box fade-in">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by title, author, or journal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="publication-search"
            />
          </div>

          {/* Year histogram filter */}
          {yearBars.length > 0 && (
            <div className="pub-histogram fade-in">
              <div className="pub-histogram__header">
                <span className="pub-histogram__label">Distribution by year</span>
                <button
                  type="button"
                  className={`pub-histogram__all ${yearFilter === 'All' ? 'is-active' : ''}`}
                  onClick={() => setYearFilter('All')}
                >
                  All years
                  <span className="pub-histogram__all-count">{totalForHistogram}</span>
                </button>
              </div>
              <div
                className="pub-histogram__bars"
                role="group"
                aria-label="Filter publications by year"
              >
                {yearBars.map(({ year, count, pct }, idx) => {
                  const isActive = String(yearFilter) === String(year)
                  return (
                    <button
                      key={year}
                      type="button"
                      className={`pub-bar ${isActive ? 'is-active' : ''}`}
                      onClick={() => setYearFilter(isActive ? 'All' : String(year))}
                      style={{ '--bar-delay': `${idx * 0.04}s` }}
                      aria-label={`${count} publication${count !== 1 ? 's' : ''} in ${year}`}
                      aria-pressed={isActive}
                    >
                      <span className="pub-bar__column">
                        <span className="pub-bar__count">{count}</span>
                        <span className="pub-bar__fill" style={{ height: `${pct * 100}%` }} />
                      </span>
                      <span className="pub-bar__year">{year}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Type filter */}
          <div className="d-flex flex-wrap gap-2 align-items-center fade-in mb-4" style={{ transitionDelay: '0.05s' }}>
            <span className="filter-label">Type</span>
            {typeFilters.map(t => (
              <button
                key={t}
                className={`filter-btn ${typeFilter === t ? 'active' : ''}`}
                onClick={() => setTypeFilter(t)}
              >
                {t === 'All' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {error && (
            <div className="alert alert-warning" role="alert" style={{ borderRadius: '0.5rem' }}>
              Could not load publications: {error}. Showing nothing — make sure the backend is running on port 3001.
            </div>
          )}

          {loading ? (
            <p className="mb-3" style={{ color: 'var(--gray-400)', fontSize: '0.88rem' }}>Loading publications…</p>
          ) : (
            <p className="mb-3" style={{ color: 'var(--gray-400)', fontSize: '0.88rem' }}>
              Showing {filteredPubs.length} publication{filteredPubs.length !== 1 ? 's' : ''}
            </p>
          )}

          {/* Publication Items */}
          {filteredPubs.map((pub, idx) => (
            <div className="pub-item fade-in" key={pub.id}
              style={{ transitionDelay: `${Math.min(idx * 0.05, 0.5)}s` }}>
              <span className="pub-year">{pub.year}</span>
              <div className="pub-content">
                <div className="pub-title">
                  {pub.link ? (
                    <a href={pub.link} target="_blank" rel="noopener noreferrer">
                      {pub.title}
                    </a>
                  ) : (
                    pub.title
                  )}
                </div>
                <div className="pub-authors">{pub.authors}</div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="pub-journal">
                    {pub.journal}
                    {pub.volume && `, Vol. ${pub.volume}`}
                    {pub.issue && `(${pub.issue})`}
                    {pub.pages && `, pp. ${pub.pages}`}
                  </span>
                  <span className={`pub-type-badge ${pub.type}`}>
                    {pub.type}
                  </span>
                  {pub.citation_count > 0 && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
                      · {pub.citation_count} citation{pub.citation_count !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {!loading && filteredPubs.length === 0 && !error && (
            <div className="text-center py-5" style={{ color: 'var(--gray-400)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
              <p>No publications found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Patents Section */}
      <section className="section section-alt" id="patents">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-tag" data-index="—">Intellectual Property</div>
            <h2><em>Patents</em></h2>
          </div>

          {patents.map(patent => (
            <div className="pub-item fade-in" key={patent.id}>
              <span className="pub-year" style={{ background: 'var(--desy-orange)' }}>Patent</span>
              <div className="pub-content">
                <div className="pub-title">{patent.title}</div>
                <div className="pub-authors">{patent.authors}</div>
                <div className="pub-journal">{patent.reference}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
