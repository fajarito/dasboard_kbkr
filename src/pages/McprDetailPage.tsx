import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../components/DashboardLayout'
import { FilterBar } from '../components/FilterBar'
import { McprTrendChart } from '../components/McprTrendChart'
import { WilayahBreakdown } from '../components/WilayahBreakdown'
import { mcprMeta, mcprNotes, type GeoLevel } from '../data/mcpr'

export function McprDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')

  const levelLabel =
    level === 'nasional'
      ? 'Nasional'
      : level === 'provinsi'
        ? 'Provinsi'
        : 'Kabupaten'

  return (
    <DashboardLayout mobileTitle="Detail mCPR">
      <div className="space-y-3">
        <nav
          className="flex flex-wrap items-center gap-1.5 text-[12px] text-slate-500"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="font-semibold text-brand-500 transition hover:text-brand-600"
          >
            Overview
          </Link>
          <Chevron />
          <Link
            to="/indikator/mcpr"
            className="font-semibold text-brand-500 transition hover:text-brand-600"
          >
            12 Indikator
          </Link>
          <Chevron />
          <span className="font-semibold text-navy-900">mCPR</span>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[22px] font-extrabold tracking-tight text-navy-950 sm:text-[26px]">
              {mcprMeta.title}
            </h1>
            <p className="mt-1 max-w-3xl text-[13px] text-slate-500 sm:text-[14px]">
              {mcprMeta.subtitle}
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[12px] font-semibold text-navy-900 shadow-sm transition hover:border-brand-500/40 hover:text-brand-500 sm:self-auto"
          >
            <BackIcon />
            Kembali ke Overview
          </Link>
        </div>
      </div>

      <FilterBar
        periode="Jan – Jun 2026"
        wilayah="Nasional"
        level={levelLabel}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard
          label="Capaian saat ini"
          value={mcprMeta.capaian}
          footnote={
            <span className="inline-flex items-center gap-1 font-semibold text-trend">
              <ArrowUp />+{mcprMeta.capaianDelta}
            </span>
          }
        />
        <KpiCard
          label="Target"
          value={mcprMeta.target}
          footnote={
            <span className="font-semibold text-amber-warn">
              Selisih {mcprMeta.selisih}
            </span>
          }
        />
        <KpiCard
          label="Sumber data"
          value={mcprMeta.sumber}
          valueClassName="text-[18px] sm:text-[20px]"
          footnote={
            <span className="font-medium text-slate-500">
              {mcprMeta.sumberNote}
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <McprTrendChart />

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
          <header className="mb-4">
            <h2 className="text-[15px] font-bold text-navy-950">
              Catatan Analitik
            </h2>
            <p className="mt-0.5 text-[12px] text-slate-500">
              Ringkasan kualitas data dan arah analisis
            </p>
          </header>
          <ul className="space-y-3">
            {mcprNotes.map((note) => (
              <li key={note} className="flex gap-2.5 text-[13px] leading-relaxed text-navy-900">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                  aria-hidden
                />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <WilayahBreakdown level={level} onLevelChange={setLevel} />
    </DashboardLayout>
  )
}

function KpiCard({
  label,
  value,
  footnote,
  valueClassName = 'text-[26px] sm:text-[28px]',
}: {
  label: string
  value: string
  footnote: ReactNode
  valueClassName?: string
}) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/30 sm:p-5">
      <p className="text-[11px] font-semibold tracking-[0.06em] text-slate-400 uppercase">
        {label}
      </p>
      <p
        className={`mt-2 leading-none font-extrabold tracking-tight text-navy-950 ${valueClassName}`}
      >
        {value}
      </p>
      <div className="mt-2.5 text-[12px]">{footnote}</div>
    </article>
  )
}

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" className="text-slate-300" aria-hidden>
      <path
        d="M4.5 2.5 L8 6 L4.5 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M8.5 3.5 L5 7 L8.5 10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowUp() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <path d="M5 1.5 L8.5 7 H1.5 Z" fill="currentColor" />
    </svg>
  )
}
