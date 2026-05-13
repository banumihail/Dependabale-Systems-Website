const BASE = import.meta.env.VITE_API_BASE_URL || '/api'

const handle = async (res) => {
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText}${body ? `: ${body}` : ''}`)
  }
  return res.json()
}

export const fetchPublications = (params = {}) => {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== 'All'),
  )
  const qs = new URLSearchParams(cleaned).toString()
  return fetch(`${BASE}/publications${qs ? `?${qs}` : ''}`).then(handle)
}

export const fetchPatents = () => fetch(`${BASE}/patents`).then(handle)

export const fetchMembers = () => fetch(`${BASE}/members`).then(handle)

export const fetchHealth = () => fetch(`${BASE}/health`).then(handle)
