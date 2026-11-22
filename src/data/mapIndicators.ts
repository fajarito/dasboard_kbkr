/**
 * Spatial map indicator catalog for Peta Capaian.
 * Wired rows come from Oct 2026 province dummy; stubs stay empty (no invented values).
 */
import {
  demandSatisfiedProvinceRows,
  fourTProvinceRows,
  formatCountId,
  formatPctId,
  kbppProvinceRows,
  ktdProvinceRows,
  mcprProvinceRows,
  miiProvinceRows,
  mkjpProvinceRows,
  OCT2026_SOURCE_CAPTION,
  OCT2026_SOURCE_CAPTION_4T,
  OCT2026_SOURCE_CAPTION_DEMAND,
  OCT2026_SOURCE_CAPTION_KBPP,
  OCT2026_SOURCE_CAPTION_KTD,
  OCT2026_SOURCE_CAPTION_MCPR,
  OCT2026_SOURCE_CAPTION_MII,
  OCT2026_SOURCE_CAPTION_MKJP,
  OCT2026_SOURCE_CAPTION_UNMET,
  OCT2026_SOURCE_CAPTION_WILAYAH_KHUSUS,
  unmetNeedProvinceRows,
  wilayahKhususProvinceRows,
} from './dummy/oct2026'

export type MapIndicatorId =
  | 'unmet-need'
  | 'mcpr'
  | '4t'
  | 'ktd'
  | 'demand-satisfied'
  | 'mii'
  | 'ikp'
  | 'mkjp'
  | 'wilayah-khusus'
  | 'keterpaparan'
  | 'kbpp-tanpa-mal'
  | 'dcr'

export type MapValueKind = 'pct' | 'count'

export type MapProvinceValue = {
  /** BPS province code as number (GeoJSON `kode`). */
  code: number
  name: string
  value: number | null
}

export type MapIndicatorOption = {
  id: MapIndicatorId
  overviewId: string
  label: string
  shortLabel: string
  kind: MapValueKind
  /** When true, higher values use the “good” (teal) end of the palette. */
  higherIsBetter: boolean
  /** Province rows available from Oct 2026 dummy. */
  wired: boolean
  sourceCaption: string
  stubNote?: string
  getRows: () => MapProvinceValue[]
  formatValue: (value: number | null | undefined) => string
}

function kodeToCode(kode: string): number {
  return Number(kode)
}

function pctRows(
  rows: Array<{ kode: string; provinsi: string; pct: number | null }>,
): MapProvinceValue[] {
  return rows.map((row) => ({
    code: kodeToCode(row.kode),
    name: row.provinsi,
    value:
      row.pct == null || !Number.isFinite(row.pct) ? null : row.pct,
  }))
}

