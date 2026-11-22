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
  sumber: 'Dummy Excel · Tabel 3 / 10',
  sumberNote: OCT2026_SOURCE_CAPTION_MKJP,
  strength:
    'MKJP÷(KB baru+ulangan) · Tabel10 ulangan tanpa kolom vasektomi/tubektomi (dianggap 0)',
} as const

export const mkjpNotes = [
  'Sumber UI default: dummy Excel Oktober 2026 — Tabel3 (KB baru) + Tabel10_v3 (KB ulangan; berbeda dari Tabel10 PUS).',
  `Nasional: numerator ${n.mkjp_numerator.toLocaleString('id-ID')} / denominator ${n.mkjp_denominator.toLocaleString('id-ID')} ≈ ${n.mkjp_pct}% → UI ${formatPctId(n.mkjp_pct)}.`,
  'MKJP_baru (Tabel3): implan (1+2 batang) + IUD + vasektomi + tubektomi. total_baru = kolom jumlah KB baru.',
  'MKJP_ulangan (Tabel10 KB ulangan): implan + IUD saja. File Excel ini tidak punya kolom vasektomi/tubektomi — diperlakukan 0. total_ulangan = kolom jumlah KB ulangan.',
  'Breakdown 38 Provinsi dari Excel; kabupaten tidak ada di share ini.',
  'Jalur live Postgres tetap tersedia dengan VITE_USE_LIVE_API=true.',
] as const
