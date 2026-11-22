import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CatatanAnalitik } from '../components/CatatanAnalitik'
import { DashboardLayout } from '../components/DashboardLayout'
import { DetailKpiCard } from '../components/DetailKpiCard'
import { DetailPageHeader } from '../components/DetailPageHeader'
import { FilterBar } from '../components/FilterBar'
import { IndicatorTrendPanel } from '../components/IndicatorTrendPanel'
import { WilayahBreakdown } from '../components/WilayahBreakdown'
import {
  demandSatisfiedMeta,
  demandSatisfiedNotes,
} from '../data/demandSatisfied'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'

export function DemandSatisfiedDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')

  return (
    <DashboardLayout mobileTitle="Detail Demand Satisfied">
      <DetailPageHeader
        crumbLabel={demandSatisfiedMeta.shortName}
        title={demandSatisfiedMeta.title}
        subtitle={demandSatisfiedMeta.subtitle}
        indikatorPath="/indikator/demand-satisfied"
      />

      <FilterBar
        periode="Jan – Jun 2026"
        wilayah="Nasional"
        level={levelLabel(level)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailKpiCard
          label="Capaian saat ini"
          value={demandSatisfiedMeta.capaian}
          footnote={
            <span className="inline-flex items-center gap-1 font-semibold text-trend">
              <ArrowUp />+{demandSatisfiedMeta.capaianDelta}
            </span>
          }
        />
        <DetailKpiCard
          label="Target"
          value={demandSatisfiedMeta.target}
          valueClassName="text-[15px] leading-snug sm:text-[17px]"
          footnote={
            <span className="font-medium text-amber-warn">
              {demandSatisfiedMeta.targetNote}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={demandSatisfiedMeta.sumber}
          valueClassName="text-[16px] sm:text-[18px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {demandSatisfiedMeta.sumberNote}
              <span className="mt-1 block text-[11px] text-slate-400">
                {demandSatisfiedMeta.strength}
              </span>
            </span>
          }
        />
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm shadow-slate-200/30 sm:px-5">
        <p className="text-[12px] text-slate-500">
          Komponen derivasi:{' '}
          <Link
            to="/indikator/mcpr"
            className="font-semibold text-brand-500 hover:text-brand-600"
          >
            Detail mCPR
          </Link>
          {' · '}
          <Link
            to="/indikator/unmet-need"
            className="font-semibold text-brand-500 hover:text-brand-600"
          >
            Detail Unmet Need
          </Link>
          <span className="text-slate-400">
            {' '}
            — Demand Satisfied dihitung dari keduanya (SIGA #5).
          </span>
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title="Tren Demand Satisfied Nasional"
          defaultPeriod="bulanan"
          annualSubtitle="Seri tahunan · ≥5 tahun (opsional / RPJMN) · skala 0–100%"
          monthlySubtitle="Seri bulanan · ≥36 bulan (turunan DALLAP T10–16) · skala 0–100%"
          monthlyStubDetail="Seri bulanan belum tersedia. Nilai akan dihitung dari deret mCPR + Unmet Need (DALLAP Tabel 10–16) setelah kedua sumber terhubung. Capaian Overview 88,1% saja yang ditampilkan — tidak ada deret yang dikarang."
          annualStubDetail="Seri tahunan belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (88,1%) di kartu KPI."
        />
        <CatatanAnalitik notes={demandSatisfiedNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="Demand Sat."
        indicatorName="Demand Satisfied"
      />
    </DashboardLayout>
  )
}

function ArrowUp() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <path d="M5 1.5 L8.5 7 H1.5 Z" fill="currentColor" />
    </svg>
  )
}
