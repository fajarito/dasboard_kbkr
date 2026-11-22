import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout'
import { FilterBar } from '../components/FilterBar'
import { IndonesiaChoroplethMap } from '../components/IndonesiaChoroplethMap'
import type { MapLevel } from '../lib/mapChoropleth'

export function PetaCapaianPage() {
  const [level, setLevel] = useState<MapLevel>('provinsi')
  const [selected, setSelected] = useState<{ name: string; code: number } | null>(
    null,
  )

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
              Choropleth administratif Indonesia (MapLibre + GeoJSON Provinsi).
              Nilai indikator per wilayah belum diisi — peta menampilkan outline
              dan status kosong.
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

      <FilterBar periode="Jan – Jun 2026" wilayah="Nasional" level="Provinsi" />

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
                  {selected.name}
                </p>
                <p className="text-[12px] text-slate-500">
                  Kode administrasi: {selected.code}
                </p>
                <p className="rounded-xl bg-[#eef2f7] px-3 py-3 text-[12px] leading-relaxed text-slate-600">
                  Data capaian indikator untuk wilayah ini belum tersedia.
                  Choropleth akan diwarnai setelah dataset per Provinsi (dan
                  Kabupaten) terhubung — tidak ada nilai yang dikarang.
                </p>
              </div>
            ) : (
              <p className="mt-3 text-[13px] text-slate-400">
                Klik Provinsi pada peta untuk melihat ringkasan. Saat ini hanya
                outline batas.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
            <h2 className="text-[15px] font-bold text-navy-950">
              5 provinsi tertinggi
            </h2>
            <p className="mt-2 text-[13px] text-slate-400">Data belum tersedia</p>
            <h2 className="mt-5 text-[15px] font-bold text-navy-950">
              5 provinsi prioritas
            </h2>
            <p className="mt-2 text-[13px] text-slate-400">Data belum tersedia</p>
          </section>
        </aside>
      </div>
    </DashboardLayout>
  )
}
