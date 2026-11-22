/**
 * Oktober 2026 Excel dummy aggregates (Tabel10/11/16) — nasional + 38 Provinsi.
 * Used when fixture mode serves tahun_rekap=2026 & bulan_rekap=10 (no kabupaten).
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { omitNullish } from './omitNullish.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = join(__dirname, 'fixtures', 'oct2026_excel_dummy.json')

let cached = null

function loadDummy() {
  if (cached) return cached
  cached = JSON.parse(readFileSync(FIXTURE_PATH, 'utf8'))
  return cached
}

export function isOct2026Period(query) {
  const tahun =
    query.tahun != null && query.tahun !== '' ? Number(query.tahun) : null
  const bulan =
    query.bulan != null && query.bulan !== '' ? Number(query.bulan) : null
  return tahun === 2026 && bulan === 10
}

/**
 * Unmet Need response from Excel dummy (same shape as unmetNeed.mjs).
 */
export function queryUnmetNeedOct2026(query) {
  const dummy = loadDummy()
  const level = String(query.level || 'nasional').toLowerCase()
  if (!['nasional', 'provinsi', 'kabupaten'].includes(level)) {
    const err = new Error('level must be nasional|provinsi|kabupaten')
    err.status = 400
    throw err
  }

  const meta = {
    source: 'excel-dummy',
    fixture_note:
      'Dummy Excel Oct 2026 (Tabel10/11/16 · nasional + 38 Provinsi)',
    formula: dummy.formulas.unmet_need,
    filters: {
      level,
      tahun_rekap: 2026,
      bulan_rekap: 10,
      id_provinsi:
        query.id_provinsi != null && query.id_provinsi !== ''
          ? Number(query.id_provinsi)
          : null,
      id_kabupaten:
        query.id_kabupaten != null && query.id_kabupaten !== ''
          ? Number(query.id_kabupaten)
          : null,
      period_mode: 'bulanan',
    },
    matched_rows: 0,
  }

  if (level === 'kabupaten') {
    meta.matched_rows = 0
    return omitNullish({ meta, data: [] })
  }

  if (level === 'nasional') {
    meta.matched_rows = 1
    return omitNullish({
      meta,
      data: [
        {
          level: 'nasional',
          numerator: dummy.nasional.unmet_need,
          denominator: dummy.nasional.jumlah_pus,
          unmet_need_pct: dummy.nasional.unmet_need_pct,
          row_count: dummy.tabel16_unmet_need.length,
        },
      ],
    })
  }

  let rows = dummy.tabel16_unmet_need
  const idProvinsi =
    query.id_provinsi != null && query.id_provinsi !== ''
      ? Number(query.id_provinsi)
      : null
  if (idProvinsi != null) {
    // Excel share has kode BPS, not internal id — filter by kode if numeric match
    rows = rows.filter((r) => Number(r.kode) === idProvinsi)
  }

  meta.matched_rows = rows.length
  return omitNullish({
    meta,
    data: rows.map((row) => ({
      level: 'provinsi',
      nama_provinsi: row.provinsi,
      kode_provinsi: row.kode,
      numerator: row.jumlah_unmet_need,
      denominator: row.jumlah_pus,
      unmet_need_pct: row.unmet_need_pct,
      row_count: 1,
    })),
  })
}
