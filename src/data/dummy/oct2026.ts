/**
 * Oktober 2026 Excel dummy (Tabel10 / Tabel11 / Tabel16) — nasional + 38 provinsi.
 * Source of truth: internal/dummy-oct2026/oct2026-dummy.json (copied to oct2026.json).
 *
 * Prefer this for UI default. Set VITE_USE_LIVE_API=true to hit /api (Postgres / sample).
 */
import raw from './oct2026.json'

export const OCT2026_BULAN = 10
export const OCT2026_TAHUN = 2026
export const OCT2026_LABEL = 'Oktober 2026'
export const OCT2026_SOURCE_CAPTION =
  'Dummy Excel Oct 2026 (Tabel10/11/16 · nasional + 38 Provinsi)'

export type Oct2026Period = {
  bulan_rekap: number
  tahun_rekap: number
  label: string
}

export type Oct2026Tabel10 = {
  kode: string
  provinsi: string
  jumlah_pus: number
  jkn_pbi: number
  jkn_non_pbi: number
  jkn_total: number
  non_jkn: number
  tidak_jaminan: number
}

export type Oct2026Tabel11 = {
  kode: string
  provinsi: string
  peserta_kb_aktif: number
  suntik: number
  pil: number
  kondom: number
  implan: number
  iud: number
  vasektomi: number
  tubektomi: number
  mal: number
  total_modern: number
  tradisional: number
}

export type Oct2026Tabel16 = {
  kode: string
  provinsi: string
  jumlah_pus: number
  hamil_ingin_segera: number
  hamil_ihn: number
  hamil_tial: number
  tdkhamil_ingin_segera: number
  tdkhamil_ihn: number
  tdkhamil_tial: number
  jumlah_unmet_need: number
  calc_unmet: number
  unmet_need_pct: number
  match_col10: boolean
}

export type Oct2026Nasional = {
  jumlah_pus: number
  unmet_need: number
  unmet_need_pct: number
  peserta_kb_aktif_modern: number
  mcpr_pct: number
}

export type Oct2026Dummy = {
  period: Oct2026Period
  tabel10_pus: Oct2026Tabel10[]
  tabel11_kb_aktif: Oct2026Tabel11[]
  tabel16_unmet_need: Oct2026Tabel16[]
  nasional: Oct2026Nasional
  formulas: {
    unmet_need: string
    unmet_need_note: string
    mcpr_proxy: string
  }
}

export const oct2026Dummy = raw as Oct2026Dummy

/** UI default: Excel dummy. Live API only when VITE_USE_LIVE_API=true. */
export function preferOct2026Dummy(): boolean {
  return import.meta.env.VITE_USE_LIVE_API !== 'true'
}

export function formatPctId(
  pct: number | null | undefined,
  digits = 1,
): string {
  if (pct == null || !Number.isFinite(pct)) return '—'
  return `${pct.toLocaleString('id-ID', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`
}

/** Unmet Need % — excludes “ingin segera”; matches Tabel16 col10 / PUS. */
export function unmetNeedPct(row: {
  hamil_ihn: number
  hamil_tial: number
  tdkhamil_ihn: number
  tdkhamil_tial: number
  jumlah_pus: number
}): number | null {
  if (!row.jumlah_pus) return null
  const num =
    row.hamil_ihn +
    row.hamil_tial +
    row.tdkhamil_ihn +
    row.tdkhamil_tial
  return (num / row.jumlah_pus) * 100
}

/** mCPR proxy: Tabel11 total_modern / Tabel10 jumlah_pus. */
export function mcprPct(totalModern: number, jumlahPus: number): number | null {
  if (!jumlahPus) return null
  return (totalModern / jumlahPus) * 100
}

export type ProvinceIndicatorRow = {
  kode: string
  provinsi: string
  jumlah_pus: number
  numerator: number
  pct: number
}

export function unmetNeedProvinceRows(): ProvinceIndicatorRow[] {
  return oct2026Dummy.tabel16_unmet_need.map((row) => ({
    kode: row.kode,
    provinsi: row.provinsi,
    jumlah_pus: row.jumlah_pus,
    numerator: row.jumlah_unmet_need,
    pct: row.unmet_need_pct,
  }))
}

export function mcprProvinceRows(): ProvinceIndicatorRow[] {
  const pusByKode = new Map(
    oct2026Dummy.tabel10_pus.map((r) => [r.kode, r.jumlah_pus]),
  )
  return oct2026Dummy.tabel11_kb_aktif.map((row) => {
    const jumlah_pus = pusByKode.get(row.kode) ?? 0
    const pct = mcprPct(row.total_modern, jumlah_pus) ?? 0
    return {
      kode: row.kode,
      provinsi: row.provinsi,
      jumlah_pus,
      numerator: row.total_modern,
      pct: Math.round(pct * 10000) / 10000,
    }
  })
}

export function rankedProvinces(
  rows: ProvinceIndicatorRow[],
  order: 'asc' | 'desc' = 'desc',
  limit = 5,
): ProvinceIndicatorRow[] {
  const sorted = [...rows].sort((a, b) =>
    order === 'desc' ? b.pct - a.pct : a.pct - b.pct,
  )
  return sorted.slice(0, limit)
}

