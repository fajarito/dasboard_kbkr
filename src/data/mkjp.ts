import {
  formatPctId,
  oct2026Dummy,
  OCT2026_SOURCE_CAPTION_MKJP,
} from './dummy/oct2026'

export type { GeoLevel, TrendPeriod } from './indicatorShared'
export { geoLevels, trendPeriods } from './indicatorShared'

const n = oct2026Dummy.nasional

export const mkjpMeta = {
  title: 'Detail Indikator: % MKJP',
  shortName: '% MKJP',
  subtitle:
    'Persentase Metode Kontrasepsi Jangka Panjang (IUD, Implan, Vasektomi, Tubektomi) dari peserta KB baru + ulangan — (MKJP baru + MKJP ulangan) ÷ (total baru + total ulangan) × 100.',
  capaian: formatPctId(n.mkjp_pct),
  capaianDelta: undefined as string | undefined,
  capaianDirection: 'up' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'Dallap Tabel 3 & 10 - SIGA',
  sumberNote: OCT2026_SOURCE_CAPTION_MKJP,
  strength: 'Dallap Tabel 3 & 10 - SIGA',
} as const

export const mkjpNotes = [
  'Sumber: Dallap Tabel 3 & 10 - SIGA.',
  `Nasional: numerator ${n.mkjp_numerator.toLocaleString('id-ID')} / denominator ${n.mkjp_denominator.toLocaleString('id-ID')} ≈ ${n.mkjp_pct}% → UI ${formatPctId(n.mkjp_pct)}.`,
  'Breakdown 38 Provinsi; kabupaten belum tersedia.',
] as const
