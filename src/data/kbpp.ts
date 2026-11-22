import {
  formatPctId,
  kbppProvinceRows,
  oct2026Dummy,
  OCT2026_SOURCE_CAPTION_KBPP,
  rankedProvinces,
} from './dummy/oct2026'

export type { GeoLevel, TrendPeriod } from './indicatorShared'
export { geoLevels, trendPeriods } from './indicatorShared'

const n = oct2026Dummy.nasional

export const kbppMeta = {
  title: 'Detail Indikator: KBPP Tanpa MAL',
  shortName: 'KBPP Tanpa MAL',
  subtitle:
    'Persentase ibu pascapersalinan yang mengikuti KB dengan metode selain MAL dan Tradisional, dari total ibu pascapersalinan — (IUD+MOW+MOP+Implan+Suntik+Pil+Kondom) ÷ jumlah ibu pasca persalinan × 100.',
  capaian: formatPctId(n.kbpp_tanpa_mal_pct),
  capaianDelta: undefined as string | undefined,
  capaianDirection: 'up' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'Dallap Tabel 1 - SIGA',
  sumberNote: OCT2026_SOURCE_CAPTION_KBPP,
  strength: 'Dallap Tabel 1 - SIGA',
} as const

export const kbppTopProvinces = rankedProvinces(kbppProvinceRows(), 'desc', 5)
export const kbppLowestProvinces = rankedProvinces(kbppProvinceRows(), 'asc', 5)

export const kbppNotes = [
  'Sumber: Dallap Tabel 1 - SIGA.',
  `Nasional: numerator ${n.kbpp_numerator.toLocaleString('id-ID')} / ibu pasca persalinan ${n.jumlah_ibu_pasca_persalinan.toLocaleString('id-ID')} ≈ ${n.kbpp_tanpa_mal_pct}% → UI ${formatPctId(n.kbpp_tanpa_mal_pct)}.`,
  'Numerator = IUD+MOW+MOP+Implan+Suntik+Pil+Kondom (= ber_kb − MAL − tradisional). MAL dan Tradisional dikecualikan.',
  'Breakdown 38 Provinsi; kabupaten belum tersedia.',
] as const
