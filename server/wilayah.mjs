/**
 * Wilayah name enrichment from d_provinsi / d_kabupaten dims.
 *
 * Dim tables are year-suffixed (d_provinsi_2023, …). Match `tahun_rekap`;
 * if exact year missing, use nearest available year. Never invent names.
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function pickNearestYear(target, availableYears) {
  const years = [...new Set(availableYears.map(Number).filter(Number.isFinite))].sort(
    (a, b) => a - b,
  )
  if (!years.length) return null
  if (target == null || !Number.isFinite(Number(target))) {
    return years[years.length - 1]
  }
  const t = Number(target)
  if (years.includes(t)) return t
  return years.reduce((best, y) =>
    Math.abs(y - t) < Math.abs(best - t) ? y : best,
  )
}

function emptyWilayahFields() {
  return {
    nama_provinsi: null,
    kode_provinsi: null,
    nama_kabupaten: null,
    kode_kabupaten: null,
  }
}

/**
 * @param {object[]} provRows
 * @param {object[]} kabRows
 * @param {number|null} tahunRequested
 */
export function buildWilayahLookup(provRows, kabRows, tahunRequested) {
  const provYears = [...new Set(provRows.map((r) => Number(r.tahun)).filter(Number.isFinite))]
  const kabYears = [...new Set(kabRows.map((r) => Number(r.tahun)).filter(Number.isFinite))]
  const dimTahunProv = pickNearestYear(tahunRequested, provYears)
  const dimTahunKab = pickNearestYear(tahunRequested, kabYears)

  const provById = new Map()
  if (dimTahunProv != null) {
    for (const row of provRows) {
      if (Number(row.tahun) !== dimTahunProv) continue
      provById.set(Number(row.id_provinsi), {
        nama_provinsi: row.nama_provinsi ?? null,
        kode_provinsi: row.kode_provinsi != null ? String(row.kode_provinsi).trim() : null,
      })
    }
  }

  const kabByKey = new Map()
  if (dimTahunKab != null) {
    for (const row of kabRows) {
      if (Number(row.tahun) !== dimTahunKab) continue
      const key = `${Number(row.id_provinsi)}:${Number(row.id_kabupaten)}`
      kabByKey.set(key, {
        nama_kabupaten: row.nama_kabupaten ?? null,
        kode_kabupaten: row.kode_kabupaten != null ? String(row.kode_kabupaten).trim() : null,
        id_provinsi: Number(row.id_provinsi),
      })
    }
  }

  return {
    dim_tahun_requested: tahunRequested ?? null,
    dim_tahun_provinsi: dimTahunProv,
    dim_tahun_kabupaten: dimTahunKab,
    lookup(row) {
      const fields = emptyWilayahFields()
      if (row.id_provinsi != null) {
        const prov = provById.get(Number(row.id_provinsi))
        if (prov) {
          fields.nama_provinsi = prov.nama_provinsi
          fields.kode_provinsi = prov.kode_provinsi
        }
      }
      if (row.id_kabupaten != null && row.id_provinsi != null) {
        const kab = kabByKey.get(
          `${Number(row.id_provinsi)}:${Number(row.id_kabupaten)}`,
        )
        if (kab) {
          fields.nama_kabupaten = kab.nama_kabupaten
          fields.kode_kabupaten = kab.kode_kabupaten
        }
      }
      return fields
    },
  }
}

export function enrichRowsWithWilayah(rows, lookup) {
  return rows.map((row) => ({
    ...row,
    ...lookup.lookup(row),
  }))
}

let fixtureCache = null

export function loadFixtureWilayahRows() {
  if (fixtureCache) return fixtureCache
  const provPath = join(__dirname, 'fixtures', 'd_provinsi_sample.json')
  const kabPath = join(__dirname, 'fixtures', 'd_kabupaten_sample.json')
  const provinsi = JSON.parse(readFileSync(provPath, 'utf8'))
  const kabupaten = JSON.parse(readFileSync(kabPath, 'utf8'))
  if (!Array.isArray(provinsi) || !Array.isArray(kabupaten)) {
    throw new Error('Wilayah fixture dims must be JSON arrays')
  }
  fixtureCache = { provinsi, kabupaten }
  return fixtureCache
}

export function enrichFromFixtureDims(rows, tahunRequested) {
  const { provinsi, kabupaten } = loadFixtureWilayahRows()
  const lookup = buildWilayahLookup(provinsi, kabupaten, tahunRequested)
  return {
    data: enrichRowsWithWilayah(rows, lookup),
    wilayah: {
      source: 'fixture',
      dim_tahun_requested: lookup.dim_tahun_requested,
      dim_tahun_provinsi: lookup.dim_tahun_provinsi,
      dim_tahun_kabupaten: lookup.dim_tahun_kabupaten,
      note:
        'Names from sample d_provinsi / d_kabupaten JSON. Missing ids stay null (not invented). Kabupaten sample is partial.',
    },
  }
}
