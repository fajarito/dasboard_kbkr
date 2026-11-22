import { Link } from 'react-router-dom'
import { IndonesiaChoroplethMap } from './IndonesiaChoroplethMap'

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
            Outline Provinsi (MapLibre) — nilai capaian belum tersedia
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
        />

        <div className="flex flex-col justify-center gap-6 px-1 py-2 sm:px-3">
          <div>
            <p className="text-[13px] font-bold text-navy-950">
              5 provinsi tertinggi
            </p>
            <p className="mt-1 text-[13px] text-slate-400">
              Data belum tersedia
            </p>
          </div>
          <div>
            <p className="text-[13px] font-bold text-navy-950">
              5 provinsi prioritas
            </p>
            <p className="mt-1 text-[13px] text-slate-400">
              Data belum tersedia
            </p>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Legenda dan warna choropleth akan aktif setelah data indikator per
            Provinsi terhubung. Tidak ada angka wilayah yang dikarang.
          </p>
        </div>
      </div>
    </section>
  )
}
