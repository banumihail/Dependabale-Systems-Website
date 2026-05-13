import { closeDb } from '../src/db/database.js'
import { resolveAuthorsInteractive } from '../src/services/authorResolver.js'
import { logger } from '../src/utils/logger.js'

const memberArg = process.argv.find((a) => a.startsWith('--member='))
const all = process.argv.includes('--all')
const memberId = memberArg ? Number(memberArg.split('=')[1]) : null

try {
  await resolveAuthorsInteractive({ onlyMissing: !all, memberId })
} catch (err) {
  logger.error('resolve-authors failed:', err)
  process.exit(1)
} finally {
  closeDb()
}
