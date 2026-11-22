/** Placeholder legend bands (aligned with Overview coverage colors). No live values. */
export const mapNoDataColor = '#d7dee8'

export const mapLegendPlaceholder = [
  { key: 'high', label: '≥ 60%', range: 'Placeholder', color: '#377887' },
  { key: 'mid', label: '40–59%', range: 'Placeholder', color: '#4ba09b' },
  { key: 'low', label: '20–39%', range: 'Placeholder', color: '#e6b44b' },
  { key: 'crit', label: '< 20%', range: 'Placeholder', color: '#c34b46' },
  { key: 'nodata', label: 'Data belum tersedia', range: '—', color: mapNoDataColor },
] as const

export type MapLevel = 'provinsi' | 'kabupaten'

export const PROVINCE_GEOJSON_URL = '/data/indonesia-provinces.geojson'
