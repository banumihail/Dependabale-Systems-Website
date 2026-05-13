import { Router } from 'express'
import { getDb } from '../db/database.js'

const router = Router()

router.get('/', (_req, res) => {
  const db = getDb()
  const rows = db.prepare(`
    SELECT id, name, role, category, link, openalex_author_id, orcid
    FROM members
    ORDER BY
      CASE category
        WHEN 'professor' THEN 0
        WHEN 'associate' THEN 1
        WHEN 'lecturer' THEN 2
        WHEN 'assistant' THEN 3
        WHEN 'phd' THEN 4
        ELSE 5
      END,
      id
  `).all()
  res.json(rows.map((r) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    category: r.category,
    link: r.link || '#',
    openalex_author_id: r.openalex_author_id,
    orcid: r.orcid,
  })))
})

export default router
