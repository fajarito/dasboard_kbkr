/**
 * Unmet Need aggregation from DALLAP Tabel 10/16 kelurahan rows.
 *
 * Formula:
 *   numerator = hamil_ihn + hamil_tial + tdkhamil_ihn + tdkhamil_tial
 *   denominator = status_pus_true
 *   unmet_need_pct = denominator === 0 ? null : numerator / denominator * 100
 *
 * Yearly rollup: SUM numerators and denominators across months, then compute %.
 * Wilayah names joined from fixture d_provinsi / d_kabupaten samples.
 */

import { enrichFromFixtureDims } from './wilayah.mjs'

function n(value) {
  const x = Number(value)
  return Number.isFinite(x) ? x : 0
}

export function rowNumerator(row) {
  return (
    n(row.hamil_ihn) +
    n(row.hamil_tial) +
    n(row.tdkhamil_ihn) +
    n(row.tdkhamil_tial)
  )
}

export function rowDenominator(row) {
  return n(row.status_pus_true)
}

export function computePct(numerator, denominator) {
  if (!denominator) return null
  return (numerator / denominator) * 100
}

export function filterRows(rows, query) {
  const tahun = query.tahun != null && query.tahun !== '' ? Number(query.tahun) : null
  const bulan = query.bulan != null && query.bulan !== '' ? Number(query.bulan) : null
  const idProvinsi =
    query.id_provinsi != null && query.id_provinsi !== ''
      ? Number(query.id_provinsi)
      : null
  const idKabupaten =
    query.id_kabupaten != null && query.id_kabupaten !== ''
      ? Number(query.id_kabupaten)
      : null

  return rows.filter((row) => {
    if (tahun != null && Number(row.tahun_rekap) !== tahun) return false
    if (bulan != null && Number(row.bulan_rekap) !== bulan) return false
    if (idProvinsi != null && Number(row.id_provinsi) !== idProvinsi) return false
    if (idKabupaten != null && Number(row.id_kabupaten) !== idKabupaten) return false
    return true
  })
}

function aggregateBucket(rows) {
  let numerator = 0
  let denominator = 0
  for (const row of rows) {
    numerator += rowNumerator(row)
    denominator += rowDenominator(row)
  }
  const unmet_need_pct = computePct(numerator, denominator)
  return {
    numerator,
    denominator,
    unmet_need_pct,
    row_count: rows.length,
  }
}

/**
 * @param {object[]} rows kelurahan-level fixture/DB rows
 * @param {{ level: string, tahun?: string|number, bulan?: string|number, id_provinsi?: string|number, id_kabupaten?: string|number }} query
 */
export function queryUnmetNeed(rows, query) {
  const level = String(query.level || 'nasional').toLowerCase()
  if (!['nasional', 'provinsi', 'kabupaten'].includes(level)) {
    const err = new Error('level must be nasional|provinsi|kabupaten')
    err.status = 400
    throw err
  }

  const filtered = filterRows(rows, query)
  const meta = {
    source: 'fixture',
    fixture_note:
      'Sample ~1000 kelurahan rows (partial). National/provincial % are fixture-only, not official national figures.',
    formula:
      '(hamil_ihn + hamil_tial + tdkhamil_ihn + tdkhamil_tial) / status_pus_true * 100',
    filters: {
      level,
      tahun_rekap: query.tahun != null && query.tahun !== '' ? Number(query.tahun) : null,
      bulan_rekap: query.bulan != null && query.bulan !== '' ? Number(query.bulan) : null,
      id_provinsi:
        query.id_provinsi != null && query.id_provinsi !== ''
          ? Number(query.id_provinsi)
          : null,
      id_kabupaten:
        query.id_kabupaten != null && query.id_kabupaten !== ''
          ? Number(query.id_kabupaten)
          : null,
      period_mode:
        query.bulan != null && query.bulan !== '' ? 'bulanan' : 'tahunan_rollup',
    },
    matched_rows: filtered.length,
  }

  let data
  if (level === 'nasional') {
    const agg = aggregateBucket(filtered)
    data = [
      {
        level: 'nasional',
        id_provinsi: null,
        id_kabupaten: null,
        ...agg,
      },
    ]
  } else if (level === 'provinsi') {
    const groups = new Map()
    for (const row of filtered) {
      const key = Number(row.id_provinsi)
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(row)
    }
    data = [...groups.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([id_provinsi, bucket]) => ({
        level: 'provinsi',
        id_provinsi,
        id_kabupaten: null,
        ...aggregateBucket(bucket),
      }))
  } else {
    const groups = new Map()
    for (const row of filtered) {
      const key = `${Number(row.id_provinsi)}:${Number(row.id_kabupaten)}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(row)
    }
    data = [...groups.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, bucket]) => {
        const [id_provinsi, id_kabupaten] = key.split(':').map(Number)
        return {
          level: 'kabupaten',
          id_provinsi,
          id_kabupaten,
          ...aggregateBucket(bucket),
        }
      })
  }

  const enriched = enrichFromFixtureDims(data, meta.filters.tahun_rekap)
  return {
    meta: {
      ...meta,
      wilayah: enriched.wilayah,
    },
    data: enriched.data,
  }
}
