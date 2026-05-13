import { useEffect, useState } from 'react'
import { fetchHealth } from '../services/api'

function formatRelative(iso) {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return null
  const diff = Math.max(0, Date.now() - then)
  const min = Math.floor(diff / 60_000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`
  const d = Math.floor(hr / 24)
  if (d < 30) return `${d} day${d === 1 ? '' : 's'} ago`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `${mo} month${mo === 1 ? '' : 's'} ago`
  const y = Math.floor(mo / 12)
  return `${y} year${y === 1 ? '' : 's'} ago`
}

export default function SyncStatus() {
  const [info, setInfo] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchHealth()
      .then((data) => {
        if (cancelled) return
        const ls = data?.lastSync
        if (!ls?.finished_at) return
        setInfo({ when: ls.finished_at, status: ls.status })
      })
      .catch(() => { /* hide silently on error */ })
    return () => { cancelled = true }
  }, [])

  if (!info) return null

  const relative = formatRelative(info.when)
  if (!relative) return null

  const ok = info.status === 'ok' || info.status === 'success'
  const dotClass = `sync-status__dot${ok ? ' is-ok' : ' is-error'}`

  return (
    <span
      className="sync-status"
      title={new Date(info.when).toLocaleString()}
      aria-label={`Last OpenAlex sync ${relative}, status ${info.status}`}
    >
      <span>Last OpenAlex sync · {relative}</span>
      <span className={dotClass} aria-hidden="true" />
    </span>
  )
}
