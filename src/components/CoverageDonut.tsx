import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { coverageBands } from '../data/overview'

export function CoverageDonut() {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-200/40">
      <header className="mb-2">
        <h2 className="text-[15px] font-bold text-navy-950">Cakupan Wilayah</h2>
        <p className="mt-0.5 text-[12px] text-slate-500">
          Distribusi provinsi menurut kelompok capaian
        </p>
      </header>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative h-[220px] w-full max-w-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={coverageBands}
                dataKey="value"
                nameKey="label"
                innerRadius={62}
                outerRadius={88}
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

        <ul className="w-full space-y-2.5 sm:max-w-[160px]">
          {coverageBands.map((band) => (
            <li
              key={band.key}
              className="flex items-center justify-between gap-3 text-[12px]"
            >
              <span className="inline-flex items-center gap-2 text-slate-600">
                <span
                  className="h-2.5 w-2.5 rounded-[3px]"
                  style={{ backgroundColor: band.color }}
                />
                {band.label}
              </span>
              <span className="font-bold text-navy-950">{band.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
