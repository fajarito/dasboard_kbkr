import {
  formatPctId,
  oct2026Dummy,
  OCT2026_SOURCE_CAPTION_MCPR,
} from './dummy/oct2026'

export type { GeoLevel, TrendPeriod } from './indicatorShared'
export { geoLevels, trendPeriods } from './indicatorShared'

export const mcprMeta = {
  title: 'Detail Indikator: mCPR',
  subtitle:
    'Modern Contraceptive Prevalence Rate — peserta KB aktif metode modern ÷ total PUS × 100%.',
  capaian: formatPctId(oct2026Dummy.nasional.mcpr_pct),
  capaianDelta: undefined as string | undefined,
  target: '65,0%',
  /** Nasional proxy already above 65% target (Oct 2026). */
  selisih: `${(oct2026Dummy.nasional.mcpr_pct - 65).toLocaleString('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} p.p di atas target`,
  sumber: 'Dallap Tabel 11 - SIGA',
  sumberNote: OCT2026_SOURCE_CAPTION_MCPR,
} as const

/** Annual series (≥5 tahun / RPJMN). Values from Figma — not invented kab data. */
export const mcprTrendAnnual = [
  { period: '2020', value: 55, label: '55%' },
  { period: '2021', value: 56, label: '56%' },
  { period: '2022', value: 58, label: '58%' },
  { period: '2023', value: 57, label: '57%' },
  { period: '2024', value: 59, label: '59%' },
  { period: '2025', value: 60, label: '60%' },
  {
    period: '2026',
    value: Math.round(oct2026Dummy.nasional.mcpr_pct),
    label: formatPctId(oct2026Dummy.nasional.mcpr_pct, 0),
  },
] as const

/** @deprecated use mcprTrendAnnual */
export const mcprTrend = mcprTrendAnnual

export const mcprNotes = [
  'Sumber: Dallap Tabel 11 - SIGA.',
  `Nasional proxy: modern ${oct2026Dummy.nasional.peserta_kb_aktif_modern.toLocaleString('id-ID')} / PUS ${oct2026Dummy.nasional.jumlah_pus.toLocaleString('id-ID')} ≈ ${oct2026Dummy.nasional.mcpr_pct}%.`,
  'Breakdown 38 Provinsi; kabupaten belum tersedia.',
] as const
