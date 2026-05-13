import { useRef } from 'react'

export default function HeroMark() {
  const ref = useRef(null)

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--tilt-x', `${y * -14}deg`)
    el.style.setProperty('--tilt-y', `${x * 14}deg`)
    el.style.setProperty('--shift-x', `${x * 6}px`)
    el.style.setProperty('--shift-y', `${y * 6}px`)
  }

  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
    el.style.setProperty('--shift-x', '0px')
    el.style.setProperty('--shift-y', '0px')
  }

  return (
    <div
      ref={ref}
      className="hero-mark-stage"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <svg
        className="hero-mark"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="heroMarkGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(232,122,30,0.3)" />
            <stop offset="100%" stopColor="rgba(232,122,30,0)" />
          </radialGradient>
          {/* Conic-style gradient for the radar sweep */}
          <linearGradient id="heroMarkSweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="rgba(232,122,30,0)" />
            <stop offset="60%" stopColor="rgba(232,122,30,0.35)" />
            <stop offset="100%" stopColor="rgba(232,122,30,0.85)" />
          </linearGradient>
        </defs>

        {/* Soft halo behind the center */}
        <circle cx="200" cy="200" r="120" fill="url(#heroMarkGlow)" />

        {/* Radar sweep — appears on hover */}
        <g className="hero-mark__sweep">
          <path
            d="M200 200 L380 200 A180 180 0 0 1 327 327 Z"
            fill="url(#heroMarkSweep)"
            opacity="0.7"
          />
        </g>

        {/* Concentric dashed rings — rotate slowly */}
        <g className="hero-mark__rings">
          <circle cx="200" cy="200" r="180" />
          <circle cx="200" cy="200" r="130" />
          <circle cx="200" cy="200" r="80" />
        </g>

        {/* Counter-rotating connection lines (radial spokes) */}
        <g className="hero-mark__spokes">
          <line x1="200" y1="200" x2="200" y2="20" />
          <line x1="200" y1="200" x2="380" y2="200" />
          <line x1="200" y1="200" x2="200" y2="380" />
          <line x1="200" y1="200" x2="20" y2="200" />
          <line x1="200" y1="200" x2="327" y2="73" />
          <line x1="200" y1="200" x2="327" y2="327" />
          <line x1="200" y1="200" x2="73" y2="327" />
          <line x1="200" y1="200" x2="73" y2="73" />
        </g>

        {/* Edge nodes — small circles on the outer ring */}
        <g className="hero-mark__nodes">
          <circle cx="200" cy="20"  r="4" />
          <circle cx="380" cy="200" r="4" />
          <circle cx="200" cy="380" r="4" />
          <circle cx="20"  cy="200" r="4" />
          <circle cx="327" cy="73"  r="6" className="is-accent" />
          <circle cx="327" cy="327" r="4" />
          <circle cx="73"  cy="327" r="6" className="is-accent" />
          <circle cx="73"  cy="73"  r="4" />
        </g>

        {/* Inner-ring nodes */}
        <g className="hero-mark__inner-nodes">
          <circle cx="200" cy="70"  r="3" />
          <circle cx="330" cy="200" r="3" />
          <circle cx="200" cy="330" r="3" />
          <circle cx="70"  cy="200" r="3" />
        </g>

        {/* Central core */}
        <circle cx="200" cy="200" r="14" className="hero-mark__core-bg" />
        <circle cx="200" cy="200" r="6"  className="hero-mark__core" />

        {/* Coordinate labels — engineering drawing micro-type */}
        <g className="hero-mark__labels">
          <text x="200" y="14"  textAnchor="middle">N</text>
          <text x="392" y="204" textAnchor="end">E</text>
          <text x="200" y="396" textAnchor="middle">S</text>
          <text x="8"   y="204" textAnchor="start">W</text>
        </g>
      </svg>
    </div>
  )
}
