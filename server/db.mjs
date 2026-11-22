/**
 * Postgres connection from env — never hardcode secrets.
 *
 * Prefer DATABASE_URL, else PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD.
 */

import pg from 'pg'

const DEFAULT_TABLE = 'dwh_siga.fa_laporan_dallap_bulanan_tabel10_20rdk'

/** Allow only schema.table with [a-zA-Z0-9_]. */
export function resolveTableName(raw = process.env.UNMET_NEED_TABLE) {
  const table = (raw || DEFAULT_TABLE).trim()
  if (!/^[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*$/.test(table)) {
    throw new Error(
      `Invalid UNMET_NEED_TABLE "${table}" — use schema.table with letters/digits/_ only`,
    )
  }
  return table
}

export function isPostgresConfigured() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim()) return true
  // Minimal discrete config: host + database + user
  return Boolean(
    process.env.PGHOST?.trim() &&
      process.env.PGDATABASE?.trim() &&
      process.env.PGUSER?.trim(),
  )
}

export function buildPoolConfig() {
  if (process.env.DATABASE_URL?.trim()) {
    return { connectionString: process.env.DATABASE_URL.trim() }
  }
  return {
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  }
}

let pool = null

export function getPool() {
  if (!isPostgresConfigured()) return null
  if (!pool) {
    pool = new pg.Pool(buildPoolConfig())
  }
  return pool
}

export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
