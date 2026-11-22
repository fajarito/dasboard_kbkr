import {
  formatPctId,
  oct2026Dummy,
  OCT2026_SOURCE_CAPTION_WILAYAH_KHUSUS,
  rankedProvinces,
  wilayahKhususProvinceRows,
} from './dummy/oct2026'

export type { GeoLevel, TrendPeriod } from './indicatorShared'
export { geoLevels, trendPeriods } from './indicatorShared'

const n = oct2026Dummy.nasional

export const wilayahKhususMeta = {
  title: 'Detail Indikator: Kesertaan KB Wilayah Khusus',
  shortName: 'Wil. Khusus',
  subtitle:
    'Persentase peserta KB aktif metode kondom + vasektomi di kabupaten tertinggal (Tabel20) — (Kondom + Vasektomi) ÷ Jumlah Peserta KB Aktif × 100.',
  capaian: formatPctId(n.wilayah_khusus_pct),
  capaianDelta: undefined as string | undefined,
  capaianDirection: 'up' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'Dallap Tabel 20 - SIGA',
  sumberNote: OCT2026_SOURCE_CAPTION_WILAYAH_KHUSUS,
  strength:
    'Tabel20 kabupaten tertinggal · (kondom+vasektomi)/KB aktif · 15 Provinsi saja',
} as const

export const wilayahKhususTopProvinces = rankedProvinces(
  wilayahKhususProvinceRows(),
  'desc',
  5,
)
export const wilayahKhususLowestProvinces = rankedProvinces(
  wilayahKhususProvinceRows(),
  'asc',
  5,
)

export const wilayahKhususNotes = [
  'Sumber: Dallap Tabel 20 - SIGA — JUMLAH PESERTA KB AKTIF PADA KABUPATEN TERTINGGAL.',
  `Nasional: (kondom ${n.wilayah_khusus_kondom.toLocaleString('id-ID')} + vasektomi ${n.wilayah_khusus_vasektomi.toLocaleString('id-ID')}) = ${n.wilayah_khusus_numerator.toLocaleString('id-ID')} / KB aktif ${n.wilayah_khusus_jumlah_kb_aktif.toLocaleString('id-ID')} ≈ ${n.wilayah_khusus_pct}% → UI ${formatPctId(n.wilayah_khusus_pct)}.`,
  'Hanya 15 Provinsi yang muncul di Tabel20 — Provinsi lain tidak dikarang.',
  'Agregat kabupaten tertinggal per Provinsi; baris kabupaten individual belum tersedia.',
  'Jalur live Postgres tetap tersedia dengan VITE_USE_LIVE_API=true.',
] as const
