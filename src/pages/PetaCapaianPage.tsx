import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout'
import { FilterBar } from '../components/FilterBar'
import { IndonesiaChoroplethMap } from '../components/IndonesiaChoroplethMap'
import {
  DEFAULT_MAP_INDICATOR_ID,
  mapIndicatorById,
  mapIndicators,
  nameByCode,
  valuesByCode,
  type MapIndicatorId,
} from '../data/mapIndicators'
import { OCT2026_LABEL } from '../data/dummy/oct2026'
import { rankedFromValues, type MapLevel } from '../lib/mapChoropleth'

export function PetaCapaianPage() {
  const [level, setLevel] = useState<MapLevel>('provinsi')
  const [indicatorId, setIndicatorId] = useState<MapIndicatorId>(
    DEFAULT_MAP_INDICATOR_ID,
  )
  const [selected, setSelected] = useState<{
    name: string
    code: number
    value: number | null
  } | null>(null)

  const indicator = mapIndicatorById[indicatorId]
  const rows = useMemo(() => indicator.getRows(), [indicator])
  const byCode = useMemo(() => valuesByCode(rows), [rows])
  const names = useMemo(() => nameByCode(rows), [rows])

  const highest = useMemo(
    () => rankedFromValues(rows, 'desc', 5),
    [rows],
  )
  const lowest = useMemo(() => rankedFromValues(rows, 'asc', 5), [rows])

  const selectedValue =
    selected == null
      ? null
      : selected.value != null
        ? selected.value
        : (byCode[selected.code] ?? null)
  const selectedName =
    selected == null
      ? null
      : names[selected.code] ?? selected.name

  return (
    <DashboardLayout mobileTitle="Peta Capaian">
      <div className="space-y-3">
        <nav
          className="flex flex-wrap items-center gap-1.5 text-[12px] text-slate-500"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="font-semibold text-brand-500 transition hover:text-brand-600"
          >
            Overview
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-navy-900">Peta Capaian</span>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[22px] font-extrabold tracking-tight text-navy-950 sm:text-[26px]">
              Peta Capaian Indikator
            </h1>
            <p className="mt-1 max-w-3xl text-[13px] text-slate-500 sm:text-[14px]">
              Choropleth Provinsi Indonesia (MapLibre). Pilih salah satu dari 12
              indikator prioritas untuk mewarnai peta — nilai dari snapshot{' '}
              {OCT2026_LABEL}.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex shrink-0 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-navy-900 shadow-sm transition hover:border-brand-500/40 hover:text-brand-500 sm:self-auto"
          >
            Kembali ke Overview
          </Link>
        </div>
      </div>

      <FilterBar
        periode={OCT2026_LABEL}
        wilayah="Nasional"
        level="Provinsi"
      />

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/40">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-medium text-slate-500">
            Indikator peta
          </span>
          <div className="relative max-w-md">
            <select
              value={indicatorId}
              onChange={(event) => {
                setIndicatorId(event.target.value as MapIndicatorId)
                setSelected(null)
              }}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-[13px] font-semibold text-navy-900 outline-none transition focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15"
              aria-label="Pilih indikator untuk choropleth"
            >
              {mapIndicators.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.overviewId}. {item.label}
                  {item.wired ? '' : ' (belum tersedia)'}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
              <ChevronDown />
            </span>
          </div>
        </label>
        <p className="mt-2 text-[11px] text-slate-400">
          {indicator.sourceCaption}
          {indicator.stubNote ? ` · ${indicator.stubNote}` : null}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1"
          role="tablist"
          aria-label="Level peta"
        >
          {(
            [
              { id: 'provinsi' as const, label: 'Provinsi' },
              { id: 'kabupaten' as const, label: 'Kabupaten' },
            ] as const
          ).map((item) => {
            const active = item.id === level
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setLevel(item.id)}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition ${
                  active
                    ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/25'
                    : 'text-slate-500 hover:bg-white hover:text-navy-900'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        <p className="text-[11px] text-slate-400">
          Sumber batas: BAKOSURTANAL / Dukcapil 2019 (34 Provinsi)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm shadow-slate-200/30 sm:p-4">
          <IndonesiaChoroplethMap
            level={level}
            valuesByCode={byCode}
            nameByCode={names}
            valueKind={indicator.kind}
            higherIsBetter={indicator.higherIsBetter}
            formatValue={indicator.formatValue}
            legendTitle={indicator.shortLabel}
            emptyHint={
              indicator.wired
                ? 'Tidak ada nilai Provinsi untuk indikator ini'
                : (indicator.stubNote ??
                  'Data capaian belum tersedia untuk indikator ini')
            }
            onProvinceClick={setSelected}
          />
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
            <h2 className="text-[15px] font-bold text-navy-950">
              Ringkasan wilayah
            </h2>
            {selected ? (
              <div className="mt-3 space-y-2">
                <p className="text-[14px] font-extrabold text-navy-950">
                  {selectedName}
                </p>
                <p className="text-[12px] text-slate-500">
                  Kode administrasi: {selected.code}
                </p>
                <p className="text-[20px] font-extrabold tabular-nums text-navy-950">
                  {indicator.formatValue(selectedValue)}
                </p>
                <p className="text-[11px] text-slate-400">
                  {indicator.label} · {OCT2026_LABEL}
                </p>
                {selectedValue == null && indicator.wired ? (
                  <p className="rounded-xl bg-[#eef2f7] px-3 py-3 text-[12px] leading-relaxed text-slate-600">
                    Provinsi ini tidak muncul di deret indikator (mis. batas
                    GeoJSON 2019 vs 38 Provinsi, atau Tabel hanya mencakup
                    sebagian wilayah).
                  </p>
                ) : null}
                {!indicator.wired ? (
                  <p className="rounded-xl bg-[#eef2f7] px-3 py-3 text-[12px] leading-relaxed text-slate-600">
                    {indicator.stubNote}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-[13px] text-slate-400">
                Klik Provinsi pada peta untuk melihat nilai{' '}
                {indicator.shortLabel}.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
            <h2 className="text-[15px] font-bold text-navy-950">
              5 Provinsi {indicator.shortLabel} tertinggi
            </h2>
            {highest.length > 0 ? (
              <ul className="mt-2 space-y-1.5">
                {highest.map((row) => (
                  <li
                    key={row.code}
                    className="flex items-baseline justify-between gap-2 text-[12px] text-slate-600"
                  >
                    <span className="truncate font-medium text-navy-900">
                      {row.name}
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-navy-950">
                      {indicator.formatValue(row.value)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[13px] text-slate-400">
                Data belum tersedia
              </p>
            )}
            <h2 className="mt-5 text-[15px] font-bold text-navy-950">
              5 Provinsi {indicator.shortLabel} terendah
            </h2>
            {lowest.length > 0 ? (
              <ul className="mt-2 space-y-1.5">
                {lowest.map((row) => (
                  <li
                    key={row.code}
                    className="flex items-baseline justify-between gap-2 text-[12px] text-slate-600"
                  >
                    <span className="truncate font-medium text-navy-900">
                      {row.name}
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-navy-950">
                      {indicator.formatValue(row.value)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[13px] text-slate-400">
                Data belum tersedia
              </p>
            )}
          </section>
        </aside>
      </div>
    </DashboardLayout>
  )
}

function ChevronDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="text-slate-400"
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
