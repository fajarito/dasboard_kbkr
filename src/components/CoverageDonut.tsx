import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { coverageBands } from '../data/overview'

export function CoverageDonut() {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
      <header className="mb-2">
        <h2 className="text-[15px] font-bold text-navy-950">Cakupan Wilayah</h2>
        <p className="mt-0.5 text-[12px] text-slate-500">
          Distribusi 38 Provinsi menurut mCPR (Dallap Tabel 11 - SIGA)
        </p>
      </header>

      <div className="flex flex-1 flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative h-[200px] w-full max-w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={coverageBands}
                dataKey="value"
                nameKey="label"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={2}
                stroke="none"
              >
                {coverageBands.map((band) => (
                  <Cell key={band.key} fill={band.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[28px] leading-none font-extrabold text-navy-950">
              38
            </p>
            <p className="mt-1 text-[12px] font-medium text-slate-500">
              Provinsi
            </p>
          </div>
        </div>

        <ul className="w-full space-y-2.5 sm:max-w-[150px]">
          {coverageBands.map((band) => (
            <li
              key={band.key}
              className="flex items-center justify-between gap-3 text-[12px]"
            >
              <span className="inline-flex items-center gap-2 text-slate-600">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: band.color }}
                />
                {band.label}
              </span>
              <span className="font-bold text-navy-950">{band.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-[11px] text-slate-400">
        Indikator dasar pengelompokan perlu dikonfirmasi.
      </p>
    </section>
  )
}
