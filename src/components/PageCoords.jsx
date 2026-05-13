import { Fragment } from 'react'

export default function PageCoords({ segments }) {
  return (
    <div className="page-coords">
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="dot" />}
          <span className={seg.accent ? 'accent' : undefined}>{seg.text}</span>
        </Fragment>
      ))}
    </div>
  )
}
