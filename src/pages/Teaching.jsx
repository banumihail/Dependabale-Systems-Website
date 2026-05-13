import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import teachingData from '../data/teaching.json'

export default function Teaching() {
  const sectionRef = useScrollReveal()

  const totalCourses = teachingData.reduce((sum, e) => sum + e.courses.length, 0)

  return (
    <div ref={sectionRef}>
      {/* Page Header */}
      <div className="page-header" id="teaching-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Teaching</span>
          </div>
          <h1>What we <em>teach</em></h1>
          <p className="page-subtitle">
            Courses delivered by our professors across the Automation Department —
            spanning dependability, cyber‑physical systems, software testing, and intelligent systems.
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <section className="section" id="teaching-content">
        <div className="container">
          <div className="teaching-stats fade-in">
            <div className="teaching-stat">
              <div className="teaching-stat__num">{teachingData.length}</div>
              <div className="teaching-stat__label">Professors</div>
            </div>
            <div className="teaching-stat">
              <div className="teaching-stat__num">{totalCourses}</div>
              <div className="teaching-stat__label">Courses</div>
            </div>
            <div className="teaching-stat">
              <div className="teaching-stat__num">BSc · MSc</div>
              <div className="teaching-stat__label">Levels</div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="row g-4">
            {teachingData.map((entry, idx) => (
              <div className="col-lg-6 fade-in" key={entry.memberId}
                style={{ transitionDelay: `${Math.min(idx * 0.06, 0.4)}s` }}>
                <div className="course-card">
                  <div className="course-card__header">
                    <span className="course-card__num">{String(idx + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="course-card__name">{entry.shortName}</h3>
                      <div className="course-card__full">{entry.name}</div>
                    </div>
                    <span className="course-card__count">
                      {entry.courses.length} course{entry.courses.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <ul className="course-card__list">
                    {entry.courses.map((course, i) => (
                      <li key={course}>
                        <span className="course-card__code">C{String(i + 1).padStart(2, '0')}</span>
                        <span className="course-card__title">{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
