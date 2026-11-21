import { useState } from 'react'

const tabs = [
  'Top 5 provinsi tertinggi',
  'Top 5 provinsi prioritas',
] as const

export function MapSection() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(tabs[0])

  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-200/40">
      <header className="mb-4">
        <h2 className="text-[15px] font-bold text-navy-950">
          Peta Capaian Indikator
        </h2>
        <p className="mt-0.5 text-[12px] text-slate-500">
          Identifikasi wilayah prioritas berdasarkan capaian
        </p>
      </header>

      <div className="flex min-h-[180px] items-center justify-center rounded-xl bg-slate-100 px-4 py-10">
        <div className="text-center">
          <p className="text-[14px] font-bold tracking-[0.08em] text-slate-500 uppercase">
            Peta Indonesia
          </p>
          <p className="mt-2 text-[12px] font-medium text-slate-400">
            data belum tersedia
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl border px-3 py-2.5 text-[12px] font-semibold transition ${
              activeTab === tab
                ? 'border-brand-500/40 bg-navy-50 text-brand-600'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center">
        <p className="text-[12px] font-semibold text-slate-500">
          Peringkat regional — {activeTab}
        </p>
        <p className="mt-1 text-[13px] font-medium text-slate-400">
          data belum tersedia
        </p>
      </div>
    </section>
  )
}