/** mCPR coverage bands across 38 provinces (same thresholds as Overview donut). */
export function mcprCoverageBands(): {
  key: string
  label: string
  value: number
  color: string
}[] {
  const rows = mcprProvinceRows()
  let high = 0
  let mid = 0
  let low = 0
  let crit = 0
  for (const row of rows) {
    if (row.pct >= 60) high += 1
    else if (row.pct >= 40) mid += 1
    else if (row.pct >= 20) low += 1
    else crit += 1
  }
  return [
    { key: 'high', label: '≥ 60%', value: high, color: '#377887' },
    { key: 'mid', label: '40–59%', value: mid, color: '#4ba09b' },
    { key: 'low', label: '20–39%', value: low, color: '#e6b44b' },
    { key: 'crit', label: '< 20%', value: crit, color: '#c34b46' },
  ]
}

export type DummyUnmetNeedRow = {
  level: 'nasional' | 'provinsi' | 'kabupaten'
  id_provinsi: number | null
  id_kabupaten: number | null
  nama_provinsi?: string | null
  kode_provinsi?: string | null
  numerator: number
  denominator: number
  unmet_need_pct: number | null
  row_count: number
}

export type DummyUnmetNeedResponse = {
  meta: {
    source: 'excel-dummy'
    fixture_note: string
    formula: string
    filters: {
      level: string
      tahun_rekap: number
      bulan_rekap: number
      id_provinsi: null
      id_kabupaten: null
      period_mode: 'bulanan'
    }
    matched_rows: number
  }
  data: DummyUnmetNeedRow[]
}

/** Shape compatible with Unmet Need detail page (no kabupaten in this share). */
export function buildUnmetNeedDummyResponse(
  level: 'nasional' | 'provinsi' | 'kabupaten',
): DummyUnmetNeedResponse {
  const { nasional, formulas, tabel16_unmet_need } = oct2026Dummy
  const meta = {
    source: 'excel-dummy' as const,
    fixture_note: OCT2026_SOURCE_CAPTION,
    formula: formulas.unmet_need,
    filters: {
      level,
      tahun_rekap: OCT2026_TAHUN,
      bulan_rekap: OCT2026_BULAN,
      id_provinsi: null,
      id_kabupaten: null,
      period_mode: 'bulanan' as const,
    },
    matched_rows:
      level === 'nasional'
        ? 1
        : level === 'provinsi'
          ? tabel16_unmet_need.length
          : 0,
  }

  if (level === 'kabupaten') {
    return { meta, data: [] }
  }

  if (level === 'nasional') {
    return {
      meta,
      data: [
        {
          level: 'nasional',
          id_provinsi: null,
          id_kabupaten: null,
          numerator: nasional.unmet_need,
          denominator: nasional.jumlah_pus,
          unmet_need_pct: nasional.unmet_need_pct,
          row_count: tabel16_unmet_need.length,
        },
      ],
    }
  }

  return {
    meta,
    data: tabel16_unmet_need.map((row, index) => ({
      level: 'provinsi' as const,
      id_provinsi: index + 1,
      id_kabupaten: null,
      nama_provinsi: row.provinsi,
      kode_provinsi: row.kode,
      numerator: row.jumlah_unmet_need,
      denominator: row.jumlah_pus,
      unmet_need_pct: row.unmet_need_pct,
      row_count: 1,
    })),
  }
}

export type DummyMcprResponse = {
  meta: {
    source: 'excel-dummy'
    fixture_note: string
    formula: string
    filters: {
      level: string
      tahun_rekap: number
      bulan_rekap: number
      period_mode: 'bulanan'
    }
  }
  data: Array<{
    level: 'nasional' | 'provinsi'
    nama_provinsi?: string
    kode_provinsi?: string
    numerator: number
    denominator: number
    mcpr_pct: number | null
  }>
}

export function buildMcprDummyResponse(
  level: 'nasional' | 'provinsi' | 'kabupaten',
): DummyMcprResponse {
  const { nasional, formulas } = oct2026Dummy
  const meta = {
    source: 'excel-dummy' as const,
    fixture_note: OCT2026_SOURCE_CAPTION,
    formula: formulas.mcpr_proxy,
    filters: {
      level,
      tahun_rekap: OCT2026_TAHUN,
      bulan_rekap: OCT2026_BULAN,
      period_mode: 'bulanan' as const,
    },
  }

  if (level === 'kabupaten') {
    return { meta: { ...meta, filters: { ...meta.filters, level: 'kabupaten' } }, data: [] }
  }

  if (level === 'nasional') {
    return {
      meta,
      data: [
        {
          level: 'nasional',
          numerator: nasional.peserta_kb_aktif_modern,
          denominator: nasional.jumlah_pus,
          mcpr_pct: nasional.mcpr_pct,
        },
      ],
    }
  }

  return {
    meta,
    data: mcprProvinceRows().map((row) => ({
      level: 'provinsi' as const,
      nama_provinsi: row.provinsi,
      kode_provinsi: row.kode,
      numerator: row.numerator,
      denominator: row.jumlah_pus,
      mcpr_pct: row.pct,
    })),
  }
}
