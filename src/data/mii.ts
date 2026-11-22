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
    'Method Information Index (proksi informed consent) — (IC baru + IC ulangan) ÷ (KB baru selected + KB ulangan selected) × 100. Tabel2 + Tabel3 + Tabel10 KB ulangan.',
  capaian: formatPctId(n.mii_pct),
  capaianDelta: undefined as string | undefined,
  capaianDirection: 'up' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'Dallap Tabel 2, 3 & 10 - SIGA',
  sumberNote: OCT2026_SOURCE_CAPTION_MII,
  strength:
    'IC÷KB selected · Tabel10 ulangan tanpa kolom vasektomi/tubektomi (dianggap 0)',
} as const

export const miiNotes = [
  'Sumber: Dallap Tabel 2, 3 & 10 - SIGA — Tabel2 (informed consent), Tabel3 (KB baru), Tabel10 KB ulangan (berbeda dari Tabel10 PUS).',
  `Nasional: numerator ${n.mii_numerator.toLocaleString('id-ID')} / denominator ${n.mii_denominator.toLocaleString('id-ID')} ≈ ${n.mii_pct}% → UI ${formatPctId(n.mii_pct)}.`,
  'IC_baru / IC_ulangan: Tabel2 totals informed consent pada Suntik, Implan, IUD, Vasektomi, Tubektomi.',
  'KB_baru_selected (Tabel3): suntik (1 bln + 3 komb + 3 prog) + implan (1+2 batang) + IUD + vasektomi + tubektomi — exclude pil & kondom.',
  'KB_ulangan_selected (Tabel10 KB ulangan): suntik + implan + IUD. Kolom vasektomi/tubektomi tidak tersedia — diperlakukan 0.',
  'Breakdown 38 Provinsi; kabupaten belum tersedia.',
  'Jalur live Postgres tetap tersedia dengan VITE_USE_LIVE_API=true.',
] as const
