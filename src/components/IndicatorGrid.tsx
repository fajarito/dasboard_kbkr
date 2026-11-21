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
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm shadow-slate-200/40">
      <p className="text-[10px] font-semibold tracking-[0.06em] text-slate-400 uppercase">
        {item.id} {item.label}
      </p>
      <p className="mt-2 text-[22px] leading-none font-extrabold tracking-tight text-navy-950">
        {item.value}
      </p>
      <div className="mt-2 min-h-[18px]">
        {item.status === 'pending' ? (
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-warn">
            <WarnDot />
            {item.pendingLabel}
          </p>
        ) : (
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-trend">
            {item.direction === 'up' ? <ArrowUp /> : <ArrowDown />}
            {item.delta}
          </p>
        )}
      </div>
    </article>
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

function WarnDot() {
  return (
    <span className="inline-flex h-3 w-3 items-center justify-center rounded-full border border-amber-warn/40 text-[8px]">
      !
    </span>
  )
}
