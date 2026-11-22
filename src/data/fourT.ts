import {
  formatPctId,
  fourTNasionalComponents,
  fourTProvinceRows,
  oct2026Dummy,
  OCT2026_SOURCE_CAPTION_4T,
  rankedProvinces,
} from './dummy/oct2026'

const n = oct2026Dummy.nasional

export const fourTMeta = {
  title: 'Detail Indikator: 4T (Risiko)',
  shortName: '4T',
  subtitle:
    'Proporsi ibu hamil dengan ≥1 faktor risiko 4T: Terlalu Muda (<20 th), Terlalu Tua (≥35 th), Terlalu Dekat (jarak kelahiran <2 th), atau Terlalu Banyak (jumlah anak >3). Headline = jumlah_bumil_4t ÷ jumlah_bumil (unique — bukan penjumlahan komponen).',
  capaian: formatPctId(n.pct_4t),
  capaianDelta: undefined as string | undefined,
  capaianDirection: 'down' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'SIGA',
  sumberNote: OCT2026_SOURCE_CAPTION_4T,
  strength: 'pct_4t verified',
} as const

export const fourTComponents = fourTNasionalComponents()

export const fourTTopProvinces = rankedProvinces(
  fourTProvinceRows(),
  'desc',
  5,
)
export const fourTLowestProvinces = rankedProvinces(
  fourTProvinceRows(),
  'asc',
  5,
)

export const fourTNotes = [
  `Nasional: bumil_4t ${n.jumlah_bumil_4t.toLocaleString('id-ID')} / bumil ${n.jumlah_bumil.toLocaleString('id-ID')} ≈ ${n.pct_4t}% (jangan menjumlahkan empat komponen).`,
  `Komponen nasional: muda ${n.terlalu_muda.toLocaleString('id-ID')} (${formatPctId(n.pct_terlalu_muda)}), tua ${n.terlalu_tua.toLocaleString('id-ID')} (${formatPctId(n.pct_terlalu_tua)}), dekat ${n.terlalu_dekat.toLocaleString('id-ID')} (${formatPctId(n.pct_terlalu_dekat)}), banyak ${n.terlalu_banyak.toLocaleString('id-ID')} (${formatPctId(n.pct_terlalu_banyak, 4)}).`,
  'Breakdown 38 Provinsi; kabupaten belum tersedia.',
] as const
