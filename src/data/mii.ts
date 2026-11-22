import {
  formatPctId,
  oct2026Dummy,
  OCT2026_SOURCE_CAPTION_MII,
} from './dummy/oct2026'

export type { GeoLevel, TrendPeriod } from './indicatorShared'
export { geoLevels, trendPeriods } from './indicatorShared'

const n = oct2026Dummy.nasional

export const miiMeta = {
  title: 'Detail Indikator: MII',
  shortName: 'MII',
  subtitle:
    'Method Information Index (proksi informed consent) — (IC baru + IC ulangan) ÷ (KB baru selected + KB ulangan selected) × 100.',
  capaian: formatPctId(n.mii_pct),
  capaianDelta: undefined as string | undefined,
  capaianDirection: 'up' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'Dallap Tabel 2, 3 & 10 - SIGA',
  sumberNote: OCT2026_SOURCE_CAPTION_MII,
  strength: 'Dallap Tabel 2, 3 & 10 - SIGA',
} as const

export const miiNotes = [
  'Sumber: Dallap Tabel 2, 3 & 10 - SIGA.',
  `Nasional: numerator ${n.mii_numerator.toLocaleString('id-ID')} / denominator ${n.mii_denominator.toLocaleString('id-ID')} ≈ ${n.mii_pct}% → UI ${formatPctId(n.mii_pct)}.`,
  'Breakdown 38 Provinsi; kabupaten belum tersedia.',
] as const
