import { Router } from 'express'
import { env } from '../config/env.js'
import { getDb } from '../db/database.js'
import { runSync } from '../services/publicationSync.js'
import { logger } from '../utils/logger.js'

const router = Router()

const requireAdmin = (req, res, next) => {
  if (!env.adminToken) return res.status(503).json({ error: 'admin_disabled', message: 'ADMIN_TOKEN not configured' })
  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (token !== env.adminToken) return res.status(401).json({ error: 'unauthorized' })
  next()
}

let syncInFlight = false

router.post('/sync', requireAdmin, async (_req, res) => {
  if (syncInFlight) return res.status(409).json({ error: 'sync_in_progress' })
  syncInFlight = true
  try {
    logger.info('Admin-triggered sync starting…')
    const result = await runSync()
    res.json(result)
  } catch (err) {
    logger.error('sync failed:', err)
    res.status(500).json({ error: 'sync_failed', message: err.message })
  } finally {
    syncInFlight = false
  }
})

router.get('/sync-log', requireAdmin, (req, res) => {
  const db = getDb()
  const limit = Math.min(Number(req.query.limit) || 20, 100)
  const rows = db.prepare(`
    SELECT id, started_at, finished_at, status, members_processed,
           publications_added, publications_updated, errors_json
    FROM sync_log
    ORDER BY id DESC
    LIMIT ?
  `).all(limit)
  res.json(rows.map((r) => ({
    ...r,
    errors: r.errors_json ? JSON.parse(r.errors_json) : null,
    errors_json: undefined,
  })))
})

export default router
