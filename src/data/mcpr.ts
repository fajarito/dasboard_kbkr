export const mcprMeta = {
  title: 'Detail Indikator: mCPR',
  subtitle:
    'Modern Contraceptive Prevalence Rate — peserta KB aktif metode modern ÷ total PUS × 100%.',
  capaian: '61,4%',
  capaianDelta: '2,1 p.p',
  target: '65,0%',
  selisih: '3,6 p.p',
  sumber: 'DALLAP Tabel 10–15',
  sumberNote: 'Cross-check YanKB',
} as const

export const mcprTrend = [
  { period: '2020', value: 55, label: '55%' },
  { period: '2021', value: 56, label: '56%' },
  { period: '2022', value: 58, label: '58%' },
  { period: '2023', value: 57, label: '57%' },
  { period: '2024', value: 59, label: '59%' },
  { period: '2025', value: 60, label: '60%' },
  { period: '2026', value: 61, label: '61%' },
] as const

export const mcprNotes = [
  'Sumber SIGA dinilai kuat.',
  'Rekonsiliasi DALLAP dan YanKB.',
  'Drill-down kabupaten/kota serta kecamatan/faskes.',
] as const

export type GeoLevel = 'nasional' | 'provinsi' | 'kabupaten'

export const geoLevels: { id: GeoLevel; label: string }[] = [
  { id: 'nasional', label: 'Nasional' },
  { id: 'provinsi', label: 'Provinsi' },
  { id: 'kabupaten', label: 'Kabupaten' },
]
