import { auditColumns } from '../data/overview'

export function AuditSection() {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-200/40">
      <header className="mb-4">
        <h2 className="text-[15px] font-bold text-navy-950">
          Audit Service Statistics
        </h2>
        <p className="mt-0.5 text-[12px] text-slate-500">
          Input → Proses → Output
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {auditColumns.map((col) => (
          <div
            key={col.key}
            className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5"
          >
            <div className="mb-3 flex items-start gap-2.5">
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${col.iconClass}`}
              >
                <CheckIcon />
              </span>
              <div>
                <p
                  className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${col.badgeClass}`}
                >
                  {col.badge}
                </p>
                <p className="mt-1 text-[13px] font-bold text-navy-950">
                  {col.title}
                </p>
              </div>
            </div>
            <ul className="space-y-1.5">
              {col.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[12px] text-slate-600"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
