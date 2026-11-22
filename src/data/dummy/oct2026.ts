/**
 * Oktober 2026 Excel dummy (Tabel1 / Tabel2 / Tabel3 / Tabel10 / Tabel11 / Tabel16 / Tabel20)
 * — nasional + 38 provinsi (Tabel20 Wilayah Khusus: only 15 provinces).
 * Source of truth: internal/dummy-oct2026
 * (Tabel1 → 4T + KBPP Tanpa MAL; T10/11/16 → unmet/mCPR; T16 hamil_tial → KTD;
 *  T11+T16 → Demand Satisfied; Tabel2+3+Tabel10_v3 KB ulangan → MII;
 *  Tabel3+Tabel10_v3 KB ulangan → MKJP; Tabel20 kabupaten tertinggal → Wilayah Khusus).
 *
 * Prefer this for UI default. Set VITE_USE_LIVE_API=true to hit /api (Postgres / sample).
 */
import raw from './oct2026.json'

export const OCT2026_BULAN = 10
export const OCT2026_TAHUN = 2026
export const OCT2026_LABEL = 'Oktober 2026'
export const OCT2026_SOURCE_CAPTION =
  'Dummy Excel Oct 2026 (Tabel1/2/3/10/11/16/20 · nasional + 38 Provinsi)'
export const OCT2026_SOURCE_CAPTION_4T =
  'Dummy Excel Tabel1 Oct 2026 (nasional + 38 Provinsi)'
export const OCT2026_SOURCE_CAPTION_KBPP =
  'Dummy Excel Tabel1 KBPP Oct 2026 (nasional + 38 Provinsi)'
export const OCT2026_SOURCE_CAPTION_MII =
  'Dummy Excel Tabel2/3/10 Oct 2026 (nasional + 38 Provinsi)'
export const OCT2026_SOURCE_CAPTION_MKJP =
  'Dummy Excel Tabel3/10 Oct 2026 (nasional + 38 Provinsi)'
export const OCT2026_SOURCE_CAPTION_WILAYAH_KHUSUS =
  'Dummy Excel Tabel20 Oct 2026 (nasional + 15 Provinsi · kabupaten tertinggal)'

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

export type Oct2026Tabel1FourT = {
  kode: string
  provinsi: string
  jumlah_bumil: number
  terlalu_muda: number
  terlalu_tua: number
  terlalu_dekat: number
  terlalu_banyak: number
  jumlah_bumil_4t: number
  pct_4t: number
  pct_terlalu_muda: number
  pct_terlalu_tua: number
  pct_terlalu_dekat: number
  pct_terlalu_banyak: number
}

export type Oct2026Nasional = {
  jumlah_pus: number
  unmet_need: number
  unmet_need_pct: number
  peserta_kb_aktif_modern: number
  mcpr_pct: number
  /** KTD count = sum of Tabel16 hamil_tial (not a percent). */
  ktd: number
  /** modern / (modern + unmet_need) * 100 */
  demand_satisfied_pct: number
  jumlah_bumil: number
  terlalu_muda: number
  terlalu_tua: number
  terlalu_dekat: number
  terlalu_banyak: number
  jumlah_bumil_4t: number
  pct_4t: number
  pct_terlalu_muda: number
  pct_terlalu_tua: number
  pct_terlalu_dekat: number
  pct_terlalu_banyak: number
  /** Tabel2 informed consent KB baru (selected methods). */
  mii_ic_baru: number
  /** Tabel2 informed consent KB ulangan. */
  mii_ic_ulangan: number
  /** Tabel3 KB baru selected (exclude pil & kondom). */
  mii_denom_baru: number
  /**
   * Tabel10 KB ulangan selected (suntik+implan+IUD).
   * Vasektomi/tubektomi absent in this Excel — treated as 0.
   */
  mii_denom_ulangan: number
  mii_numerator: number
  mii_denominator: number
  /** (ic_baru + ic_ulangan) / (denom_baru + denom_ulangan) * 100 */
  mii_pct: number
  /** Tabel3 MKJP methods KB baru (IUD+Implan+Vasektomi+Tubektomi). */
  mkjp_baru: number
  /** Tabel10 KB ulangan MKJP (Implan+IUD; vasektomi/tubektomi absent → 0). */
  mkjp_ulangan: number
  /** Tabel3 jumlah KB baru (all methods). */
  mkjp_total_baru: number
  /** Tabel10 jumlah KB ulangan. */
  mkjp_total_ulangan: number
  mkjp_numerator: number
  mkjp_denominator: number
  /** (mkjp_baru + mkjp_ulangan) / (total_baru + total_ulangan) * 100 */
  mkjp_pct: number
  /** Tabel20 jumlah peserta KB aktif di kabupaten tertinggal. */
  wilayah_khusus_jumlah_kb_aktif: number
  wilayah_khusus_kondom: number
  wilayah_khusus_vasektomi: number
  /** kondom + vasektomi */
  wilayah_khusus_numerator: number
  /** (kondom + vasektomi) / jumlah_kb_aktif * 100 — only 15 provinces in Tabel20 */
  wilayah_khusus_pct: number
  /** Tabel1 Ibu pasca persalinan (denominator KBPP). */
  jumlah_ibu_pasca_persalinan: number
  /** ber_kb from Tabel1 (includes MAL + tradisional). */
  kbpp_ber_kb: number
  kbpp_mal: number
  kbpp_tradisional: number
  /** IUD+MOW+MOP+Implan+Suntik+Pil+Kondom (= ber_kb − MAL − tradisional). */
  kbpp_numerator: number
  /** kbpp_numerator / jumlah_ibu_pasca_persalinan * 100 */
  kbpp_tanpa_mal_pct: number
}

