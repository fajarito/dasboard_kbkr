export function FilterBar() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/40">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Periode" value="Jan – Jun 2026" />
          <Field label="Wilayah" value="Nasional" />
          <Field label="Level" value="Provinsi" />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="rounded-xl bg-brand-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600"
          >
            Terapkan
          </button>
          <button
            type="button"
            className="rounded-xl border border-brand-500/40 bg-white px-4 py-2.5 text-[13px] font-semibold text-brand-500 transition hover:bg-navy-50"
          >
            Unduh
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium text-slate-500">
        {label}
      </span>
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] font-semibold text-navy-900">
        <span>{value}</span>
        <ChevronDown />
      </div>
    </label>
  )
}

function ChevronDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="text-slate-400"
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
