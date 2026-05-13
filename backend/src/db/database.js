import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Database from 'better-sqlite3'
import { env } from '../config/env.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let dbInstance = null

export const getDb = () => {
  if (dbInstance) return dbInstance

  fs.mkdirSync(path.dirname(env.dbPath), { recursive: true })

  const db = new Database(env.dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  const schemaPath = path.join(__dirname, 'schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf8')
  db.exec(schema)

  dbInstance = db
  return db
}

export const closeDb = () => {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}
