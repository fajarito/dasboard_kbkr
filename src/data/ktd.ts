import {
  formatCountId,
  oct2026Dummy,
  OCT2026_SOURCE_CAPTION_KTD,
} from './dummy/oct2026'

export type { GeoLevel, TrendPeriod } from './indicatorShared'
export { geoLevels, trendPeriods } from './indicatorShared'

export const ktdMeta = {
  title: 'Detail Indikator: KTD',
  shortName: 'KTD',
  subtitle:
    'Kehamilan Tidak Diinginkan — jumlah PUS hamil yang tidak ingin anak lagi.',
  capaian: formatCountId(oct2026Dummy.nasional.ktd),
  capaianDelta: undefined as string | undefined,
  capaianDirection: 'down' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'SIGA',
  sumberNote: OCT2026_SOURCE_CAPTION_KTD,
  strength: 'Proksi: hamil · tidak ingin anak lagi',
} as const

export const ktdNotes = [
  `Nasional KTD = ${formatCountId(oct2026Dummy.nasional.ktd)}.`,
  'Breakdown 38 Provinsi; kabupaten belum tersedia.',
] as const
