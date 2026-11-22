import {
  formatPctId,
  oct2026Dummy,
  OCT2026_SOURCE_CAPTION_DEMAND,
} from './dummy/oct2026'

export type { GeoLevel, TrendPeriod } from './indicatorShared'
export { geoLevels, trendPeriods } from './indicatorShared'

const n = oct2026Dummy.nasional

export const demandSatisfiedMeta = {
  title: 'Detail Indikator: Demand Satisfied',
  shortName: 'Demand Satisfied',
  subtitle:
    'Pengguna metode modern ÷ (pengguna metode modern + unmet need) × 100%. Derivasi Tabel11 + Tabel16.',
  capaian: formatPctId(n.demand_satisfied_pct),
  capaianDelta: undefined as string | undefined,
  capaianDirection: 'up' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'Dallap Tabel 11 & 16 - SIGA',
  sumberNote: OCT2026_SOURCE_CAPTION_DEMAND,
  strength: 'modern÷(modern+unmet) · unmet = jumlah unmet need (count)',
} as const

export const demandSatisfiedNotes = [
  'Sumber: Dallap Tabel 11 & 16 - SIGA — Tabel11 total_modern + Tabel16 jumlah_unmet_need.',
  `Nasional: modern ${n.peserta_kb_aktif_modern.toLocaleString('id-ID')} / (modern + unmet ${n.unmet_need.toLocaleString('id-ID')}) ≈ ${n.demand_satisfied_pct}%.`,
  'Unmet need di rumus ini adalah count unik (calc_unmet / jumlah_unmet_need), bukan persen Unmet Need.',
  'Breakdown 38 Provinsi; kabupaten belum tersedia.',
  'Jalur live Postgres tetap tersedia dengan VITE_USE_LIVE_API=true.',
] as const
