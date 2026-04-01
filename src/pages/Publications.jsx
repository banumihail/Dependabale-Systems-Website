import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import pubData from '../data/publications.json'

const yearFilters = ['All', '2024', '2023', '2022', '2021', '2020', '2018']
const typeFilters = ['All', 'journal', 'conference']

export default function Publications() {
  const [yearFilter, setYearFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const sectionRef = useScrollReveal()

  const filteredPubs = useMemo(() => {
    let pubs = pubData.publications
    if (yearFilter !== 'All') {
      pubs = pubs.filter(p => p.year === parseInt(yearFilter))
    }
    if (typeFilter !== 'All') {
      pubs = pubs.filter(p => p.type === typeFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      pubs = pubs.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        (p.journal && p.journal.toLowerCase().includes(q))
      )
    }
    return pubs
  }, [yearFilter, typeFilter, searchQuery])

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
          <h1>Publications & Results</h1>
          <p className="page-subtitle">
            The most representative publications of the past 8 years across journals and conferences.
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

          {/* Filters */}
          <div className="row mb-4">
            <div className="col-md-8">
              <div className="d-flex flex-wrap gap-2 align-items-center fade-in">
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-500)', marginRight: '0.3rem' }}>
                  Year:
                </span>
                {yearFilters.map(y => (
                  <button
                    key={y}
                    className={`filter-btn ${yearFilter === y ? 'active' : ''}`}
                    onClick={() => setYearFilter(y)}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex flex-wrap gap-2 align-items-center justify-content-md-end fade-in" style={{ transitionDelay: '0.1s' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-500)', marginRight: '0.3rem' }}>
                  Type:
                </span>
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
            </div>
          </div>

          <p className="mb-3" style={{ color: 'var(--gray-400)', fontSize: '0.88rem' }}>
            Showing {filteredPubs.length} publication{filteredPubs.length !== 1 ? 's' : ''}
          </p>

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
                </div>
              </div>
            </div>
          ))}

          {filteredPubs.length === 0 && (
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
            <div className="section-tag">Intellectual Property</div>
            <h2>Patents</h2>
          </div>

          {pubData.patents.map(patent => (
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
