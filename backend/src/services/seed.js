import fs from 'node:fs'
import path from 'node:path'
import { getDb } from '../db/database.js'
import { normalizeTitle, normalizeDoi } from '../utils/dedup.js'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'

const frontendDataDir = path.resolve(env.backendRoot, '..', 'src', 'data')

const readJson = (filename) => {
  const filePath = path.join(frontendDataDir, filename)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export function seedDatabase({ reset = false } = {}) {
  const db = getDb()

  if (reset) {
    db.exec(`
      DELETE FROM authorships;
      DELETE FROM publications;
      DELETE FROM patents;
      DELETE FROM members;
    `)
  }

  const memberCount = db.prepare('SELECT COUNT(*) AS c FROM members').get().c
  const pubCount = db.prepare('SELECT COUNT(*) AS c FROM publications').get().c

  let membersInserted = 0, publicationsInserted = 0, patentsInserted = 0

  if (memberCount === 0) {
    const team = readJson('team.json')
    const insert = db.prepare(`
      INSERT INTO members (id, name, role, category, link)
      VALUES (@id, @name, @role, @category, @link)
    `)
    const tx = db.transaction((rows) => {
      for (const m of rows) {
        insert.run({
          id: m.id,
          name: m.name,
          role: m.role || null,
          category: m.category || null,
          link: m.link && m.link !== '#' ? m.link : null,
        })
        membersInserted++
      }
    })
    tx(team)
    logger.info(`Seeded ${membersInserted} members`)
  } else {
    logger.info(`Members already present (${memberCount}) — skipping member seed`)
  }

  if (pubCount === 0) {
    const data = readJson('publications.json')
    const insertPub = db.prepare(`
      INSERT INTO publications (
        doi, title, title_normalized, year, venue, volume, issue, pages, type, link, authors_text, source
      ) VALUES (
        @doi, @title, @title_normalized, @year, @venue, @volume, @issue, @pages, @type, @link, @authors_text, 'seed'
      )
    `)
    const insertPatent = db.prepare(`
      INSERT INTO patents (id, authors, title, reference)
      VALUES (@id, @authors, @title, @reference)
    `)
    const tx = db.transaction(() => {
      for (const p of data.publications || []) {
        const doi = normalizeDoi(extractDoi(p.link))
        try {
          insertPub.run({
            doi,
            title: p.title,
            title_normalized: normalizeTitle(p.title),
            year: p.year || null,
            venue: p.journal || null,
            volume: p.volume || null,
            issue: p.issue || null,
            pages: p.pages || null,
            type: p.type || 'other',
            link: p.link || null,
            authors_text: p.authors || null,
          })
          publicationsInserted++
        } catch (err) {
          logger.warn(`  skipped seed pub "${p.title.slice(0, 60)}…": ${err.message}`)
        }
      }
      for (const pt of data.patents || []) {
        insertPatent.run({
          id: pt.id,
          authors: pt.authors,
          title: pt.title,
          reference: pt.reference,
        })
        patentsInserted++
      }
    })
    tx()
    logger.info(`Seeded ${publicationsInserted} publications, ${patentsInserted} patents`)
  } else {
    logger.info(`Publications already present (${pubCount}) — skipping publication seed`)
  }

  return { membersInserted, publicationsInserted, patentsInserted }
}

function extractDoi(link) {
  if (!link) return null
  const m = link.match(/(?:doi\.org\/|doi:)\s*(10\.\S+)/i)
  return m ? m[1] : null
}
