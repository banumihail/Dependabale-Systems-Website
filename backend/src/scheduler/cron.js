import cron from 'node-cron'
import { env } from '../config/env.js'
import { runSync } from '../services/publicationSync.js'
import { logger } from '../utils/logger.js'

let task = null
let running = false

export function startScheduler() {
  if (task) return task
  if (!cron.validate(env.cronSchedule)) {
    logger.warn(`Invalid CRON_SCHEDULE "${env.cronSchedule}" — scheduler disabled`)
    return null
  }
  task = cron.schedule(env.cronSchedule, async () => {
    if (running) {
      logger.warn('Skipping scheduled sync — previous run still in progress')
      return
    }
    running = true
    try {
      logger.info('Scheduled sync starting…')
      await runSync()
    } catch (err) {
      logger.error('Scheduled sync failed:', err)
    } finally {
      running = false
    }
  })
  logger.info(`Scheduler started with schedule "${env.cronSchedule}"`)
  return task
}

export function stopScheduler() {
  if (task) {
    task.stop()
    task = null
  }
}
