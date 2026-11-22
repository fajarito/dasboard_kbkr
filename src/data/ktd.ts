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
    'Kehamilan Tidak Diinginkan — jumlah PUS hamil yang tidak ingin anak lagi (Tabel16 hamil_tial). Count, bukan persen.',
  capaian: formatCountId(oct2026Dummy.nasional.ktd),
  capaianDelta: undefined as string | undefined,
  capaianDirection: 'down' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'Dallap Tabel 16 - SIGA',
  sumberNote: OCT2026_SOURCE_CAPTION_KTD,
  strength: 'Proksi DALLAP: hamil · tidak ingin anak lagi (hamil_tial)',
} as const

export const ktdNotes = [
  'Sumber: Dallap Tabel 16 - SIGA — kolom HAMIL · TIDAK INGIN ANAK LAGI (hamil_tial).',
  `Nasional KTD = ${formatCountId(oct2026Dummy.nasional.ktd)} (jumlah count 38 Provinsi; bukan persen).`,
  'Definisi operasional di UI ini: count hamil_tial — bukan proporsi dari total kehamilan.',
  'Breakdown 38 Provinsi; kabupaten belum tersedia.',
  'Jalur live Postgres tetap tersedia dengan VITE_USE_LIVE_API=true.',
] as const
