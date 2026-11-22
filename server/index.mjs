import express from 'express'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { queryUnmetNeed } from './unmetNeed.mjs'

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

const app = express()

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'dashboard-kbkr-api',
    fixture_rows: rows.length,
  })
})

/**
 * GET /api/unmet-need
 * Query:
 *   level=nasional|provinsi|kabupaten (default nasional)
 *   tahun=YYYY (optional; maps to tahun_rekap)
 *   bulan=1-12 (optional; omit for yearly rollup of matched months)
 *   id_provinsi= (optional filter)
 *   id_kabupaten= (optional filter)
 */
app.get('/api/unmet-need', (req, res) => {
  try {
    const result = queryUnmetNeed(rows, {
      level: req.query.level,
      tahun: req.query.tahun,
      bulan: req.query.bulan,
      id_provinsi: req.query.id_provinsi,
      id_kabupaten: req.query.id_kabupaten,
    })
    res.json(result)
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({
      error: err.message || 'Internal error',
    })
  }
})

app.listen(PORT, '127.0.0.1', () => {
  console.log(
    `[api] unmet-need fixture server on http://127.0.0.1:${PORT} (${rows.length} rows)`,
  )
})
