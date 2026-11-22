import { useState } from 'react'
import { ComparisonBars } from './components/ComparisonBars'
import { CoverageDonut } from './components/CoverageDonut'
import { FilterBar } from './components/FilterBar'
import { IndicatorGrid } from './components/IndicatorGrid'
import { MapSection } from './components/MapSection'
import { Sidebar } from './components/Sidebar'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-svh bg-navy-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200/80 bg-navy-50/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white p-2 text-navy-900 shadow-sm"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <MenuIcon />
          </button>
          <div>
            <p className="text-[13px] font-bold text-navy-950">
              Kemendukbangga
            </p>
            <p className="text-[11px] text-slate-500">Overview</p>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <div className="mx-auto max-w-[1280px] space-y-5">
            <div>
              <h1 className="text-[22px] font-extrabold tracking-tight text-navy-950 sm:text-[26px]">
                Dashboard 12 Indikator Prioritas
              </h1>
              <p className="mt-1 max-w-3xl text-[13px] text-slate-500 sm:text-[14px]">
                Pemantauan capaian indikator dan sebaran wilayah prioritas
                secara nasional hingga wilayah.
              </p>
            </div>

            <FilterBar />
            <IndicatorGrid />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_1fr]">
              <ComparisonBars />
              <CoverageDonut />
            </div>

            <MapSection />
          </div>
        </main>
      </div>
    </div>
  )
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
