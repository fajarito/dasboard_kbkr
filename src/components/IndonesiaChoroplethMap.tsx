import {
  AttributionControl,
  Map as MapLibreMap,
  NavigationControl,
  setWorkerUrl,
  type MapLayerMouseEvent,
} from 'maplibre-gl'
import { useEffect, useMemo, useRef, useState } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  buildChoroplethScale,
  buildFillColorExpression,
  mapLegendPlaceholder,
  mapNoDataColor,
  PROVINCE_GEOJSON_URL,
  type MapLegendItem,
  type MapLevel,
} from '../lib/mapChoropleth'
import type { MapValueKind } from '../data/mapIndicators'

if (typeof window !== 'undefined') {
  setWorkerUrl('/maplibre-gl-worker.mjs')
}

type Hovered = {
  name: string
  code: number
  value: number | null
}

type IndonesiaChoroplethMapProps = {
  heightClassName?: string
  level?: MapLevel
  showLegend?: boolean
  /** Province BPS code → indicator value (null = no data). */
  valuesByCode?: Record<number, number | null>
  /** Optional display names keyed by BPS code (overrides GeoJSON labels). */
  nameByCode?: Record<number, string>
  valueKind?: MapValueKind
  higherIsBetter?: boolean
  formatValue?: (value: number | null) => string
  legendTitle?: string
  emptyHint?: string
  onProvinceClick?: (province: {
    name: string
    code: number
    value: number | null
  }) => void
}

