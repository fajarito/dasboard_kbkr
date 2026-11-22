import { useState } from 'react'
import { CatatanAnalitik } from '../components/CatatanAnalitik'
import { DashboardLayout } from '../components/DashboardLayout'
import { DetailKpiCard } from '../components/DetailKpiCard'
import { DetailPageHeader } from '../components/DetailPageHeader'
import { FilterBar } from '../components/FilterBar'
import { IndicatorTrendPanel } from '../components/IndicatorTrendPanel'
import { WilayahBreakdown } from '../components/WilayahBreakdown'
import { fourTMeta, fourTNotes } from '../data/fourT'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'

export function FourTDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')

  return (
    <DashboardLayout mobileTitle="Detail 4T">
      <DetailPageHeader
        crumbLabel={fourTMeta.shortName}
        title={fourTMeta.title}
        subtitle={fourTMeta.subtitle}
        indikatorPath="/indikator/4t"
      />

      <FilterBar
        periode="Jan – Jun 2026"
        wilayah="Nasional"
        level={levelLabel(level)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailKpiCard
          label="Capaian saat ini"
          value={fourTMeta.capaian}
          footnote={
            <span className="inline-flex items-center gap-1 font-semibold text-trend">
              <ArrowDown />−{fourTMeta.capaianDelta}
            </span>
          }
        />
        <DetailKpiCard
          label="Target"
          value={fourTMeta.target}
          valueClassName="text-[15px] leading-snug sm:text-[17px]"
          footnote={
            <span className="font-medium text-amber-warn">
              {fourTMeta.targetNote}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={fourTMeta.sumber}
          valueClassName="text-[16px] sm:text-[18px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {fourTMeta.sumberNote}
              <span className="mt-1 block text-[11px] text-slate-400">
                {fourTMeta.strength}
              </span>
            </span>
          }
        />
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm shadow-slate-200/30 sm:px-5">
        <p className="text-[12px] leading-relaxed text-slate-500">
          <span className="font-semibold text-navy-900">BNBA:</span> data
          individual tersedia lewat Elsimil IBU HAMIL Tabel 4 (DETAIL BUMIL
          TEREGISTER). Level kecamatan/faskes relevan untuk pemodelan
          service-statistic dan daftar individu; agregat kab/kota dari Tabel 1.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title="Tren 4T Nasional"
          defaultPeriod="bulanan"
          annualSubtitle="Seri tahunan / kumulatif · ≥5 tahun (RPJMN) · skala 0–100%"
          monthlySubtitle="Seri bulanan · ≥36 bulan (Elsimil Bumil) · skala 0–100%"
          monthlyStubDetail="Seri bulanan belum tersedia. Akan diisi dari Elsimil Bumil Tabel 1 (Bulanan) lewat report-siga-elsimil-ocp. Capaian Overview 16,7% saja yang ditampilkan — tidak ada deret yang dikarang."
          annualStubDetail="Seri tahunan/kumulatif belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (16,7%) di kartu KPI."
        />
        <CatatanAnalitik notes={fourTNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="4T"
        indicatorName="4T"
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
