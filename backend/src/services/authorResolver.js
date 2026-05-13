import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { getDb } from '../db/database.js'
import { openalex } from './openalex.js'
import { logger } from '../utils/logger.js'

const UTCN_ROR = '04bdjzr10'

const cleanMemberName = (raw) => {
  return raw
    .replace(/^(Prof\.?\s+Eng\.?|Assoc\.?\s+Prof\.?\s+Eng\.?|Assist\.?\s+Eng\.?|Lecturer\s+Eng\.?|Lecturer\.?\s+Eng\.?|Eng\.?)\s+/i, '')
    .replace(/,?\s*PhD\.?$/i, '')
    .trim()
}

const getUtcnInstitutionId = async (db) => {
  const cached = db.prepare('SELECT value FROM meta WHERE key = ?').get('utcn_openalex_id')
  if (cached?.value) return cached.value

  let inst = await openalex.findInstitutionByRor(UTCN_ROR)
  if (!inst) {
    const results = await openalex.searchInstitutions('Technical University of Cluj-Napoca')
    inst = results[0]
  }
  if (!inst) {
    logger.warn('Could not resolve UTCN institution on OpenAlex; falling back to name-only author search')
    return null
  }
  const id = inst.id.replace(/^https?:\/\/openalex\.org\//, '')
  db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run('utcn_openalex_id', id)
  logger.info(`Resolved UTCN institution: ${inst.display_name} (${id})`)
  return id
}

const presentCandidates = (candidates) => {
  return candidates.map((c, i) => {
    const inst = (c.last_known_institutions || c.last_known_institution || [])
    const instStr = Array.isArray(inst)
      ? inst.map((x) => x.display_name).join(', ')
      : inst?.display_name || '—'
    return `  [${i + 1}] ${c.display_name} — works: ${c.works_count}, cited: ${c.cited_by_count}, inst: ${instStr}\n      id: ${c.id}`
  }).join('\n')
}

export async function resolveAuthorsInteractive({ onlyMissing = true, memberId = null } = {}) {
  const db = getDb()
  const utcnId = await getUtcnInstitutionId(db)

  let members
  if (memberId) {
    members = db.prepare('SELECT * FROM members WHERE id = ?').all(memberId)
  } else if (onlyMissing) {
    members = db.prepare('SELECT * FROM members WHERE openalex_author_id IS NULL').all()
  } else {
    members = db.prepare('SELECT * FROM members').all()
  }

  if (!members.length) {
    logger.info('No members to resolve.')
    return { resolved: 0, skipped: 0, ambiguous: 0 }
  }

  const rl = readline.createInterface({ input, output })
  const update = db.prepare('UPDATE members SET openalex_author_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')

  let resolved = 0, skipped = 0, ambiguous = 0

  try {
    for (const m of members) {
      const cleaned = cleanMemberName(m.name)
      logger.info(`\n— Resolving member #${m.id}: ${m.name} (search="${cleaned}")`)

      let candidates = await openalex.searchAuthors(cleaned, utcnId)
      if (!candidates.length && utcnId) {
        logger.info('  no UTCN-affiliated match; broadening search without affiliation filter')
        candidates = await openalex.searchAuthors(cleaned, null)
      }

      if (!candidates.length) {
        logger.warn(`  no candidates found — skipped`)
        skipped++
        continue
      }

      if (candidates.length === 1) {
        const id = candidates[0].id.replace(/^https?:\/\/openalex\.org\//, '')
        update.run(id, m.id)
        logger.info(`  auto-assigned ${id} (${candidates[0].display_name})`)
        resolved++
        continue
      }

      const display = candidates.slice(0, 10)
      console.log(presentCandidates(display))
      const answer = (await rl.question('  pick [1-N], "s" to skip, "m" for manual id: ')).trim().toLowerCase()
      if (answer === 's' || answer === '') {
        skipped++
        ambiguous++
        continue
      }
      if (answer === 'm') {
        const manual = (await rl.question('  enter OpenAlex author id (e.g. A5012345678): ')).trim()
        if (manual) {
          update.run(manual.replace(/^https?:\/\/openalex\.org\//, ''), m.id)
          resolved++
        } else {
          skipped++
        }
        continue
      }
      const idx = Number(answer) - 1
      if (Number.isInteger(idx) && idx >= 0 && idx < display.length) {
        const id = display[idx].id.replace(/^https?:\/\/openalex\.org\//, '')
        update.run(id, m.id)
        resolved++
        logger.info(`  assigned ${id}`)
      } else {
        logger.warn('  invalid choice — skipped')
        skipped++
        ambiguous++
      }
    }
  } finally {
    rl.close()
  }

  logger.info(`\nResolution complete — resolved: ${resolved}, skipped: ${skipped}, ambiguous: ${ambiguous}`)
  return { resolved, skipped, ambiguous }
}
