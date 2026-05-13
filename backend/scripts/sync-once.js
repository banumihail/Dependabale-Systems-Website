import { closeDb } from '../src/db/database.js'
import { runSync } from '../src/services/publicationSync.js'
import { logger } from '../src/utils/logger.js'

const memberArg = process.argv.find((a) => a.startsWith('--member='))
const memberIds = memberArg
  ? memberArg.split('=')[1].split(',').map((n) => Number(n)).filter(Boolean)
  : null

try {
  const result = await runSync({ memberIds })
  logger.info('Sync result:', result)
} catch (err) {
  logger.error('sync-once failed:', err)
  process.exit(1)
} finally {
  closeDb()
}
