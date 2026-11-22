import 'dotenv/config'
import express from 'express'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPool, isPostgresConfigured, resolveTableName } from './db.mjs'
import { isOct2026Period, queryUnmetNeedOct2026 } from './oct2026Dummy.mjs'
import { queryUnmetNeed } from './unmetNeed.mjs'
import { queryUnmetNeedFromPg } from './unmetNeedPg.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 8787)
const FIXTURE_PATH = join(
  __dirname,
  'fixtures',
  'fa_laporan_dallap_bulanan_tabel10_20rdk_sample.json',
)

const rows = JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'))
if (!Array.isArray(rows)) {
  throw new Error('Fixture must be a JSON array of kelurahan rows')
}

const usePostgres = isPostgresConfigured()
let tableName = null
if (usePostgres) {
  tableName = resolveTableName()
  // Warm pool construction; connection validated on first query / health check
  getPool()
}

const app = express()

app.get('/api/health', async (_req, res) => {
  const payload = {
    ok: true,
    service: 'dashboard-kbkr-api',
    data_source: usePostgres ? 'postgres' : 'fixture',
    fixture_rows: rows.length,
  }

  if (usePostgres) {
    payload.table = tableName
    try {
      const pool = getPool()
      await pool.query('SELECT 1')
      payload.postgres = { ok: true }
    } catch (err) {
      payload.ok = false
      payload.postgres = {
        ok: false,
        error: err.message || 'connection failed',
      }
      return res.status(503).json(payload)
    }
  }

  res.json(payload)
})

/**
 * GET /api/unmet-need
 * Query:
 *   level=nasional|provinsi|kabupaten (default nasional)
 *   tahun=YYYY (optional; maps to tahun_rekap)
 *   bulan=1-12 (optional; omit for yearly rollup of matched months)
 *   id_provinsi= (optional filter)
 *   id_kabupaten= (optional filter)
 *
 * Uses live SQL when DATABASE_URL or PG* env is set; otherwise fixture JSON.
 */
app.get('/api/unmet-need', async (req, res) => {
  const query = {
    level: req.query.level,
    tahun: req.query.tahun,
    bulan: req.query.bulan,
    id_provinsi: req.query.id_provinsi,
    id_kabupaten: req.query.id_kabupaten,
  }

  try {
    if (usePostgres) {
      const result = await queryUnmetNeedFromPg(query)
      return res.json(result)
    }
    // Prefer Excel dummy for Oct 2026 when DB unset (UI default period).
    if (isOct2026Period(query)) {
      return res.json(queryUnmetNeedOct2026(query))
    }
    const result = queryUnmetNeed(rows, query)
    return res.json(result)
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({
      error: err.message || 'Internal error',
      data_source: usePostgres ? 'postgres' : 'fixture',
    })
  }
})

app.listen(PORT, '127.0.0.1', () => {
  if (usePostgres) {
    console.log(
      `[api] unmet-need on http://127.0.0.1:${PORT} (postgres → ${tableName}; fixture fallback available if env unset)`,
    )
  } else {
    console.log(
      `[api] unmet-need on http://127.0.0.1:${PORT} (fixture, ${rows.length} rows — set DATABASE_URL or PG* for live SQL)`,
    )
  }
})
