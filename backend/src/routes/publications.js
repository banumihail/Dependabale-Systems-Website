import { Router } from 'express'
import { getDb } from '../db/database.js'

const router = Router()

const buildShape = (row, authors) => ({
  id: row.id,
  authors: authors || row.authors_inline || row.authors_text || '',
  title: row.title,
  journal: row.venue,
  year: row.year,
  volume: row.volume,
  issue: row.issue,
  pages: row.pages,
  type: row.type,
  link: row.link,
  citation_count: row.citation_count,
  doi: row.doi,
  source: row.source,
})

router.get('/', (req, res) => {
  const db = getDb()
  const { year, type, author, q, limit, offset } = req.query

  const where = []
  const params = {}
  if (year) { where.push('p.year = @year'); params.year = Number(year) }
  if (type && type !== 'All') { where.push('p.type = @type'); params.type = type }
  if (author) {
    where.push('EXISTS (SELECT 1 FROM authorships a WHERE a.publication_id = p.id AND a.member_id = @author)')
    params.author = Number(author)
  }
  if (q) {
    where.push('(LOWER(p.title) LIKE @q OR LOWER(p.venue) LIKE @q)')
    params.q = `%${String(q).toLowerCase()}%`
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const lim = Math.min(Number(limit) || 500, 1000)
  const off = Math.max(Number(offset) || 0, 0)

  const rows = db.prepare(`
    SELECT p.*,
      (SELECT GROUP_CONCAT(COALESCE(a.display_name, m.name), '; ')
         FROM authorships a JOIN members m ON m.id = a.member_id
        WHERE a.publication_id = p.id) AS authors_inline
    FROM publications p
    ${whereSql}
    ORDER BY p.year DESC, p.citation_count DESC, p.id DESC
    LIMIT ${lim} OFFSET ${off}
  `).all(params)

  const totalRow = db.prepare(`SELECT COUNT(*) AS c FROM publications p ${whereSql}`).get(params)

  res.json({
    items: rows.map((r) => buildShape(r, r.authors_inline)),
    total: totalRow.c,
    limit: lim,
    offset: off,
  })
})

router.get('/:id', (req, res) => {
  const db = getDb()
  const pub = db.prepare('SELECT * FROM publications WHERE id = ?').get(Number(req.params.id))
  if (!pub) return res.status(404).json({ error: 'not_found' })
  const authors = db.prepare(`
    SELECT m.id, m.name, a.display_name, a.author_position
    FROM authorships a JOIN members m ON m.id = a.member_id
    WHERE a.publication_id = ?
    ORDER BY CASE a.author_position WHEN 'first' THEN 0 WHEN 'middle' THEN 1 WHEN 'last' THEN 2 ELSE 3 END
  `).all(pub.id)
  res.json({ ...buildShape(pub, authors.map((a) => a.display_name || a.name).join('; ')), authors })
})

export default router
