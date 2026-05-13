import { Router } from 'express'
import { getDb } from '../db/database.js'

const router = Router()

router.get('/', (_req, res) => {
  const db = getDb()
  const rows = db.prepare('SELECT id, authors, title, reference FROM patents ORDER BY id').all()
  res.json(rows)
})

export default router
