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

export function levelLabel(level: GeoLevel): string {
  return geoLevels.find((item) => item.id === level)?.label ?? 'Nasional'
}
