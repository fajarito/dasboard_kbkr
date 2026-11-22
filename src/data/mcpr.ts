export const mcprMeta = {
  title: 'Detail Indikator: mCPR',
  subtitle:
    'Modern Contraceptive Prevalence Rate — peserta KB aktif metode modern ÷ total PUS × 100%.',
  capaian: '61,4%',
  capaianDelta: '2,1 p.p',
  target: '65,0%',
  selisih: '3,6 p.p',
  sumber: 'DALLAP Tabel 10–15',
  sumberNote: 'Cross-check YanKB · jalur model EMU (Track20)',
} as const

/** Annual series (≥5 tahun / RPJMN). Values from Figma — not invented kab data. */
export const mcprTrendAnnual = [
  { period: '2020', value: 55, label: '55%' },
  { period: '2021', value: 56, label: '56%' },
  { period: '2022', value: 58, label: '58%' },
  { period: '2023', value: 57, label: '57%' },
  { period: '2024', value: 59, label: '59%' },
  { period: '2025', value: 60, label: '60%' },
  { period: '2026', value: 61, label: '61%' },
] as const

/** @deprecated use mcprTrendAnnual */
export const mcprTrend = mcprTrendAnnual

export const mcprNotes = [
  'Sumber SIGA dinilai kuat (DALLAP Bulanan Tabel 10–15).',
  'Rekonsiliasi DALLAP vs YanKB (jalur model EMU) diperlukan untuk validasi.',
  'Breakdown standar hingga kabupaten/kota; kecamatan/faskes untuk model EMU menyusul.',
] as const

export type TrendPeriod = 'tahunan' | 'bulanan'
export type GeoLevel = 'nasional' | 'provinsi' | 'kabupaten'

export const trendPeriods: { id: TrendPeriod; label: string }[] = [
  { id: 'tahunan', label: 'Tren tahunan' },
  { id: 'bulanan', label: 'Tren bulanan' },
]

export const geoLevels: { id: GeoLevel; label: string }[] = [
  { id: 'nasional', label: 'Nasional' },
  { id: 'provinsi', label: 'Provinsi' },
  { id: 'kabupaten', label: 'Kabupaten' },
]
