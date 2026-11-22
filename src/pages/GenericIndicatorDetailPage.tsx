import { useState } from 'react'
import { CatatanAnalitik } from '../components/CatatanAnalitik'
import { DashboardLayout } from '../components/DashboardLayout'
import { DetailKpiCard } from '../components/DetailKpiCard'
import { DetailPageHeader } from '../components/DetailPageHeader'
import { FilterBar } from '../components/FilterBar'
import { IndicatorTrendPanel } from '../components/IndicatorTrendPanel'
import { WilayahBreakdown } from '../components/WilayahBreakdown'
import type { IndicatorDetailConfig } from '../data/remainingIndicators'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'

type Props = {
  config: IndicatorDetailConfig
}

export function GenericIndicatorDetailPage({ config }: Props) {
  const [level, setLevel] = useState<GeoLevel>('nasional')
  const path = `/indikator/${config.slug}`
  const strengthClass =
    config.strengthTone === 'ok'
      ? 'text-trend'
      : config.strengthTone === 'weak'
        ? 'text-[#b45309]'
        : 'text-amber-warn'

  return (
    <DashboardLayout mobileTitle={`Detail ${config.shortName}`}>
      <DetailPageHeader
        crumbLabel={config.shortName}
        title={config.title}
        subtitle={config.subtitle}
        indikatorPath={path}
      />

      <FilterBar
        periode="Jan – Jun 2026"
        wilayah="Nasional"
        level={levelLabel(level)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailKpiCard
          label="Capaian saat ini"
          value={config.capaian}
          valueClassName={
            config.capaianPending
              ? 'text-[22px] sm:text-[24px]'
              : 'text-[26px] sm:text-[28px]'
          }
          footnote={
            config.capaianPending ? (
              <span className="font-semibold text-[#b45309]">
                {config.capaianPendingLabel}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-trend">
                {config.capaianDirection === 'down' ? <ArrowDown /> : <ArrowUp />}
                {config.capaianDirection === 'down' ? '−' : '+'}
                {config.capaianDelta}
              </span>
            )
          }
        />
        <DetailKpiCard
          label="Target"
          value={config.target}
          valueClassName="text-[15px] leading-snug sm:text-[17px]"
          footnote={
            <span className="font-medium text-amber-warn">{config.targetNote}</span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={config.sumber}
          valueClassName="text-[15px] sm:text-[17px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {config.sumberNote}
              <span
                className={`mt-1 block text-[11px] font-semibold ${strengthClass}`}
              >
                {config.strength}
              </span>
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title={`Tren ${config.shortName} Nasional`}
          defaultPeriod={config.defaultTrendPeriod ?? 'bulanan'}
          monthlyStubDetail={config.monthlyStubDetail}
          annualStubDetail={config.annualStubDetail}
        />
        <CatatanAnalitik notes={config.notes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn={config.metricColumn}
        indicatorName={config.shortName}
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

function ArrowDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <path d="M5 8.5 L1.5 3 H8.5 Z" fill="currentColor" />
    </svg>
  )
}