export type Oct2026KtdDemandRow = {
  kode: string
  provinsi: string
  ktd: number
  modern: number
  unmet_need: number
  demand_satisfied_pct: number
}

/**
 * MII province row from Tabel2 (IC) + Tabel3 (KB baru selected) + Tabel10_v3 (KB ulangan).
 * Tabel10 KB ulangan Excel has no vasektomi/tubektomi columns — ulang_* for those are 0.
 */
export type Oct2026MiiRow = {
  kode: string
  provinsi: string
  ic_baru: number
  ic_ulangan: number
  denom_baru: number
  denom_ulangan: number
  /** Always 0 in this Excel share (no column). */
  ulang_vasektomi: number
  /** Always 0 in this Excel share (no column). */
  ulang_tubektomi: number
  numerator: number
  denominator: number
  mii_pct: number
}

/**
 * MKJP province row from Tabel3 (KB baru MKJP methods) + Tabel10_v3 (KB ulangan).
 * Tabel10 KB ulangan Excel has no vasektomi/tubektomi columns — those contribute 0.
 */
export type Oct2026MkjpRow = {
  kode: string
  provinsi: string
  mkjp_baru: number
  total_baru: number
  mkjp_ulangan: number
  total_ulangan: number
  numerator: number
  denominator: number
  mkjp_pct: number
}

/**
 * Wilayah Khusus province row from Tabel20 (PESERTA KB AKTIF PADA KABUPATEN TERTINGGAL).
 * Only 15 provinces appear in this table — do not invent the rest.
 */
export type Oct2026WilayahKhususRow = {
  kode: string
  provinsi: string
  jumlah_kb_aktif: number
  kondom: number
  vasektomi: number
  /** kondom + vasektomi */
  numerator: number
  wilayah_khusus_pct: number
  suntik: number
  pil: number
  implan: number
  iud: number
  tubektomi: number
  mal: number
  total_modern: number
  tradisional: number
}

/**
 * KBPP (Tanpa MAL) province row from Tabel1 (Ibu pasca persalinan menurut kesertaan ber-KB).
 * Numerator excludes MAL + Tradisional.
 */
export type Oct2026KbppRow = {
  kode: string
  provinsi: string
  jumlah_ibu_pasca_persalinan: number
  ber_kb: number
  iud: number
  mow: number
  mop: number
  implan: number
  suntik: number
  pil: number
  kondom: number
  mal: number
  tradisional: number
  /** IUD+MOW+MOP+Implan+Suntik+Pil+Kondom */
  numerator: number
  kbpp_tanpa_mal_pct: number
}

