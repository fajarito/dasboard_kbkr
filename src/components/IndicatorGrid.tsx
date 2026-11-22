import { indicators, type Indicator } from '../data/overview'

export function IndicatorGrid() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {indicators.map((item) => (
          <IndicatorCard key={item.id} item={item} />
        ))}
      </div>
      <p className="max-w-5xl text-[11px] leading-relaxed text-slate-400">
        Catatan: periode pembanding dan target belum dicantumkan. Warna
        perubahan bukan status pencapaian target. p.p = poin persentase.
        Satuan/skala indeks MII, IKP, dan keterpaparan perlu dikonfirmasi.
      </p>
    </div>
  )
}

function IndicatorCard({ item }: { item: Indicator }) {
  const pending = item.status === 'pending'

  return (
    <article
      className={`rounded-2xl border p-3.5 shadow-sm shadow-slate-200/30 ${
        pending
          ? 'border-[#e8c98a] bg-[#f7edd8]'
          : 'border-slate-200/80 bg-white'
      }`}
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
      <div className="mt-2 min-h-[18px]">
        {pending ? (
          <p className="text-[11px] font-semibold text-[#b45309]">
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
