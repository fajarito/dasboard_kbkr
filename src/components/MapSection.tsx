import { Link } from 'react-router-dom'
import {
  formatPctId,
  OCT2026_SOURCE_CAPTION_UNMET,
  rankedProvinces,
  unmetNeedProvinceRows,
} from '../data/dummy/oct2026'
import { mapIndicatorById, valuesByCode } from '../data/mapIndicators'
import { IndonesiaChoroplethMap } from './IndonesiaChoroplethMap'

const unmetIndicator = mapIndicatorById['unmet-need']
const unmetRows = unmetNeedProvinceRows()
const highestUnmet = rankedProvinces(unmetRows, 'desc', 5)
const lowestUnmet = rankedProvinces(unmetRows, 'asc', 5)
const unmetByCode = valuesByCode(unmetIndicator.getRows())

export function MapSection() {
  return (
    <section
      id="peta"
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30"
    >
      <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-navy-950">
            Peta Capaian Indikator
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            Ranking Unmet Need · {OCT2026_SOURCE_CAPTION_UNMET} (38 Provinsi)
          </p>
        </div>
        <Link
          to="/peta"
          className="inline-flex shrink-0 self-start rounded-xl border border-brand-500/40 bg-white px-3.5 py-2 text-[12px] font-semibold text-brand-500 transition hover:bg-navy-50"
        >
          Buka Peta Capaian
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
        <IndonesiaChoroplethMap
          heightClassName="h-[280px] md:h-[320px]"
          showLegend={false}
          valuesByCode={unmetByCode}
          valueKind={unmetIndicator.kind}
          higherIsBetter={unmetIndicator.higherIsBetter}
          formatValue={unmetIndicator.formatValue}
          legendTitle={unmetIndicator.shortLabel}
        />

        <div className="flex flex-col justify-center gap-6 px-1 py-2 sm:px-3">
          <div>
            <p className="text-[13px] font-bold text-navy-950">
              5 Provinsi Unmet Need tertinggi
            </p>
            <ul className="mt-1.5 space-y-1">
              {highestUnmet.map((row) => (
                <li
                  key={row.kode}
                  className="flex items-baseline justify-between gap-2 text-[12px] text-slate-600"
                >
                  <span className="truncate font-medium text-navy-900">
                    {row.provinsi}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-navy-950">
                    {formatPctId(row.pct)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[13px] font-bold text-navy-950">
              5 Provinsi Unmet Need terendah
            </p>
            <ul className="mt-1.5 space-y-1">
              {lowestUnmet.map((row) => (
                <li
                  key={row.kode}
                  className="flex items-baseline justify-between gap-2 text-[12px] text-slate-600"
                >
                  <span className="truncate font-medium text-navy-900">
                    {row.provinsi}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-navy-950">
                    {formatPctId(row.pct)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Ranking dari {OCT2026_SOURCE_CAPTION_UNMET}. Buka Peta Capaian untuk
            memilih indikator lain. GeoJSON kabupaten belum dilampirkan.
          </p>
        </div>
      </div>
    </section>
  )
}