export type Oct2026Dummy = {
  period: Oct2026Period
  tabel10_pus: Oct2026Tabel10[]
  tabel11_kb_aktif: Oct2026Tabel11[]
  tabel16_unmet_need: Oct2026Tabel16[]
  tabel1_4t: Oct2026Tabel1FourT[]
  ktd_demand_satisfied: Oct2026KtdDemandRow[]
  mii: Oct2026MiiRow[]
  mkjp: Oct2026MkjpRow[]
  tabel20_wilayah_khusus: Oct2026WilayahKhususRow[]
  kbpp_tanpa_mal: Oct2026KbppRow[]
  nasional: Oct2026Nasional
  formulas: {
    unmet_need: string
    unmet_need_note: string
    mcpr_proxy: string
    pct_4t: string
    pct_4t_note: string
    tabel1_source: string
    ktd: string
    ktd_note: string
    demand_satisfied: string
    demand_satisfied_note: string
    mii_pct: string
    mii_note: string
    mii_sources: string
    mkjp_pct: string
    mkjp_note: string
    mkjp_sources: string
    mkjp_methods: string
    wilayah_khusus: string
    wilayah_khusus_note: string
    tabel20_source: string
    kbpp_tanpa_mal_pct: string
    kbpp_tanpa_mal_note: string
    kbpp_tanpa_mal_source: string
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

/** Integer count for KTD (id-ID grouping). */
export function formatCountId(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—'
  return n.toLocaleString('id-ID')
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

/**
 * Demand Satisfied % = modern / (modern + unmet_need) * 100.
 * modern = Tabel11 total_modern; unmet_need = Tabel16 jumlah_unmet_need.
 */
export function demandSatisfiedPct(
  modern: number,
  unmetNeed: number,
): number | null {
  const denom = modern + unmetNeed
  if (!denom) return null
  return (modern / denom) * 100
}

/** KTD = Tabel16 hamil_tial (count). */
export function ktdCount(hamilTial: number): number {
  return hamilTial
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

/** Headline 4T % = jumlah_bumil_4t / jumlah_bumil (unique; do not sum components). */
export function fourTPct(jumlahBumil4t: number, jumlahBumil: number): number | null {
  if (!jumlahBumil) return null
  return (jumlahBumil4t / jumlahBumil) * 100
}

export function fourTProvinceRows(): ProvinceIndicatorRow[] {
  return oct2026Dummy.tabel1_4t.map((row) => ({
    kode: row.kode,
    provinsi: row.provinsi,
    jumlah_pus: row.jumlah_bumil,
    numerator: row.jumlah_bumil_4t,
    pct: row.pct_4t,
  }))
}

export type KtdProvinceRow = {
  kode: string
  provinsi: string
  ktd: number
}

export function ktdProvinceRows(): KtdProvinceRow[] {
  return oct2026Dummy.ktd_demand_satisfied.map((row) => ({
    kode: row.kode,
    provinsi: row.provinsi,
    ktd: row.ktd,
  }))
}

export type DemandSatisfiedProvinceRow = {
  kode: string
  provinsi: string
  modern: number
  unmet_need: number
  pct: number
}

export function demandSatisfiedProvinceRows(): DemandSatisfiedProvinceRow[] {
  return oct2026Dummy.ktd_demand_satisfied.map((row) => ({
    kode: row.kode,
    provinsi: row.provinsi,
    modern: row.modern,
    unmet_need: row.unmet_need,
    pct: row.demand_satisfied_pct,
  }))
}

export type FourTComponentKey =
  | 'terlalu_muda'
  | 'terlalu_tua'
  | 'terlalu_dekat'
  | 'terlalu_banyak'

export type FourTComponentRow = {
  key: FourTComponentKey
  label: string
  count: number
  pct: number
}

export function fourTNasionalComponents(): FourTComponentRow[] {
  const n = oct2026Dummy.nasional
  return [
    {
      key: 'terlalu_muda',
      label: 'Terlalu Muda (<20)',
      count: n.terlalu_muda,
      pct: n.pct_terlalu_muda,
    },
    {
      key: 'terlalu_tua',
      label: 'Terlalu Tua (≥35)',
      count: n.terlalu_tua,
      pct: n.pct_terlalu_tua,
    },
    {
      key: 'terlalu_dekat',
      label: 'Terlalu Dekat (<2 thn)',
      count: n.terlalu_dekat,
      pct: n.pct_terlalu_dekat,
    },
    {
      key: 'terlalu_banyak',
      label: 'Terlalu Banyak (>3 anak)',
      count: n.terlalu_banyak,
      pct: n.pct_terlalu_banyak,
    },
  ]
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

export type DummyFourTResponse = {
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
    pct_4t: number | null
    terlalu_muda?: number
    terlalu_tua?: number
    terlalu_dekat?: number
    terlalu_banyak?: number
    pct_terlalu_muda?: number
    pct_terlalu_tua?: number
    pct_terlalu_dekat?: number
    pct_terlalu_banyak?: number
  }>
}

export function buildFourTDummyResponse(
  level: 'nasional' | 'provinsi' | 'kabupaten',
): DummyFourTResponse {
  const { nasional, formulas, tabel1_4t } = oct2026Dummy
  const meta = {
    source: 'excel-dummy' as const,
    fixture_note: OCT2026_SOURCE_CAPTION_4T,
    formula: formulas.pct_4t,
    filters: {
      level,
      tahun_rekap: OCT2026_TAHUN,
      bulan_rekap: OCT2026_BULAN,
      period_mode: 'bulanan' as const,
    },
  }

  if (level === 'kabupaten') {
    return {
      meta: { ...meta, filters: { ...meta.filters, level: 'kabupaten' } },
      data: [],
    }
  }

  if (level === 'nasional') {
    return {
      meta,
      data: [
        {
          level: 'nasional',
          numerator: nasional.jumlah_bumil_4t,
          denominator: nasional.jumlah_bumil,
          pct_4t: nasional.pct_4t,
          terlalu_muda: nasional.terlalu_muda,
          terlalu_tua: nasional.terlalu_tua,
          terlalu_dekat: nasional.terlalu_dekat,
          terlalu_banyak: nasional.terlalu_banyak,
          pct_terlalu_muda: nasional.pct_terlalu_muda,
          pct_terlalu_tua: nasional.pct_terlalu_tua,
          pct_terlalu_dekat: nasional.pct_terlalu_dekat,
          pct_terlalu_banyak: nasional.pct_terlalu_banyak,
        },
      ],
    }
  }

  return {
    meta,
    data: tabel1_4t.map((row) => ({
      level: 'provinsi' as const,
      nama_provinsi: row.provinsi,
      kode_provinsi: row.kode,
      numerator: row.jumlah_bumil_4t,
      denominator: row.jumlah_bumil,
      pct_4t: row.pct_4t,
      terlalu_muda: row.terlalu_muda,
      terlalu_tua: row.terlalu_tua,
      terlalu_dekat: row.terlalu_dekat,
      terlalu_banyak: row.terlalu_banyak,
      pct_terlalu_muda: row.pct_terlalu_muda,
      pct_terlalu_tua: row.pct_terlalu_tua,
      pct_terlalu_dekat: row.pct_terlalu_dekat,
      pct_terlalu_banyak: row.pct_terlalu_banyak,
    })),
  }
}

export type DummyKtdResponse = {
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
    ktd: number
  }>
}

export function buildKtdDummyResponse(
  level: 'nasional' | 'provinsi' | 'kabupaten',
): DummyKtdResponse {
  const { nasional, formulas, ktd_demand_satisfied } = oct2026Dummy
  const meta = {
    source: 'excel-dummy' as const,
    fixture_note: OCT2026_SOURCE_CAPTION,
    formula: formulas.ktd,
    filters: {
      level,
      tahun_rekap: OCT2026_TAHUN,
      bulan_rekap: OCT2026_BULAN,
      period_mode: 'bulanan' as const,
    },
  }

  if (level === 'kabupaten') {
    return {
      meta: { ...meta, filters: { ...meta.filters, level: 'kabupaten' } },
      data: [],
    }
  }

  if (level === 'nasional') {
    return {
      meta,
      data: [{ level: 'nasional', ktd: nasional.ktd }],
    }
  }

  return {
    meta,
    data: ktd_demand_satisfied.map((row) => ({
      level: 'provinsi' as const,
      nama_provinsi: row.provinsi,
      kode_provinsi: row.kode,
      ktd: row.ktd,
    })),
  }
}

export type DummyDemandSatisfiedResponse = {
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
    modern: number
    unmet_need: number
    demand_satisfied_pct: number | null
  }>
}

export function buildDemandSatisfiedDummyResponse(
  level: 'nasional' | 'provinsi' | 'kabupaten',
): DummyDemandSatisfiedResponse {
  const { nasional, formulas, ktd_demand_satisfied } = oct2026Dummy
  const meta = {
    source: 'excel-dummy' as const,
    fixture_note: OCT2026_SOURCE_CAPTION,
    formula: formulas.demand_satisfied,
    filters: {
      level,
      tahun_rekap: OCT2026_TAHUN,
      bulan_rekap: OCT2026_BULAN,
      period_mode: 'bulanan' as const,
    },
  }

  if (level === 'kabupaten') {
    return {
      meta: { ...meta, filters: { ...meta.filters, level: 'kabupaten' } },
      data: [],
    }
  }

  if (level === 'nasional') {
    return {
      meta,
      data: [
        {
          level: 'nasional',
          modern: nasional.peserta_kb_aktif_modern,
          unmet_need: nasional.unmet_need,
          demand_satisfied_pct: nasional.demand_satisfied_pct,
        },
      ],
    }
  }

  return {
    meta,
    data: ktd_demand_satisfied.map((row) => ({
      level: 'provinsi' as const,
      nama_provinsi: row.provinsi,
      kode_provinsi: row.kode,
      modern: row.modern,
      unmet_need: row.unmet_need,
      demand_satisfied_pct: row.demand_satisfied_pct,
    })),
  }
}

/**
 * MII% = (IC_baru + IC_ulangan) / (KB_baru_selected + KB_ulangan_selected) × 100.
 * denom_ulangan excludes vasektomi/tubektomi when Excel has no such columns (treated as 0).
 */
export function miiPct(numerator: number, denominator: number): number | null {
  if (!denominator) return null
  return (numerator / denominator) * 100
}

export function miiProvinceRows(): ProvinceIndicatorRow[] {
  return oct2026Dummy.mii.map((row) => ({
    kode: row.kode,
    provinsi: row.provinsi,
    jumlah_pus: row.denominator,
    numerator: row.numerator,
    pct: row.mii_pct,
  }))
}

export type DummyMiiResponse = {
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
    ic_baru: number
    ic_ulangan: number
    denom_baru: number
    denom_ulangan: number
    numerator: number
    denominator: number
    mii_pct: number | null
  }>
}

export function buildMiiDummyResponse(
  level: 'nasional' | 'provinsi' | 'kabupaten',
): DummyMiiResponse {
  const { nasional, formulas, mii } = oct2026Dummy
  const meta = {
    source: 'excel-dummy' as const,
    fixture_note: OCT2026_SOURCE_CAPTION_MII,
    formula: formulas.mii_pct,
    filters: {
      level,
      tahun_rekap: OCT2026_TAHUN,
      bulan_rekap: OCT2026_BULAN,
      period_mode: 'bulanan' as const,
    },
  }

  if (level === 'kabupaten') {
    return {
      meta: { ...meta, filters: { ...meta.filters, level: 'kabupaten' } },
      data: [],
    }
  }

  if (level === 'nasional') {
    return {
      meta,
      data: [
        {
          level: 'nasional',
          ic_baru: nasional.mii_ic_baru,
          ic_ulangan: nasional.mii_ic_ulangan,
          denom_baru: nasional.mii_denom_baru,
          denom_ulangan: nasional.mii_denom_ulangan,
          numerator: nasional.mii_numerator,
          denominator: nasional.mii_denominator,
          mii_pct: nasional.mii_pct,
        },
      ],
    }
  }

  return {
    meta,
    data: mii.map((row) => ({
      level: 'provinsi' as const,
      nama_provinsi: row.provinsi,
      kode_provinsi: row.kode,
      ic_baru: row.ic_baru,
      ic_ulangan: row.ic_ulangan,
      denom_baru: row.denom_baru,
      denom_ulangan: row.denom_ulangan,
      numerator: row.numerator,
      denominator: row.denominator,
      mii_pct: row.mii_pct,
    })),
  }
}

/**
 * MKJP% = (mkjp_baru + mkjp_ulangan) / (total_baru + total_ulangan) × 100.
 * Methods: IUD+Implan+Vasektomi+Tubektomi. Tabel10 ulangan has no vasektomi/tubektomi → 0.
 */
export function mkjpPct(numerator: number, denominator: number): number | null {
  if (!denominator) return null
  return (numerator / denominator) * 100
}

export function mkjpProvinceRows(): ProvinceIndicatorRow[] {
  return oct2026Dummy.mkjp.map((row) => ({
    kode: row.kode,
    provinsi: row.provinsi,
    jumlah_pus: row.denominator,
    numerator: row.numerator,
    pct: row.mkjp_pct,
  }))
}

export type DummyMkjpResponse = {
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
    mkjp_baru: number
    total_baru: number
    mkjp_ulangan: number
    total_ulangan: number
    numerator: number
    denominator: number
    mkjp_pct: number | null
  }>
}