export const mapIndicators: MapIndicatorOption[] = [
  {
    id: 'unmet-need',
    overviewId: '01',
    label: 'Unmet Need',
    shortLabel: 'Unmet Need',
    kind: 'pct',
    higherIsBetter: false,
    wired: true,
    sourceCaption: OCT2026_SOURCE_CAPTION_UNMET,
    getRows: () => pctRows(unmetNeedProvinceRows()),
    formatValue: (v) => formatPctId(v),
  },
  {
    id: 'mcpr',
    overviewId: '02',
    label: 'mCPR',
    shortLabel: 'mCPR',
    kind: 'pct',
    higherIsBetter: true,
    wired: true,
    sourceCaption: OCT2026_SOURCE_CAPTION_MCPR,
    getRows: () => pctRows(mcprProvinceRows()),
    formatValue: (v) => formatPctId(v),
  },
  {
    id: '4t',
    overviewId: '03',
    label: '4T (Risiko)',
    shortLabel: '4T',
    kind: 'pct',
    higherIsBetter: false,
    wired: true,
    sourceCaption: OCT2026_SOURCE_CAPTION_4T,
    getRows: () => pctRows(fourTProvinceRows()),
    formatValue: (v) => formatPctId(v),
  },
  {
    id: 'ktd',
    overviewId: '04',
    label: 'KTD',
    shortLabel: 'KTD',
    kind: 'count',
    higherIsBetter: false,
    wired: true,
    sourceCaption: OCT2026_SOURCE_CAPTION_KTD,
    getRows: () =>
      ktdProvinceRows().map((row) => ({
        code: kodeToCode(row.kode),
        name: row.provinsi,
        value: Number.isFinite(row.ktd) ? row.ktd : null,
      })),
    formatValue: (v) => formatCountId(v),
  },
  {
    id: 'demand-satisfied',
    overviewId: '05',
    label: 'Demand Satisfied',
    shortLabel: 'Demand Satisfied',
    kind: 'pct',
    higherIsBetter: true,
    wired: true,
    sourceCaption: OCT2026_SOURCE_CAPTION_DEMAND,
    getRows: () =>
      pctRows(
        demandSatisfiedProvinceRows().map((row) => ({
          kode: row.kode,
          provinsi: row.provinsi,
          pct: row.pct,
        })),
      ),
    formatValue: (v) => formatPctId(v),
  },
  {
    id: 'mii',
    overviewId: '06',
    label: 'MII',
    shortLabel: 'MII',
    kind: 'pct',
    higherIsBetter: true,
    wired: true,
    sourceCaption: OCT2026_SOURCE_CAPTION_MII,
    getRows: () => pctRows(miiProvinceRows()),
    formatValue: (v) => formatPctId(v),
  },
  {
    id: 'ikp',
    overviewId: '07',
    label: 'IKP',
    shortLabel: 'IKP',
    kind: 'pct',
    higherIsBetter: true,
    wired: false,
    sourceCaption: OCT2026_SOURCE_CAPTION,
    stubNote:
      'Formula IKP belum dikonfirmasi — belum ada deret Provinsi Oct 2026.',
    getRows: () => [],
    formatValue: () => '—',
  },
  {
    id: 'mkjp',
    overviewId: '08',
    label: '% MKJP',
    shortLabel: 'MKJP',
    kind: 'pct',
    higherIsBetter: true,
    wired: true,
    sourceCaption: OCT2026_SOURCE_CAPTION_MKJP,
    getRows: () => pctRows(mkjpProvinceRows()),
    formatValue: (v) => formatPctId(v),
  },
  {
    id: 'wilayah-khusus',
    overviewId: '09',
    label: 'KB Wilayah Khusus',
    shortLabel: 'Wil. Khusus',
    kind: 'pct',
    higherIsBetter: true,
    wired: true,
    sourceCaption: OCT2026_SOURCE_CAPTION_WILAYAH_KHUSUS,
    getRows: () => pctRows(wilayahKhususProvinceRows()),
    formatValue: (v) => formatPctId(v),
  },
  {
    id: 'keterpaparan',
    overviewId: '10',
    label: 'Indeks Keterpaparan',
    shortLabel: 'Keterpaparan',
    kind: 'pct',
    higherIsBetter: true,
    wired: false,
    sourceCaption: OCT2026_SOURCE_CAPTION,
    stubNote:
      'Formula Indeks Keterpaparan belum dikonfirmasi — belum ada deret Provinsi.',
    getRows: () => [],
    formatValue: () => '—',
  },
  {
    id: 'kbpp-tanpa-mal',
    overviewId: '11',
    label: 'KBPP Tanpa MAL',
    shortLabel: 'KBPP',
    kind: 'pct',
    higherIsBetter: true,
    wired: true,
    sourceCaption: OCT2026_SOURCE_CAPTION_KBPP,
    getRows: () => pctRows(kbppProvinceRows()),
    formatValue: (v) => formatPctId(v),
  },
  {
    id: 'dcr',
    overviewId: '12',
    label: 'DCR (Permas)',
    shortLabel: 'DCR',
    kind: 'pct',
    higherIsBetter: false,
    wired: false,
    sourceCaption: OCT2026_SOURCE_CAPTION,
    stubNote:
      'Definisi DCR/Permas belum dikunci — belum ada deret Provinsi.',
    getRows: () => [],
    formatValue: () => '—',
  },
]

export const mapIndicatorById = Object.fromEntries(
  mapIndicators.map((item) => [item.id, item]),
) as Record<MapIndicatorId, MapIndicatorOption>

export const DEFAULT_MAP_INDICATOR_ID: MapIndicatorId = 'unmet-need'

export function valuesByCode(
  rows: MapProvinceValue[],
): Record<number, number | null> {
  const out: Record<number, number | null> = {}
  for (const row of rows) {
    if (!Number.isFinite(row.code)) continue
    out[row.code] = row.value
  }
  return out
}

export function nameByCode(rows: MapProvinceValue[]): Record<number, string> {
  const out: Record<number, string> = {}
  for (const row of rows) {
    if (!Number.isFinite(row.code)) continue
    out[row.code] = row.name
  }
  return out
}
