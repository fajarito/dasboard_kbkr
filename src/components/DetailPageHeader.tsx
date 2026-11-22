import { Link } from 'react-router-dom'

type DetailPageHeaderProps = {
  crumbLabel: string
  title: string
  subtitle: string
  indikatorPath: string
}

export function DetailPageHeader({
  crumbLabel,
  title,
  subtitle,
  indikatorPath,
}: DetailPageHeaderProps) {
  return (
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
          to={indikatorPath}
          className="font-semibold text-brand-500 transition hover:text-brand-600"
        >
          12 Indikator
        </Link>
        <Chevron />
        <span className="font-semibold text-navy-900">{crumbLabel}</span>
      </nav>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-navy-950 sm:text-[26px]">
            {title}
          </h1>
          <p className="mt-1 max-w-3xl text-[13px] text-slate-500 sm:text-[14px]">
            {subtitle}
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
  )
}

function Chevron() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className="text-slate-300"
      aria-hidden
    >
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
