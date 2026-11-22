export type UnmetNeedLevel = 'nasional' | 'provinsi' | 'kabupaten'

export type UnmetNeedRow = {
  level: UnmetNeedLevel
  id_provinsi: number | null
  id_kabupaten: number | null
  nama_provinsi?: string | null
  kode_provinsi?: string | null
  nama_kabupaten?: string | null
  kode_kabupaten?: string | null
  numerator: number
  denominator: number
  unmet_need_pct: number | null
  row_count: number
}

export type UnmetNeedResponse = {
  meta: {
    /** postgres | fixture | excel-dummy */
    source: string
    table?: string
    fixture_note?: string
    formula: string
    filters: {
      level: string
      tahun_rekap: number | null
      bulan_rekap: number | null
      id_provinsi: number | null
      id_kabupaten: number | null
      period_mode: string
    }
    matched_rows: number
    wilayah?: {
      source?: string
      dim_tahun_requested?: number | null
      dim_tahun_provinsi?: number | null
      dim_tahun_kabupaten?: number | null
      note?: string
      tables?: { d_provinsi?: string | null; d_kabupaten?: string | null }
    }
  }
  data: UnmetNeedRow[]
}

export type UnmetNeedQuery = {
  level: UnmetNeedLevel
  tahun?: number
  bulan?: number
  id_provinsi?: number
  id_kabupaten?: number
}

function buildUrl(query: UnmetNeedQuery): string {
  const params = new URLSearchParams()
  params.set('level', query.level)
  if (query.tahun != null) params.set('tahun', String(query.tahun))
  if (query.bulan != null) params.set('bulan', String(query.bulan))
  if (query.id_provinsi != null) params.set('id_provinsi', String(query.id_provinsi))
  if (query.id_kabupaten != null)
    params.set('id_kabupaten', String(query.id_kabupaten))
  return `/api/unmet-need?${params.toString()}`
}

/** Fetch Unmet Need aggregates. Returns null when API is unavailable. */
export async function fetchUnmetNeed(
  query: UnmetNeedQuery,
  signal?: AbortSignal,
): Promise<UnmetNeedResponse | null> {
  try {
    const res = await fetch(buildUrl(query), { signal })
    if (!res.ok) return null
    return (await res.json()) as UnmetNeedResponse
  } catch {
    return null
  }
}

export function formatUnmetNeedPct(pct: number | null | undefined): string {
  if (pct == null || !Number.isFinite(pct)) return '—'
  return `${pct.toLocaleString('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`
}

/**
 * Prefer dim names from API; fall back to ids only (never invent names).
 */
export function wilayahLabelFromIds(row: UnmetNeedRow): string {
  if (row.level === 'nasional') return 'Nasional'
  if (row.level === 'provinsi') {
    if (row.nama_provinsi) {
      return row.kode_provinsi
        ? `${row.nama_provinsi} (${row.kode_provinsi})`
        : row.nama_provinsi
    }
    return `Provinsi id ${row.id_provinsi}`
  }
  if (row.nama_kabupaten) {
    const kab = row.kode_kabupaten
      ? `${row.nama_kabupaten} (${row.kode_kabupaten})`
      : row.nama_kabupaten
    return row.nama_provinsi ? `${kab} · ${row.nama_provinsi}` : kab
  }
  return `Kabupaten id ${row.id_kabupaten} (prov ${row.id_provinsi})`
}