export function buildMkjpDummyResponse(
  level: 'nasional' | 'provinsi' | 'kabupaten',
): DummyMkjpResponse {
  const { nasional, formulas, mkjp } = oct2026Dummy
  const meta = {
    source: 'excel-dummy' as const,
    fixture_note: OCT2026_SOURCE_CAPTION_MKJP,
    formula: formulas.mkjp_pct,
    filters: {
      level,
      tahun_rekap: OCT2026_TAHUN,
      bulan_rekap: OCT2026_BULAN,
      period_mode: 'bulanan' as const,
    },
  }

  if (level === 'kabupaten') {
    return {
      meta: { ...meta, filters: { ...meta.filters, level: 'kabupaten' } },
      data: [],
    }
  }

  if (level === 'nasional') {
    return {
      meta,
      data: [
        {
          level: 'nasional',
          mkjp_baru: nasional.mkjp_baru,
          total_baru: nasional.mkjp_total_baru,
          mkjp_ulangan: nasional.mkjp_ulangan,
          total_ulangan: nasional.mkjp_total_ulangan,
          numerator: nasional.mkjp_numerator,
          denominator: nasional.mkjp_denominator,
          mkjp_pct: nasional.mkjp_pct,
        },
      ],
    }
  }

  return {
    meta,
    data: mkjp.map((row) => ({
      level: 'provinsi' as const,
      nama_provinsi: row.provinsi,
      kode_provinsi: row.kode,
      mkjp_baru: row.mkjp_baru,
      total_baru: row.total_baru,
      mkjp_ulangan: row.mkjp_ulangan,
      total_ulangan: row.total_ulangan,
      numerator: row.numerator,
      denominator: row.denominator,
      mkjp_pct: row.mkjp_pct,
    })),
  }
}

