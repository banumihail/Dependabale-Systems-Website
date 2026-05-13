import { Link } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'
import PageCoords from '../components/PageCoords'
import projectsData from '../data/projects.json'

const allProjectYears = projectsData
  .flatMap((p) => (p.years || '').split('-').map((y) => parseInt(y, 10)))
  .filter((y) => !Number.isNaN(y))
const minProjectYear = allProjectYears.length ? Math.min(...allProjectYears) : null
const maxProjectYear = allProjectYears.length ? Math.max(...allProjectYears) : null
const projectYearRange = minProjectYear && maxProjectYear
  ? `${minProjectYear}–${maxProjectYear}`
  : null

export default function Projects() {
  const sectionRef = useScrollReveal()

  return (
    <div ref={sectionRef}>
      {/* Page Header */}
      <div className="page-header" id="projects-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Projects</span>
          </div>
          <PageCoords
            segments={[
              { text: 'SEC.04' },
              { text: 'Projects' },
              { text: `${projectsData.length} Selected` },
              ...(projectYearRange ? [{ text: projectYearRange }] : []),
              { text: 'Funded', accent: true },
            ]}
          />
          <h1>Representative <em>projects</em></h1>
          <p className="page-subtitle">
            The most representative projects of the last 10 years, spanning national and international funding programs.
          </p>
        </div>
      </div>

      {/* Projects List */}
      <section className="section" id="projects-list">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              {projectsData.map((project, idx) => (
                <div className="project-item fade-in" key={project.id}
                  style={{ transitionDelay: `${Math.min(idx * 0.08, 0.5)}s` }}>
                  <div className="project-years">📅 {project.years}</div>
                  <h4>{project.title}</h4>
                  {project.description && (
                    <p>{project.description}</p>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      Visit Project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
