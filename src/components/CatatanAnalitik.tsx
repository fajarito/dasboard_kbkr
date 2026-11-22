type CatatanAnalitikProps = {
  notes: readonly string[]
  subtitle?: string
}

export function CatatanAnalitik({
  notes,
  subtitle = 'Ringkasan kualitas data dan arah analisis',
}: CatatanAnalitikProps) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
      <header className="mb-4">
        <h2 className="text-[15px] font-bold text-navy-950">Catatan Analitik</h2>
        <p className="mt-0.5 text-[12px] text-slate-500">{subtitle}</p>
      </header>
      <ul className="space-y-3">
        {notes.map((note) => (
          <li
            key={note}
            className="flex gap-2.5 text-[13px] leading-relaxed text-navy-900"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
              aria-hidden
            />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
