import { getDb } from '../db/database.js'
import { openalex } from './openalex.js'
import { normalizeDoi, normalizeTitle } from '../utils/dedup.js'
import { logger } from '../utils/logger.js'

const TYPE_MAP = {
  'journal-article': 'journal',
  'proceedings-article': 'conference',
  'book-chapter': 'conference',
  'book': 'book',
  'dataset': 'dataset',
  'report': 'report',
  'dissertation': 'dissertation',
  'preprint': 'preprint',
}
const mapType = (t) => TYPE_MAP[t] || t || 'other'

const mapWork = (work) => {
  const doi = normalizeDoi(work.doi)
  const openalexId = work.id ? work.id.replace(/^https?:\/\/openalex\.org\//, '') : null
  const title = work.display_name || work.title || '(untitled)'
  const venue =
    work.primary_location?.source?.display_name ||
    work.host_venue?.display_name ||
    null
  const biblio = work.biblio || {}
  const pages = biblio.first_page && biblio.last_page
    ? `${biblio.first_page}-${biblio.last_page}`
    : biblio.first_page || null
  const link =
    work.primary_location?.landing_page_url ||
    (doi ? `https://doi.org/${doi}` : null) ||
    work.id ||
    null
  const authorsText = (work.authorships || [])
    .map((a) => a.author?.display_name)
    .filter(Boolean)
    .join('; ') || null

  return {
    openalex_id: openalexId,
    doi,
    title,
    title_normalized: normalizeTitle(title),
    abstract: null,
    year: work.publication_year || null,
    venue,
    volume: biblio.volume || null,
    issue: biblio.issue || null,
    pages,
    type: mapType(work.type),
    link,
    authors_text: authorsText,
    citation_count: work.cited_by_count || 0,
    source: 'openalex',
    raw_json: JSON.stringify(work),
  }
}

const upsertSql = `
INSERT INTO publications (
  openalex_id, doi, title, title_normalized, abstract, year, venue,
  volume, issue, pages, type, link, authors_text, citation_count, source, raw_json, updated_at
) VALUES (
  @openalex_id, @doi, @title, @title_normalized, @abstract, @year, @venue,
  @volume, @issue, @pages, @type, @link, @authors_text, @citation_count, @source, @raw_json, CURRENT_TIMESTAMP
)
ON CONFLICT(openalex_id) DO UPDATE SET
  doi = excluded.doi,
  title = excluded.title,
  title_normalized = excluded.title_normalized,
  year = excluded.year,
  venue = excluded.venue,
  volume = excluded.volume,
  issue = excluded.issue,
  pages = excluded.pages,
  type = excluded.type,
  link = excluded.link,
  authors_text = excluded.authors_text,
  citation_count = excluded.citation_count,
  source = excluded.source,
  raw_json = excluded.raw_json,
  updated_at = CURRENT_TIMESTAMP
`

const findByDoiSql = 'SELECT id, source FROM publications WHERE doi = ? LIMIT 1'
const findByTitleYearSql = 'SELECT id, source FROM publications WHERE title_normalized = ? AND (year = ? OR year IS NULL) LIMIT 1'
const findByOpenalexIdSql = 'SELECT id FROM publications WHERE openalex_id = ? LIMIT 1'

const upgradeSeededSql = `
UPDATE publications SET
  openalex_id = @openalex_id,
  doi = COALESCE(@doi, doi),
  title = @title,
  title_normalized = @title_normalized,
  year = @year,
  venue = COALESCE(@venue, venue),
  volume = COALESCE(@volume, volume),
  issue = COALESCE(@issue, issue),
  pages = COALESCE(@pages, pages),
  type = COALESCE(@type, type),
  link = COALESCE(@link, link),
  authors_text = COALESCE(@authors_text, authors_text),
  citation_count = @citation_count,
  source = 'openalex',
  raw_json = @raw_json,
  updated_at = CURRENT_TIMESTAMP
WHERE id = @id
`

const insertAuthorshipSql = `
INSERT OR REPLACE INTO authorships (publication_id, member_id, author_position, display_name)
VALUES (?, ?, ?, ?)
`

function upsertPublication(db, mapped) {
  let publicationId = null
  let added = false

  if (mapped.doi) {
    const existing = db.prepare(findByDoiSql).get(mapped.doi)
    if (existing) {
      publicationId = existing.id
      db.prepare(upgradeSeededSql).run({ ...mapped, id: publicationId })
      return { publicationId, added: false }
    }
  }

  if (mapped.openalex_id) {
    const existing = db.prepare(findByOpenalexIdSql).get(mapped.openalex_id)
    if (existing) {
      publicationId = existing.id
    }
  }

  if (!publicationId && mapped.title_normalized) {
    const existing = db.prepare(findByTitleYearSql).get(mapped.title_normalized, mapped.year)
    if (existing && existing.source === 'seed') {
      publicationId = existing.id
      db.prepare(upgradeSeededSql).run({ ...mapped, id: publicationId })
      return { publicationId, added: false }
    }
  }

  if (publicationId) {
    db.prepare(upgradeSeededSql).run({ ...mapped, id: publicationId })
    return { publicationId, added: false }
  }

  const info = db.prepare(upsertSql).run(mapped)
  publicationId = Number(info.lastInsertRowid)
  added = true
  return { publicationId, added }
}

function linkAuthorships(db, work, publicationId, membersByOpenalexId) {
  const insert = db.prepare(insertAuthorshipSql)
  const auths = work.authorships || []
  for (let i = 0; i < auths.length; i++) {
    const a = auths[i]
    const oaId = a.author?.id?.replace(/^https?:\/\/openalex\.org\//, '')
    if (!oaId) continue
    const member = membersByOpenalexId.get(oaId)
    if (!member) continue
    const position = i === 0 ? 'first' : i === auths.length - 1 ? 'last' : 'middle'
    insert.run(publicationId, member.id, position, a.author.display_name || member.name)
  }
}

export async function runSync({ memberIds = null } = {}) {
  const db = getDb()
  const startLog = db.prepare('INSERT INTO sync_log (started_at, status) VALUES (CURRENT_TIMESTAMP, ?)').run('running')
  const syncId = Number(startLog.lastInsertRowid)

  const allMembers = db.prepare('SELECT * FROM members WHERE openalex_author_id IS NOT NULL').all()
  const membersByOpenalexId = new Map(allMembers.map((m) => [m.openalex_author_id, m]))
  const targetMembers = memberIds
    ? allMembers.filter((m) => memberIds.includes(m.id))
    : allMembers

  let added = 0, updated = 0, processed = 0
  const errors = []

  for (const member of targetMembers) {
    processed++
    logger.info(`Syncing ${member.name} (${member.openalex_author_id})`)
    try {
      const works = []
      for await (const work of openalex.worksForAuthor(member.openalex_author_id)) {
        works.push(work)
      }
      logger.info(`  fetched ${works.length} works`)

      const tx = db.transaction((items) => {
        for (const work of items) {
          const mapped = mapWork(work)
          if (!mapped.title) continue
          const { publicationId, added: wasAdded } = upsertPublication(db, mapped)
          if (wasAdded) added++
          else updated++
          linkAuthorships(db, work, publicationId, membersByOpenalexId)
        }
      })
      tx(works)
    } catch (err) {
      logger.error(`  failed for ${member.name}: ${err.message}`)
      errors.push({ memberId: member.id, name: member.name, error: err.message })
    }
  }

  const status = errors.length === 0 ? 'ok' : (added + updated > 0 ? 'partial' : 'failed')
  db.prepare(`
    UPDATE sync_log SET
      finished_at = CURRENT_TIMESTAMP,
      status = ?,
      members_processed = ?,
      publications_added = ?,
      publications_updated = ?,
      errors_json = ?
    WHERE id = ?
  `).run(status, processed, added, updated, errors.length ? JSON.stringify(errors) : null, syncId)

  logger.info(`Sync done — added: ${added}, updated: ${updated}, members: ${processed}, status: ${status}`)
  return { syncId, status, added, updated, processed, errors }
}
