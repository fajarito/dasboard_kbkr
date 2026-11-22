import {
  formatPctId,
  oct2026Dummy,
  OCT2026_SOURCE_CAPTION,
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
  sumber: 'Dummy Excel · Tabel 16 (+ T10)',
  sumberNote: OCT2026_SOURCE_CAPTION,
  strength: 'Dummy Excel Oct 2026 — formula verified vs Tabel16',
} as const

export const unmetNeedNotes = [
  'Sumber UI default: dummy Excel Oktober 2026 (Tabel10 PUS + Tabel16 unmet).',
  'Formula: (hamil_ihn + hamil_tial + tdkhamil_ihn + tdkhamil_tial) / jumlah_pus × 100 — excludes “ingin segera”.',
  `Nasional: unmet ${oct2026Dummy.nasional.unmet_need.toLocaleString('id-ID')} / PUS ${oct2026Dummy.nasional.jumlah_pus.toLocaleString('id-ID')} ≈ ${oct2026Dummy.nasional.unmet_need_pct}%.`,
  'Breakdown 38 Provinsi dari Excel; kabupaten tidak ada di share ini.',
  'Jalur live Postgres tetap tersedia dengan VITE_USE_LIVE_API=true.',
] as const