/**
 * Wilayah Khusus % = (kondom + vasektomi) / jumlah_peserta_kb_aktif × 100.
 * Tabel20 covers kabupaten tertinggal only — 15 provinces, not all 38.
 */
export function wilayahKhususPct(
  kondom: number,
  vasektomi: number,
  jumlahKbAktif: number,
): number | null {
  if (!jumlahKbAktif) return null
  return ((kondom + vasektomi) / jumlahKbAktif) * 100
}

export function wilayahKhususProvinceRows(): ProvinceIndicatorRow[] {
  return oct2026Dummy.tabel20_wilayah_khusus.map((row) => ({
    kode: row.kode,
    provinsi: row.provinsi,
    jumlah_pus: row.jumlah_kb_aktif,
    numerator: row.numerator,
    pct: row.wilayah_khusus_pct,
  }))
}

export type DummyWilayahKhususResponse = {
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
    kondom: number
    vasektomi: number
    numerator: number
    denominator: number
    wilayah_khusus_pct: number | null
  }>
}

export function buildWilayahKhususDummyResponse(
  level: 'nasional' | 'provinsi' | 'kabupaten',
): DummyWilayahKhususResponse {
  const { nasional, formulas, tabel20_wilayah_khusus } = oct2026Dummy
  const meta = {
    source: 'excel-dummy' as const,
    fixture_note: OCT2026_SOURCE_CAPTION_WILAYAH_KHUSUS,
    formula: formulas.wilayah_khusus,
    filters: {
      level,
      tahun_rekap: OCT2026_TAHUN,
      bulan_rekap: OCT2026_BULAN,
      period_mode: 'bulanan' as const,
    },
  }

  if (level === 'kabupaten') {
    return {
      meta: { ...meta, filters: { ...meta.filters, level: 'kabupaten' } },
      data: [],
    }
  }

  if (level === 'nasional') {
    return {
      meta,
      data: [
        {
          level: 'nasional',
          kondom: nasional.wilayah_khusus_kondom,
          vasektomi: nasional.wilayah_khusus_vasektomi,
          numerator: nasional.wilayah_khusus_numerator,
          denominator: nasional.wilayah_khusus_jumlah_kb_aktif,
          wilayah_khusus_pct: nasional.wilayah_khusus_pct,
        },
      ],
    }
  }

  return {
    meta,
    data: tabel20_wilayah_khusus.map((row) => ({
      level: 'provinsi' as const,
      nama_provinsi: row.provinsi,
      kode_provinsi: row.kode,
      kondom: row.kondom,
      vasektomi: row.vasektomi,
      numerator: row.numerator,
      denominator: row.jumlah_kb_aktif,
      wilayah_khusus_pct: row.wilayah_khusus_pct,
    })),
  }
}

