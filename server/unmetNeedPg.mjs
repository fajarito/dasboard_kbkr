/**
 * Live Unmet Need aggregation against Postgres
 *   dwh_siga.fa_laporan_dallap_bulanan_tabel10_20rdk (default)
 *
 * Same formula as fixture path:
 *   (hamil_ihn + hamil_tial + tdkhamil_ihn + tdkhamil_tial) / status_pus_true * 100
 */

import { getPool, resolveTableName } from './db.mjs'
import { omitNullish } from './omitNullish.mjs'
import { enrichFromPgDims } from './wilayahPg.mjs'

const FORMULA =
  '(hamil_ihn + hamil_tial + tdkhamil_ihn + tdkhamil_tial) / status_pus_true * 100'

function parseFilters(query) {
  const level = String(query.level || 'nasional').toLowerCase()
  if (!['nasional', 'provinsi', 'kabupaten'].includes(level)) {
    const err = new Error('level must be nasional|provinsi|kabupaten')
    err.status = 400
    throw err
  }

  const tahun =
    query.tahun != null && query.tahun !== '' ? Number(query.tahun) : null
  const bulan =
    query.bulan != null && query.bulan !== '' ? Number(query.bulan) : null
  const id_provinsi =
    query.id_provinsi != null && query.id_provinsi !== ''
      ? Number(query.id_provinsi)
      : null
  const id_kabupaten =
    query.id_kabupaten != null && query.id_kabupaten !== ''
      ? Number(query.id_kabupaten)
      : null

  return { level, tahun, bulan, id_provinsi, id_kabupaten }
}

function buildWhere(filters) {
  const clauses = []
  const params = []

  if (filters.tahun != null) {
    params.push(filters.tahun)
    clauses.push(`tahun_rekap = $${params.length}`)
  }
  if (filters.bulan != null) {
    params.push(filters.bulan)
    clauses.push(`bulan_rekap = $${params.length}`)
  }
  if (filters.id_provinsi != null) {
    params.push(filters.id_provinsi)
    clauses.push(`id_provinsi = $${params.length}`)
  }
  if (filters.id_kabupaten != null) {
    params.push(filters.id_kabupaten)
    clauses.push(`id_kabupaten = $${params.length}`)
  }

  const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  return { whereSql, params }
}

const NUMERATOR_SQL = `(
  COALESCE(hamil_ihn, 0)
  + COALESCE(hamil_tial, 0)
  + COALESCE(tdkhamil_ihn, 0)
  + COALESCE(tdkhamil_tial, 0)
)`

const DENOMINATOR_SQL = `COALESCE(status_pus_true, 0)`

function pctExpr(numAlias = 'numerator', denAlias = 'denominator') {
  return `CASE
    WHEN SUM(${DENOMINATOR_SQL}) = 0 THEN NULL
    ELSE SUM(${NUMERATOR_SQL})::numeric / SUM(${DENOMINATOR_SQL}) * 100
  END AS unmet_need_pct`
}

function mapRow(level, row) {
  const numerator = Number(row.numerator) || 0
  const denominator = Number(row.denominator) || 0
  const pct =
    row.unmet_need_pct == null || row.unmet_need_pct === ''
      ? null
      : Number(row.unmet_need_pct)

  return {
    level,
    id_provinsi:
      row.id_provinsi == null || row.id_provinsi === ''
        ? null
        : Number(row.id_provinsi),
    id_kabupaten:
      row.id_kabupaten == null || row.id_kabupaten === ''
        ? null
        : Number(row.id_kabupaten),
    numerator,
    denominator,
    unmet_need_pct: pct != null && Number.isFinite(pct) ? pct : null,
    row_count: Number(row.row_count) || 0,
  }
}

/**
 * @param {{ level?: string, tahun?: string|number, bulan?: string|number, id_provinsi?: string|number, id_kabupaten?: string|number }} query
 */
export async function queryUnmetNeedFromPg(query) {
  const pool = getPool()
  if (!pool) {
    const err = new Error('Postgres is not configured')
    err.status = 503
    throw err
  }

  const filters = parseFilters(query)
  const table = resolveTableName()
  const { whereSql, params } = buildWhere(filters)

  let selectSql
  if (filters.level === 'nasional') {
    selectSql = `
      SELECT
        NULL::int AS id_provinsi,
        NULL::int AS id_kabupaten,
        SUM(${NUMERATOR_SQL}) AS numerator,
        SUM(${DENOMINATOR_SQL}) AS denominator,
        ${pctExpr()},
        COUNT(*)::int AS row_count
      FROM ${table}
      ${whereSql}
    `
  } else if (filters.level === 'provinsi') {
    selectSql = `
      SELECT
        id_provinsi,
        NULL::int AS id_kabupaten,
        SUM(${NUMERATOR_SQL}) AS numerator,
        SUM(${DENOMINATOR_SQL}) AS denominator,
        ${pctExpr()},
        COUNT(*)::int AS row_count
      FROM ${table}
      ${whereSql}
      GROUP BY id_provinsi
      ORDER BY id_provinsi
    `
  } else {
    selectSql = `
      SELECT
        id_provinsi,
        id_kabupaten,
        SUM(${NUMERATOR_SQL}) AS numerator,
        SUM(${DENOMINATOR_SQL}) AS denominator,
        ${pctExpr()},
        COUNT(*)::int AS row_count
      FROM ${table}
      ${whereSql}
      GROUP BY id_provinsi, id_kabupaten
      ORDER BY id_provinsi, id_kabupaten
    `
  }

  const result = await pool.query(selectSql, params)
  const baseData =
    filters.level === 'nasional'
      ? [mapRow('nasional', result.rows[0] || {
          id_provinsi: null,
          id_kabupaten: null,
          numerator: 0,
          denominator: 0,
          unmet_need_pct: null,
          row_count: 0,
        })]
      : result.rows.map((row) => mapRow(filters.level, row))

  const enriched = await enrichFromPgDims(baseData, filters.tahun)
  const matched_rows = enriched.data.reduce(
    (sum, row) => sum + (row.row_count || 0),
    0,
  )

  return omitNullish({
    meta: {
      source: 'postgres',
      table,
      formula: FORMULA,
      filters: {
        level: filters.level,
        tahun_rekap: filters.tahun,
        bulan_rekap: filters.bulan,
        id_provinsi: filters.id_provinsi,
        id_kabupaten: filters.id_kabupaten,
        period_mode: filters.bulan != null ? 'bulanan' : 'tahunan_rollup',
      },
      matched_rows,
      wilayah: enriched.wilayah,
    },
    data: enriched.data,
  })
}
