/**
 * Load wilayah dims from year-suffixed Postgres tables:
 *   dwh_siga.d_provinsi_YYYY / dwh_siga.d_kabupaten_YYYY
 * Exact year matching tahun_rekap; else nearest available year table.
 */

import { getPool } from './db.mjs'
import {
  buildWilayahLookup,
  enrichRowsWithWilayah,
  pickNearestYear,
} from './wilayah.mjs'

const DEFAULT_SCHEMA = 'dwh_siga'

export function resolveDimSchema(raw = process.env.DIM_SCHEMA) {
  const schema = (raw || DEFAULT_SCHEMA).trim()
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(schema)) {
    throw new Error(`Invalid DIM_SCHEMA "${schema}"`)
  }
  return schema
}

function yearTableName(schema, base, year) {
  return `${schema}.${base}_${year}`
}

async function listDimYears(pool, schema, base) {
  // Year-suffixed physical tables: d_provinsi_2023, …
  const result = await pool.query(
    `
    SELECT
      CASE
        WHEN c.relname ~ $2 THEN (regexp_match(c.relname, $2))[1]::int
        ELSE NULL
      END AS tahun
    FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = $1
      AND c.relkind IN ('r', 'p')
      AND c.relname ~ $2
    `,
    [schema, `^${base}_([0-9]{4})$`],
  )
  return result.rows
    .map((r) => Number(r.tahun))
    .filter((y) => Number.isFinite(y) && y < 2999)
    .sort((a, b) => a - b)
}

async function tableExists(pool, schema, table) {
  const result = await pool.query(`SELECT to_regclass($1) AS reg`, [
    `${schema}.${table}`,
  ])
  return Boolean(result.rows[0]?.reg)
}

async function resolveDimYear(pool, schema, base, tahunRequested) {
  const years = await listDimYears(pool, schema, base)
  const chosen = pickNearestYear(tahunRequested, years)
  if (chosen == null) return { year: null, table: null, available: years }

  const shortName = `${base}_${chosen}`
  if (!(await tableExists(pool, schema, shortName))) {
    return { year: null, table: null, available: years }
  }
  return {
    year: chosen,
    table: yearTableName(schema, base, chosen),
    available: years,
  }
}

async function loadProvinsiRows(pool, table) {
  const result = await pool.query(
    `
    SELECT id_provinsi, kode_provinsi, nama_provinsi, tahun
    FROM ${table}
    `,
  )
  return result.rows
}

async function loadKabupatenRows(pool, table) {
  const result = await pool.query(
    `
    SELECT id_kabupaten, kode_kabupaten, nama_kabupaten, id_provinsi, tahun
    FROM ${table}
    `,
  )
  return result.rows
}

/**
 * @param {object[]} rows aggregated unmet-need rows
 * @param {number|null} tahunRequested tahun_rekap (or null → latest dim year)
 */
export async function enrichFromPgDims(rows, tahunRequested) {
  const pool = getPool()
  if (!pool) {
    const err = new Error('Postgres is not configured')
    err.status = 503
    throw err
  }

  const schema = resolveDimSchema()
  const provRes = await resolveDimYear(pool, schema, 'd_provinsi', tahunRequested)
  const kabRes = await resolveDimYear(pool, schema, 'd_kabupaten', tahunRequested)

  const provinsi =
    provRes.table != null ? await loadProvinsiRows(pool, provRes.table) : []
  const kabupaten =
    kabRes.table != null ? await loadKabupatenRows(pool, kabRes.table) : []

  // buildWilayahLookup expects rows tagged with tahun; year tables already
  // correspond to one year — stamp them so the lookup filter matches.
  const provTagged = provinsi.map((r) => ({
    ...r,
    tahun: Number(r.tahun) || provRes.year,
  }))
  const kabTagged = kabupaten.map((r) => ({
    ...r,
    tahun: Number(r.tahun) || kabRes.year,
  }))

  const lookup = buildWilayahLookup(
    provTagged,
    kabTagged,
    tahunRequested ?? provRes.year ?? kabRes.year,
  )

  return {
    data: enrichRowsWithWilayah(rows, lookup),
    wilayah: {
      source: 'postgres',
      schema,
      dim_tahun_requested: tahunRequested ?? null,
      dim_tahun_provinsi: provRes.year,
      dim_tahun_kabupaten: kabRes.year,
      tables: {
        d_provinsi: provRes.table,
        d_kabupaten: kabRes.table,
      },
      available_years: {
        d_provinsi: provRes.available,
        d_kabupaten: kabRes.available,
      },
    },
  }
}
