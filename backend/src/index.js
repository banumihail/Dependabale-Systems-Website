import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { getDb, closeDb } from './db/database.js'
import publicationsRoute from './routes/publications.js'
import membersRoute from './routes/members.js'
import patentsRoute from './routes/patents.js'
import adminRoute from './routes/admin.js'
import { startScheduler, stopScheduler } from './scheduler/cron.js'
import { logger } from './utils/logger.js'

const app = express()

app.use(cors({ origin: env.corsOrigins, credentials: false }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  const db = getDb()
  const counts = {
    members: db.prepare('SELECT COUNT(*) AS c FROM members').get().c,
    publications: db.prepare('SELECT COUNT(*) AS c FROM publications').get().c,
    patents: db.prepare('SELECT COUNT(*) AS c FROM patents').get().c,
  }
  const lastSync = db.prepare('SELECT id, started_at, finished_at, status FROM sync_log ORDER BY id DESC LIMIT 1').get()
  res.json({ ok: true, counts, lastSync })
})

app.use('/api/publications', publicationsRoute)
app.use('/api/members', membersRoute)
app.use('/api/patents', patentsRoute)
app.use('/api/admin', adminRoute)

app.use((err, _req, res, _next) => {
  logger.error('Unhandled:', err)
  res.status(500).json({ error: 'internal_error', message: err.message })
})

getDb()

const server = app.listen(env.port, () => {
  logger.info(`DeSy backend listening on http://localhost:${env.port}`)
  logger.info(`CORS origins: ${env.corsOrigins.join(', ')}`)
  if (env.nodeEnv !== 'test') startScheduler()
})

const shutdown = (signal) => {
  logger.info(`${signal} received, shutting down…`)
  stopScheduler()
  server.close(() => {
    closeDb()
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10_000).unref()
}
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
