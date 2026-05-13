import { closeDb } from '../src/db/database.js'
import { seedDatabase } from '../src/services/seed.js'
import { logger } from '../src/utils/logger.js'

const reset = process.argv.includes('--reset')

try {
  const result = seedDatabase({ reset })
  logger.info('Seed result:', result)
} catch (err) {
  logger.error('seed failed:', err)
  process.exit(1)
} finally {
  closeDb()
}
