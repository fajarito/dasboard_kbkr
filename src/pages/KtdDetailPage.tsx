import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CatatanAnalitik } from '../components/CatatanAnalitik'
import { DashboardLayout } from '../components/DashboardLayout'
import { DetailKpiCard } from '../components/DetailKpiCard'
import { DetailPageHeader } from '../components/DetailPageHeader'
import { FilterBar } from '../components/FilterBar'
import { IndicatorTrendPanel } from '../components/IndicatorTrendPanel'
import { WilayahBreakdown } from '../components/WilayahBreakdown'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'
import { ktdMeta, ktdNotes } from '../data/ktd'

export function KtdDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')

  return (
    <DashboardLayout mobileTitle="Detail KTD">
      <DetailPageHeader
        crumbLabel={ktdMeta.shortName}
        title={ktdMeta.title}
        subtitle={ktdMeta.subtitle}
        indikatorPath="/indikator/ktd"
      />

      <FilterBar
        periode="Jan – Jun 2026"
        wilayah="Nasional"
        level={levelLabel(level)}
      />

      <div className="rounded-2xl border border-[#e8c98a] bg-[#f7edd8] px-4 py-3 sm:px-5">
        <p className="text-[12px] leading-relaxed text-[#9a6b2f]">
          <span className="font-bold">Gap sumber (SIGA #4):</span> field intensi
          kehamilan belum terkonfirmasi di katalog. Angka Overview bersifat
          placeholder hingga DALLAP T16 / Elsimil T2·T4 diverifikasi. Lihat juga{' '}
          <Link
            to="/indikator/unmet-need"
            className="font-semibold text-brand-600 underline-offset-2 hover:underline"
          >
            Unmet Need
          </Link>{' '}
          (berbagi DALLAP Tabel 16 sebagai proksi).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailKpiCard
          label="Capaian saat ini"
          value={ktdMeta.capaian}
          footnote={
            <span className="inline-flex items-center gap-1 font-semibold text-trend">
              <ArrowDown />−{ktdMeta.capaianDelta}
            </span>
          }
        />
        <DetailKpiCard
          label="Target"
          value={ktdMeta.target}
          valueClassName="text-[15px] leading-snug sm:text-[17px]"
          footnote={
            <span className="font-medium text-amber-warn">
              {ktdMeta.targetNote}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={ktdMeta.sumber}
          valueClassName="text-[15px] sm:text-[17px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {ktdMeta.sumberNote}
              <span className="mt-1 block text-[11px] font-semibold text-[#b45309]">
                {ktdMeta.strength}
              </span>
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title="Tren KTD Nasional"
          defaultPeriod="bulanan"
          annualSubtitle="Seri tahunan · ≥5 tahun (RPJMN) · skala 0–100%"
          monthlySubtitle="Seri bulanan · ≥36 bulan · skala 0–100%"
          monthlyStubDetail="Seri bulanan belum tersedia. Akan diisi setelah field intensi KTD terkonfirmasi di DALLAP Tabel 16 dan/atau Elsimil T2/T4. Capaian Overview 10,8% saja yang ditampilkan — tidak ada deret yang dikarang."
          annualStubDetail="Seri tahunan belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (10,8%) di kartu KPI."
        />
        <CatatanAnalitik notes={ktdNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="KTD"
        indicatorName="KTD"
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
