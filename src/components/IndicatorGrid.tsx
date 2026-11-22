import { Link } from 'react-router-dom'
import { detailPathByOverviewId } from '../data/remainingIndicators'
import { indicators, type Indicator } from '../data/overview'

export function IndicatorGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {indicators.map((item) => (
        <IndicatorCard key={item.id} item={item} />
      ))}
    </div>
  )
}

function IndicatorCard({ item }: { item: Indicator }) {
  const pending = item.status === 'pending'
  const href = detailPathByOverviewId[item.id]

  const card = (
    <article
      className={`rounded-2xl border p-3.5 shadow-sm shadow-slate-200/30 transition ${
        pending
          ? 'border-[#e8c98a] bg-[#f7edd8]'
          : 'border-slate-200/80 bg-white'
      } ${href ? 'hover:border-brand-500/50 hover:shadow-md hover:shadow-brand-500/10' : ''}`}
    >
      <p
        className={`text-[10px] font-semibold tracking-[0.06em] uppercase ${
          pending ? 'text-[#9a6b2f]' : 'text-slate-400'
        }`}
      >
        {item.id} {item.label}
      </p>
      <p className="mt-2 text-[22px] leading-none font-extrabold tracking-tight text-navy-950">
        {item.value}
      </p>
      <div className="mt-2 min-h-[18px] space-y-1">
        {pending ? (
          <p className="text-[11px] font-semibold text-[#b45309]">
            {item.pendingLabel}
          </p>
        ) : item.delta ? (
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-trend">
            {item.direction === 'up' ? <ArrowUp /> : <ArrowDown />}
            {item.delta}
          </p>
        ) : null}
      </div>
    </article>
  )

  if (!href) return card

  return (
    <Link to={href} aria-label={`Buka detail indikator ${item.label}`}>
      {card}
    </Link>
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
