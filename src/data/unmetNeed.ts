import {
  formatPctId,
  oct2026Dummy,
  OCT2026_SOURCE_CAPTION_UNMET,
} from './dummy/oct2026'

export const unmetNeedMeta = {
  title: 'Detail Indikator: Unmet Need',
  shortName: 'Unmet Need',
  subtitle:
    'PUS yang ingin menunda kehamilan atau tidak ingin anak lagi, namun tidak menggunakan kontrasepsi ÷ total PUS.',
  capaian: formatPctId(oct2026Dummy.nasional.unmet_need_pct),
  capaianDelta: undefined as string | undefined,
  capaianDirection: 'down' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'Dallap Tabel 16 - SIGA',
  sumberNote: OCT2026_SOURCE_CAPTION_UNMET,
  strength: 'Dallap Tabel 16 - SIGA — formula verified vs Tabel16',
} as const

export const unmetNeedNotes = [
  'Sumber: Dallap Tabel 16 - SIGA (PUS dari Tabel 10).',
  'Formula: (hamil_ihn + hamil_tial + tdkhamil_ihn + tdkhamil_tial) / jumlah_pus × 100 — excludes “ingin segera”.',
  `Nasional: unmet ${oct2026Dummy.nasional.unmet_need.toLocaleString('id-ID')} / PUS ${oct2026Dummy.nasional.jumlah_pus.toLocaleString('id-ID')} ≈ ${oct2026Dummy.nasional.unmet_need_pct}%.`,
  'Breakdown 38 Provinsi; kabupaten belum tersedia.',
  'Jalur live Postgres tetap tersedia dengan VITE_USE_LIVE_API=true.',
] as const
