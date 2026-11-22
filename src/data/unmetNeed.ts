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
  sumber: 'SIGA',
  sumberNote: OCT2026_SOURCE_CAPTION_UNMET,
  strength: 'Formula verified',
} as const

export const unmetNeedNotes = [
  `Nasional: unmet ${oct2026Dummy.nasional.unmet_need.toLocaleString('id-ID')} / PUS ${oct2026Dummy.nasional.jumlah_pus.toLocaleString('id-ID')} ≈ ${oct2026Dummy.nasional.unmet_need_pct}%.`,
  'Breakdown 38 Provinsi; kabupaten belum tersedia.',
] as const
