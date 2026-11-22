import { ComparisonBars } from '../components/ComparisonBars'
import { CoverageDonut } from '../components/CoverageDonut'
import { DashboardLayout } from '../components/DashboardLayout'
import { FilterBar } from '../components/FilterBar'
import { IndicatorGrid } from '../components/IndicatorGrid'
import { MapSection } from '../components/MapSection'

export function OverviewPage() {
  return (
    <DashboardLayout mobileTitle="Overview">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-navy-950 sm:text-[26px]">
          Dashboard 12 Indikator Prioritas
        </h1>
        <p className="mt-1 max-w-3xl text-[13px] text-slate-500 sm:text-[14px]">
          Pemantauan capaian indikator dan sebaran wilayah prioritas secara
          nasional hingga wilayah.
        </p>
      </div>

      <FilterBar />
      <IndicatorGrid />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_1fr]">
        <ComparisonBars />
        <CoverageDonut />
      </div>

      <MapSection />
    </DashboardLayout>
  )
}
