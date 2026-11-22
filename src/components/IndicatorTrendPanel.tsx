import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  trendPeriods,
  type TrendPeriod,
} from '../data/indicatorShared'

export type TrendPoint = {
  period: string
  value: number
  label: string
}

type IndicatorTrendPanelProps = {
  title: string
  defaultPeriod?: TrendPeriod
  /** Known annual series; omit or empty → stub (no invented values). */
  annualSeries?: readonly TrendPoint[]
  monthlyStubDetail: string
  annualStubDetail: string
  annualSubtitle?: string
  monthlySubtitle?: string
}

export function IndicatorTrendPanel({
  title,
  defaultPeriod = 'tahunan',
  annualSeries,
  monthlyStubDetail,
  annualStubDetail,
  annualSubtitle = 'Seri tahunan · ≥5 tahun (baseline/target RPJMN) · skala 0–100%',
  monthlySubtitle = 'Seri bulanan · ≥36 bulan · skala 0–100%',
}: IndicatorTrendPanelProps) {
  const [period, setPeriod] = useState<TrendPeriod>(defaultPeriod)
  const hasAnnual = Boolean(annualSeries && annualSeries.length > 0)

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-navy-950">{title}</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            {period === 'tahunan' ? annualSubtitle : monthlySubtitle}
          </p>
        </div>

        <div
          className="inline-flex shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-1"
          role="tablist"
          aria-label="Periode tren"
        >
          {trendPeriods.map((item) => {
            const active = item.id === period
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setPeriod(item.id)}
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
      </header>

      {period === 'tahunan' ? (
        hasAnnual ? (
          <AnnualChart series={annualSeries!} />
        ) : (
          <SeriesStub
            title="Tren tahunan belum tersedia"
            body={annualStubDetail}
          />
        )
      ) : (
        <SeriesStub
          title="Tren bulanan belum tersedia"
          body={monthlyStubDetail}
        />
      )}
    </section>
  )
}

function AnnualChart({ series }: { series: readonly TrendPoint[] }) {
  return (
    <>
      <div className="min-h-[240px] flex-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={240}>
          <BarChart
            data={[...series]}
            margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
            barCategoryGap="28%"
          >
            <CartesianGrid
              vertical={false}
              stroke="#e8eef8"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              width={36}
            />
            <Tooltip
              cursor={{ fill: 'rgba(56, 109, 227, 0.06)' }}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                fontSize: 12,
              }}
              formatter={(value) => [`${value}%`, 'Nilai']}
            />
            <Bar dataKey="value" radius={[8, 8, 4, 4]} maxBarSize={42}>
              {series.map((entry, index) => (
                <Cell
                  key={entry.period}
                  fill={index === series.length - 1 ? '#2f5fd0' : '#386de3'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-3">
        {series.map((entry) => (
          <p key={entry.period} className="text-[11px] text-slate-500">
            <span className="font-semibold text-navy-900">{entry.period}</span>
            {' · '}
            {entry.label}
          </p>
        ))}
      </div>
    </>
  )
}

function SeriesStub({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-h-[240px] flex-1 items-center justify-center rounded-xl bg-[#eef2f7] px-6 py-10">
      <div className="max-w-md text-center">
        <p className="text-[15px] font-bold text-navy-900">{title}</p>
        <p className="mt-2 text-[12px] leading-relaxed text-slate-500">{body}</p>
      </div>
    </div>
  )
}
