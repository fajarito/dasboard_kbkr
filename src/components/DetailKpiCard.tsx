import type { ReactNode } from 'react'

type DetailKpiCardProps = {
  label: string
  value: string
  footnote?: ReactNode
  valueClassName?: string
}

export function DetailKpiCard({
  label,
  value,
  footnote,
  valueClassName = 'text-[26px] sm:text-[28px]',
}: DetailKpiCardProps) {
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
      {footnote != null ? (
        <div className="mt-2.5 text-[12px]">{footnote}</div>
      ) : null}
    </article>
  )
}
