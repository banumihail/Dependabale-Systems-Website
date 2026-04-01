export default function DesyLogo({ size = 40 }) {
  const w = size * 2.2
  const h = size

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 110 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="brand-logo"
    >
      {/* Three horizontal bars */}
      <rect x="2" y="8" width="30" height="5" rx="2.5" fill="#E87A1E" />
      <rect x="2" y="22" width="30" height="5" rx="2.5" fill="#E87A1E" />
      <rect x="2" y="36" width="30" height="5" rx="2.5" fill="#E87A1E" />

      {/* Circle with dot */}
      <circle cx="44" cy="25" r="8" stroke="#E87A1E" strokeWidth="3.5" fill="none" />
      <circle cx="44" cy="25" r="2" fill="#E87A1E" />
    </svg>
  )
}
