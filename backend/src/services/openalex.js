import axios from 'axios'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'

const BASE_URL = 'https://api.openalex.org'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { 'User-Agent': `desy-backend/0.1 (mailto:${env.openalexEmail || 'unknown'})` },
})

const withMailto = (params = {}) => {
  const out = { ...params }
  if (env.openalexEmail) out.mailto = env.openalexEmail
  return out
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function get(endpoint, params, attempt = 1) {
  try {
    const res = await client.get(endpoint, { params: withMailto(params) })
    return res.data
  } catch (err) {
    const status = err.response?.status
    if ((status === 429 || status >= 500) && attempt < 4) {
      const backoff = 500 * 2 ** (attempt - 1)
      logger.warn(`OpenAlex ${endpoint} returned ${status}, retrying in ${backoff}ms (attempt ${attempt})`)
      await sleep(backoff)
      return get(endpoint, params, attempt + 1)
    }
    throw err
  }
}

export const openalex = {
  async searchAuthors(name, institutionId) {
    const params = { search: name, per_page: 10 }
    if (institutionId) params.filter = `last_known_institutions.id:${institutionId}`
    const data = await get('/authors', params)
    return data.results || []
  },

  async getAuthor(authorId) {
    return get(`/authors/${authorId.replace(/^https?:\/\/openalex\.org\//, '')}`)
  },

  async findInstitutionByRor(ror) {
    const data = await get('/institutions', { filter: `ror:${ror}`, per_page: 1 })
    return (data.results || [])[0] || null
  },

  async searchInstitutions(query) {
    const data = await get('/institutions', { search: query, per_page: 5 })
    return data.results || []
  },

  async *worksForAuthor(authorId) {
    const id = authorId.replace(/^https?:\/\/openalex\.org\//, '')
    let cursor = '*'
    while (cursor) {
      const data = await get('/works', {
        filter: `author.id:${id}`,
        per_page: 200,
        cursor,
      })
      for (const work of data.results || []) yield work
      cursor = data.meta?.next_cursor || null
    }
  },
}
