import { useState } from 'react'
import { CatatanAnalitik } from '../components/CatatanAnalitik'
import { DashboardLayout } from '../components/DashboardLayout'
import { DetailKpiCard } from '../components/DetailKpiCard'
import { DetailPageHeader } from '../components/DetailPageHeader'
import { FilterBar } from '../components/FilterBar'
import { IndicatorTrendPanel } from '../components/IndicatorTrendPanel'
import { WilayahBreakdown } from '../components/WilayahBreakdown'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'
import { unmetNeedMeta, unmetNeedNotes } from '../data/unmetNeed'

export function UnmetNeedDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')

  return (
    <DashboardLayout mobileTitle="Detail Unmet Need">
      <DetailPageHeader
        crumbLabel={unmetNeedMeta.shortName}
        title={unmetNeedMeta.title}
        subtitle={unmetNeedMeta.subtitle}
        indikatorPath="/indikator/unmet-need"
      />

      <FilterBar
        periode="Jan – Jun 2026"
        wilayah="Nasional"
        level={levelLabel(level)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailKpiCard
          label="Capaian saat ini"
          value={unmetNeedMeta.capaian}
          footnote={
            <span className="inline-flex items-center gap-1 font-semibold text-trend">
              <ArrowDown />−{unmetNeedMeta.capaianDelta}
            </span>
          }
        />
        <DetailKpiCard
          label="Target"
          value={unmetNeedMeta.target}
          valueClassName="text-[15px] sm:text-[17px] leading-snug"
          footnote={
            <span className="font-medium text-amber-warn">
              {unmetNeedMeta.targetNote}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={unmetNeedMeta.sumber}
          valueClassName="text-[16px] sm:text-[18px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {unmetNeedMeta.sumberNote}
              <span className="mt-1 block text-[11px] text-slate-400">
                {unmetNeedMeta.strength}
              </span>
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title="Tren Unmet Need Nasional"
          defaultPeriod="bulanan"
          annualSubtitle="Seri tahunan · ≥5 tahun (opsional / RPJMN) · skala 0–100%"
          monthlySubtitle="Seri bulanan primer · ≥36 bulan (DALLAP Bulanan) · skala 0–100%"
          monthlyStubDetail="Seri bulanan (≥36 bulan) akan diisi dari DALLAP Bulanan Tabel 16 (+ denom Tabel 10). Capaian saat ini 11,2% dari Overview; angka deret bulanan tidak diisi sementara."
          annualStubDetail="Seri tahunan opsional belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (11,2%) yang ditampilkan di kartu KPI."
        />
        <CatatanAnalitik notes={unmetNeedNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="Unmet Need"
        indicatorName="Unmet Need"
      />
    </DashboardLayout>
  )
}

function ArrowDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <path d="M5 8.5 L1.5 3 H8.5 Z" fill="currentColor" />
    </svg>
  )
}
