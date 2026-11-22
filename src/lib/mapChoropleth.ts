import type { MapValueKind } from '../data/mapIndicators'

/** Gray fill when province has no value for the selected indicator. */
export const mapNoDataColor = '#d7dee8'

/** Four-class palette (low → high magnitude). Orientation set by higherIsBetter. */
export const mapChoroplethPalette = [
  '#c34b46',
  '#e6b44b',
  '#4ba09b',
  '#377887',
] as const

export type MapLegendItem = {
  key: string
  label: string
  color: string
}

/** Legacy placeholder legend (Overview coverage colors). */
export const mapLegendPlaceholder: MapLegendItem[] = [
  { key: 'high', label: '≥ 60%', color: '#377887' },
  { key: 'mid', label: '40–59%', color: '#4ba09b' },
  { key: 'low', label: '20–39%', color: '#e6b44b' },
  { key: 'crit', label: '< 20%', color: '#c34b46' },
  { key: 'nodata', label: 'Data belum tersedia', color: mapNoDataColor },
]

export type MapLevel = 'provinsi' | 'kabupaten'

export const PROVINCE_GEOJSON_URL = '/data/indonesia-provinces.geojson'

export type ChoroplethScale = {
  /** Sorted ascending break edges (length = palette length − 1). */
  breaks: number[]
  colors: readonly string[]
  legend: MapLegendItem[]
}

function formatLegendNumber(value: number, kind: MapValueKind): string {
  if (kind === 'count') {
    return Math.round(value).toLocaleString('id-ID')
  }
  return `${value.toLocaleString('id-ID', {
    minimumFractionDigits: value >= 10 ? 0 : 1,
    maximumFractionDigits: value >= 10 ? 0 : 1,
  })}%`
}

/**
 * Equal-interval 4-class scale from observed province values.
 * Colors flip when higherIsBetter is false (high magnitude → red).
 */
export function buildChoroplethScale(
  values: Array<number | null | undefined>,
  options: {
    kind: MapValueKind
    higherIsBetter: boolean
    formatBound?: (value: number) => string
  },
): ChoroplethScale | null {
  const finite = values.filter(
    (v): v is number => v != null && Number.isFinite(v),
  )
  if (finite.length === 0) return null

  const min = Math.min(...finite)
  const max = Math.max(...finite)
  const formatBound =
    options.formatBound ?? ((v: number) => formatLegendNumber(v, options.kind))

  const palette = options.higherIsBetter
    ? [...mapChoroplethPalette]
    : [...mapChoroplethPalette].reverse()

  if (min === max) {
    return {
      breaks: [],
      colors: [palette[3]],
      legend: [
        {
          key: 'all',
          label: formatBound(min),
          color: palette[3],
        },
        {
          key: 'nodata',
          label: 'Data belum tersedia',
          color: mapNoDataColor,
        },
      ],
    }
  }

  const step = (max - min) / 4
  const breaks = [min + step, min + step * 2, min + step * 3]
  const edges = [min, ...breaks, max]

  const legend: MapLegendItem[] = [
    {
      key: 'b0',
      label: `< ${formatBound(breaks[0])}`,
      color: palette[0],
    },
    {
      key: 'b1',
      label: `${formatBound(edges[1])} – ${formatBound(edges[2])}`,
      color: palette[1],
    },
    {
      key: 'b2',
      label: `${formatBound(edges[2])} – ${formatBound(edges[3])}`,
      color: palette[2],
    },
    {
      key: 'b3',
      label: `≥ ${formatBound(breaks[2])}`,
      color: palette[3],
    },
    {
      key: 'nodata',
      label: 'Data belum tersedia',
      color: mapNoDataColor,
    },
  ]

  return { breaks, colors: palette, legend }
}

export function colorForValue(
  value: number | null | undefined,
  scale: ChoroplethScale | null,
): string {
  if (value == null || !Number.isFinite(value) || !scale) return mapNoDataColor
  if (scale.breaks.length === 0) return scale.colors[0] ?? mapNoDataColor

  let idx = 0
  for (let i = 0; i < scale.breaks.length; i += 1) {
    if (value >= scale.breaks[i]) idx = i + 1
  }
  return scale.colors[idx] ?? mapNoDataColor
}

/** MapLibre paint expression: provinceCode → color (or solid no-data). */
export function buildFillColorExpression(
  valuesByCode: Record<number, number | null | undefined>,
  scale: ChoroplethScale | null,
): string | unknown[] {
  const entries = Object.entries(valuesByCode)
  if (!scale || entries.length === 0) {
    return mapNoDataColor
  }

  const matchArgs: unknown[] = ['match', ['get', 'provinceCode']]
  let pairs = 0
  for (const [codeStr, value] of entries) {
    const code = Number(codeStr)
    if (!Number.isFinite(code)) continue
    matchArgs.push(code, colorForValue(value, scale))
    pairs += 1
  }
  if (pairs === 0) return mapNoDataColor
  matchArgs.push(mapNoDataColor)
  return matchArgs
}

export function rankedFromValues(
  rows: Array<{ code: number; name: string; value: number | null }>,
  order: 'asc' | 'desc',
  limit = 5,
): Array<{ code: number; name: string; value: number }> {
  const finite = rows.filter(
    (r): r is { code: number; name: string; value: number } =>
      r.value != null && Number.isFinite(r.value),
  )
  const sorted = [...finite].sort((a, b) =>
    order === 'desc' ? b.value - a.value : a.value - b.value,
  )
  return sorted.slice(0, limit)
}
