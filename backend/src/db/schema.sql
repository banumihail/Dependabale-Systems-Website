PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  category TEXT,
  link TEXT,
  openalex_author_id TEXT,
  orcid TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS publications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  openalex_id TEXT UNIQUE,
  doi TEXT UNIQUE,
  title TEXT NOT NULL,
  title_normalized TEXT NOT NULL,
  abstract TEXT,
  year INTEGER,
  venue TEXT,
  volume TEXT,
  issue TEXT,
  pages TEXT,
  type TEXT,
  link TEXT,
  authors_text TEXT,
  citation_count INTEGER DEFAULT 0,
  source TEXT NOT NULL,
  raw_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pub_year ON publications(year);
CREATE INDEX IF NOT EXISTS idx_pub_type ON publications(type);
CREATE INDEX IF NOT EXISTS idx_pub_title_norm ON publications(title_normalized);

CREATE TABLE IF NOT EXISTS authorships (
  publication_id INTEGER NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  author_position TEXT,
  display_name TEXT,
  PRIMARY KEY (publication_id, member_id)
);

CREATE TABLE IF NOT EXISTS patents (
  id INTEGER PRIMARY KEY,
  authors TEXT,
  title TEXT,
  reference TEXT
);

CREATE TABLE IF NOT EXISTS sync_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at TEXT DEFAULT CURRENT_TIMESTAMP,
  finished_at TEXT,
  status TEXT,
  members_processed INTEGER DEFAULT 0,
  publications_added INTEGER DEFAULT 0,
  publications_updated INTEGER DEFAULT 0,
  errors_json TEXT
);

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT
);
