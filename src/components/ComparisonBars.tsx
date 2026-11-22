import { comparisonBars } from '../data/overview'

export function ComparisonBars() {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
      <header className="mb-5">
        <h2 className="text-[15px] font-bold text-navy-950">
          Perbandingan Indikator Utama
        </h2>
        <p className="mt-0.5 text-[12px] text-slate-500">
          Capaian nasional • Jan–Jun 2026
        </p>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-5">
        {comparisonBars.map((bar) => (
          <div key={bar.key} className="grid grid-cols-[110px_1fr_52px] items-center gap-3 sm:grid-cols-[140px_1fr_56px]">
            <p className="text-[13px] font-semibold text-navy-900">{bar.label}</p>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${bar.value}%`, backgroundColor: bar.color }}
              />
            </div>
            <p className="text-right text-[13px] font-bold text-navy-950">
              {bar.valueLabel}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-[11px] text-slate-400">
        Skala 0–100% • Tren bulanan belum tersedia.
      </p>
    </section>
  )
}