/**
 * KBPP (Tanpa MAL)% = (IUD+MOW+MOP+Implan+Suntik+Pil+Kondom) /
 * jumlah_ibu_pasca_persalinan × 100. Excludes MAL + Tradisional
 * (= ber_kb − MAL − tradisional).
 */
export function kbppTanpaMalPct(
  numerator: number,
  jumlahIbuPascaPersalinan: number,
): number | null {
  if (!jumlahIbuPascaPersalinan) return null
  return (numerator / jumlahIbuPascaPersalinan) * 100
}

export function kbppProvinceRows(): ProvinceIndicatorRow[] {
  return oct2026Dummy.kbpp_tanpa_mal.map((row) => ({
    kode: row.kode,
    provinsi: row.provinsi,
    jumlah_pus: row.jumlah_ibu_pasca_persalinan,
    numerator: row.numerator,
    pct: row.kbpp_tanpa_mal_pct,
  }))
}

export type DummyKbppResponse = {
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
    ber_kb: number
    mal: number
    tradisional: number
    numerator: number
    denominator: number
    kbpp_tanpa_mal_pct: number | null
  }>
}

export function buildKbppDummyResponse(
  level: 'nasional' | 'provinsi' | 'kabupaten',
): DummyKbppResponse {
  const { nasional, formulas, kbpp_tanpa_mal } = oct2026Dummy
  const meta = {
    source: 'excel-dummy' as const,
    fixture_note: OCT2026_SOURCE_CAPTION_KBPP,
    formula: formulas.kbpp_tanpa_mal_pct,
    filters: {
      level,
      tahun_rekap: OCT2026_TAHUN,
      bulan_rekap: OCT2026_BULAN,
      period_mode: 'bulanan' as const,
    },
  }

  if (level === 'kabupaten') {
    return {
      meta: { ...meta, filters: { ...meta.filters, level: 'kabupaten' } },
      data: [],
    }
  }

  if (level === 'nasional') {
    return {
      meta,
      data: [
        {
          level: 'nasional',
          ber_kb: nasional.kbpp_ber_kb,
          mal: nasional.kbpp_mal,
          tradisional: nasional.kbpp_tradisional,
          numerator: nasional.kbpp_numerator,
          denominator: nasional.jumlah_ibu_pasca_persalinan,
          kbpp_tanpa_mal_pct: nasional.kbpp_tanpa_mal_pct,
        },
      ],
    }
  }

  return {
    meta,
    data: kbpp_tanpa_mal.map((row) => ({
      level: 'provinsi' as const,
      nama_provinsi: row.provinsi,
      kode_provinsi: row.kode,
      ber_kb: row.ber_kb,
      mal: row.mal,
      tradisional: row.tradisional,
      numerator: row.numerator,
      denominator: row.jumlah_ibu_pasca_persalinan,
      kbpp_tanpa_mal_pct: row.kbpp_tanpa_mal_pct,
    })),
  }
}
