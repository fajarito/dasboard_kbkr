import { useState } from 'react'
import { CatatanAnalitik } from '../components/CatatanAnalitik'
import { DashboardLayout } from '../components/DashboardLayout'
import { DetailKpiCard } from '../components/DetailKpiCard'
import { DetailPageHeader } from '../components/DetailPageHeader'
import { FilterBar } from '../components/FilterBar'
import { McprTrendChart } from '../components/McprTrendChart'
import { WilayahBreakdown } from '../components/WilayahBreakdown'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'
import { mcprMeta, mcprNotes } from '../data/mcpr'

export function McprDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')

  return (
    <DashboardLayout mobileTitle="Detail mCPR">
      <DetailPageHeader
        crumbLabel="mCPR"
        title={mcprMeta.title}
        subtitle={mcprMeta.subtitle}
        indikatorPath="/indikator/mcpr"
      />

      <FilterBar
        periode="Jan – Jun 2026"
        wilayah="Nasional"
        level={levelLabel(level)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailKpiCard
          label="Capaian saat ini"
          value={mcprMeta.capaian}
          footnote={
            <span className="inline-flex items-center gap-1 font-semibold text-trend">
              <ArrowUp />+{mcprMeta.capaianDelta}
            </span>
          }
        />
        <DetailKpiCard
          label="Target"
          value={mcprMeta.target}
          footnote={
            <span className="font-semibold text-amber-warn">
              Selisih {mcprMeta.selisih}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={mcprMeta.sumber}
          valueClassName="text-[17px] sm:text-[19px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {mcprMeta.sumberNote}
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <McprTrendChart />
        <CatatanAnalitik notes={mcprNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="mCPR"
        indicatorName="mCPR"
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