export function IndonesiaChoroplethMap({
  heightClassName = 'h-[360px] md:h-[480px]',
  level = 'provinsi',
  showLegend = true,
  valuesByCode = {},
  nameByCode = {},
  valueKind = 'pct',
  higherIsBetter = true,
  formatValue = (v) => (v == null ? '—' : String(v)),
  legendTitle = 'Legenda',
  emptyHint = 'Data wilayah belum tersedia — outline batas provinsi saja',
  onProvinceClick,
}: IndonesiaChoroplethMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const valuesRef = useRef(valuesByCode)
  const namesRef = useRef(nameByCode)
  const formatRef = useRef(formatValue)
  const onClickRef = useRef(onProvinceClick)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hovered, setHovered] = useState<Hovered | null>(null)
  const [bootKey, setBootKey] = useState(0)

  valuesRef.current = valuesByCode
  namesRef.current = nameByCode
  formatRef.current = formatValue
  onClickRef.current = onProvinceClick

  const scale = useMemo(
    () =>
      buildChoroplethScale(Object.values(valuesByCode), {
        kind: valueKind,
        higherIsBetter,
      }),
    [valuesByCode, valueKind, higherIsBetter],
  )

  const legendItems: MapLegendItem[] = scale?.legend ?? [
    ...mapLegendPlaceholder.filter((item) => item.key === 'nodata'),
  ]

  const hasData = scale != null

  useEffect(() => {
    let active = true
    let map: MapLibreMap | null = null

    const boot = async () => {
      try {
        const response = await fetch(PROVINCE_GEOJSON_URL)
        if (!response.ok) throw new Error('GeoJSON tidak dapat dimuat')
        const data = await response.json()
        if (
          !data ||
          data.type !== 'FeatureCollection' ||
          !Array.isArray(data.features)
        ) {
          throw new Error('Format GeoJSON tidak valid')
        }

        if (
          !('WebGL2RenderingContext' in window) &&
          !('WebGLRenderingContext' in window)
        ) {
          throw new Error('WebGL tidak didukung di browser ini')
        }

        const joined = {
          ...data,
          features: data.features.map(
            (feature: {
              properties?: Record<string, unknown>
              [key: string]: unknown
            }) => {
              const code = Number(feature.properties?.kode)
              return {
                ...feature,
                id: code,
                properties: {
                  ...feature.properties,
                  provinceCode: code,
                  provinceName: String(
                    feature.properties?.Propinsi ?? 'Provinsi',
                  ),
                },
              }
            },
          ),
        }

        if (!active || !containerRef.current) return

        map = new MapLibreMap({
          container: containerRef.current,
          style: {
            version: 8,
            sources: {},
            layers: [
              {
                id: 'kbkr-map-background',
                type: 'background',
                paint: { 'background-color': '#f5f7fb' },
              },
            ],
          },
          center: [118, -2],
          zoom: 3.4,
          minZoom: 2.5,
          maxZoom: 8,
          maxBounds: [
            [88, -17],
            [148, 12],
          ],
          renderWorldCopies: false,
          attributionControl: false,
        })
        mapRef.current = map

        map.addControl(
          new NavigationControl({ showCompass: false, visualizePitch: false }),
          'bottom-right',
        )
        map.addControl(
          new AttributionControl({
            compact: true,
            customAttribution: 'Batas: BAKOSURTANAL / Dukcapil 2019',
          }),
          'bottom-left',
        )

        map.on('load', () => {
          if (!active || !map) return
          map.addSource('indonesia-provinces', {
            type: 'geojson',
            data: joined,
            promoteId: 'provinceCode',
            attribution: 'BAKOSURTANAL / Dukcapil 2019',
          })
          map.addLayer({
            id: 'province-fill',
            type: 'fill',
            source: 'indonesia-provinces',
            paint: {
              'fill-color': mapNoDataColor,
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.92,
              ],
            },
          })
          map.addLayer({
            id: 'province-boundaries',
            type: 'line',
            source: 'indonesia-provinces',
            paint: {
              'line-color': '#ffffff',
              'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                0.8,
              ],
            },
          })
          map.fitBounds(
            [
              [94, -11.5],
              [141.5, 6.5],
            ],
            {
              padding: { top: 20, right: 35, bottom: 20, left: 35 },
              duration: 0,
            },
          )
          setReady(true)
        })

        let lastHoverId: number | null = null

        const resolveValue = (code: number): number | null => {
          const raw = valuesRef.current[code]
          return raw == null || !Number.isFinite(raw) ? null : raw
        }

        const resolveName = (code: number, fallback: string): string => {
          return namesRef.current[code] ?? fallback
        }

        const handleHover = (event: MapLayerMouseEvent) => {
          const feature = event.features?.[0]
          if (!feature || !map) return
          const code = Number(
            feature.properties?.provinceCode ?? feature.properties?.kode ?? 0,
          )
          const fallback = String(
            feature.properties?.provinceName ??
              feature.properties?.Propinsi ??
              'Provinsi',
          )
          setHovered({
            name: resolveName(code, fallback),
            code,
            value: resolveValue(code),
          })
          map.getCanvas().style.cursor = 'pointer'
          if (lastHoverId !== null && lastHoverId !== code) {
            map.setFeatureState(
              { source: 'indonesia-provinces', id: lastHoverId },
              { hover: false },
            )
          }
          map.setFeatureState(
            { source: 'indonesia-provinces', id: code },
            { hover: true },
          )
          lastHoverId = code
        }

        const handleLeave = () => {
          setHovered(null)
          if (!map) return
          map.getCanvas().style.cursor = ''
          if (lastHoverId !== null) {
            map.setFeatureState(
              { source: 'indonesia-provinces', id: lastHoverId },
              { hover: false },
            )
            lastHoverId = null
          }
        }

        const handleClick = (event: MapLayerMouseEvent) => {
          const feature = event.features?.[0]
          if (!feature) return
          const code = Number(
            feature.properties?.provinceCode ?? feature.properties?.kode ?? 0,
          )
          const fallback = String(
            feature.properties?.provinceName ??
              feature.properties?.Propinsi ??
              'Provinsi',
          )
          const province = {
            name: resolveName(code, fallback),
            code,
            value: resolveValue(code),
          }
          onClickRef.current?.(province)
        }

        map.on('mousemove', 'province-fill', handleHover)
        map.on('mouseleave', 'province-fill', handleLeave)
        map.on('click', 'province-fill', handleClick)
      } catch (cause) {
        if (active) {
          setError(
            cause instanceof Error ? cause.message : 'Peta gagal dimuat',
          )
        }
      }
    }

    void boot()

    return () => {
      active = false
      map?.remove()
      if (mapRef.current === map) mapRef.current = null
    }
  }, [bootKey])

  // Update fill colors when indicator values / scale change
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready || !map.getLayer('province-fill')) return
    const expr = buildFillColorExpression(valuesByCode, scale)
    // MapLibre expression typing is stricter than our builder return.
    map.setPaintProperty('province-fill', 'fill-color', expr as never)
  }, [valuesByCode, scale, ready])

  // Keep hover tooltip value in sync when indicator switches
  useEffect(() => {
    setHovered((prev) => {
      if (!prev) return prev
      const raw = valuesByCode[prev.code]
      const next = raw == null || !Number.isFinite(raw) ? null : raw
      if (next === prev.value) return prev
      return { ...prev, value: next }
    })
  }, [valuesByCode])

  if (error) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl bg-[#eef2f7] px-6 py-10">
        <div className="max-w-md text-center">
          <p className="text-[15px] font-bold text-navy-900">
            Peta tidak dapat ditampilkan
          </p>
          <p className="mt-2 text-[12px] text-slate-500">{error}</p>
          <button
            type="button"
            className="mt-4 rounded-xl bg-brand-500 px-4 py-2 text-[12px] font-semibold text-white"
            onClick={() => {
              setError(null)
              setReady(false)
              setBootKey((v) => v + 1)
            }}
          >
            Coba lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-xl bg-navy-50 ${heightClassName}`}>
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full"
        role="application"
        aria-label="Peta choropleth administratif provinsi Indonesia"
      />

      {!ready ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy-50/80">
          <p className="text-[13px] font-semibold text-slate-500">
            Memuat peta…
          </p>
        </div>
      ) : null}

      {level === 'kabupaten' ? (
        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 rounded-xl border border-[#e8c98a] bg-[#f7edd8]/95 px-3 py-2 text-[11px] leading-relaxed text-[#9a6b2f] shadow-sm sm:inset-x-auto sm:right-3 sm:max-w-xs">
          GeoJSON kabupaten belum dilampirkan. Outline saat ini hanya level
          Provinsi (34 batas). Drill kab/kota menyusul setelah batas ADM2
          tersedia.
        </div>
      ) : null}

      {hovered && ready ? (
        <div className="pointer-events-none absolute top-4 left-1/2 z-10 min-w-48 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 shadow-md">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] font-extrabold text-navy-950">
              {hovered.name}
            </span>
            <span className="rounded bg-navy-50 px-1.5 py-0.5 text-[9px] font-bold text-brand-500">
              KODE {hovered.code}
            </span>
          </div>
          <p className="mt-2 text-[13px] font-bold tabular-nums text-navy-950">
            {formatValue(hovered.value)}
          </p>
        </div>
      ) : null}

      {showLegend ? (
        <aside
          className="pointer-events-none absolute right-3 bottom-14 z-10 w-[min(100%-1.5rem,210px)] rounded-xl border border-slate-200/90 bg-white/95 p-3 shadow-md backdrop-blur-sm sm:bottom-16"
          aria-label="Legenda indikator peta"
        >
          <p className="text-[10px] font-extrabold tracking-wide text-slate-800 uppercase">
            {legendTitle}
          </p>
          {!hasData ? (
            <p className="mt-0.5 text-[9px] text-slate-400">
              Belum terhubung ke nilai indikator
            </p>
          ) : null}
          <ul className="mt-2 flex flex-col gap-1.5">
            {legendItems.map((item) => (
              <li
                key={item.key}
                className="flex items-start gap-2 text-[10px] leading-tight"
              >
                <span
                  className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-sm border border-black/5"
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                />
                <span className="min-w-0 font-bold text-slate-700">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}

      {ready && !hovered && !hasData ? (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 max-w-sm -translate-x-1/2 rounded-lg bg-white/90 px-3 py-1.5 text-center text-[11px] font-semibold text-slate-500 shadow-sm">
          {emptyHint}
        </div>
      ) : null}
    </div>
  )
}
