import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendRoot = path.resolve(__dirname, '..', '..')

const required = (name) => {
  const v = process.env[name]
  if (!v || !v.trim()) throw new Error(`Missing required env var: ${name}`)
  return v
}

export const env = {
  port: Number(process.env.PORT || 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  openalexEmail: process.env.OPENALEX_EMAIL || '',
  adminToken: process.env.ADMIN_TOKEN || '',
  cronSchedule: process.env.CRON_SCHEDULE || '0 3 * * 0',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  dbPath: path.resolve(backendRoot, process.env.DB_PATH || 'data/desy.db'),
  backendRoot,
  required,
}
