import { getDb, closeDb } from '../src/db/database.js'
import { logger } from '../src/utils/logger.js'

try {
  const db = getDb()
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all()
  logger.info(`Database initialized. Tables: ${tables.map((t) => t.name).join(', ')}`)
} catch (err) {
  logger.error('init-db failed:', err)
  process.exit(1)
} finally {
  closeDb()
}
