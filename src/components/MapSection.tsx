export function MapSection() {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
      <header className="mb-4">
        <h2 className="text-[15px] font-bold text-navy-950">
          Peta Capaian Indikator
        </h2>
        <p className="mt-0.5 text-[12px] text-slate-500">
          Identifikasi wilayah prioritas berdasarkan capaian
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-[#eef2f7] px-6 py-12">
          <div className="max-w-md text-center">
            <p className="text-[15px] font-bold text-navy-900">
              Data wilayah belum tersedia
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
              Peta dan peringkat akan ditampilkan setelah data per provinsi
              serta indikator acuan tersedia.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6 px-1 py-2 sm:px-3">
          <div>
            <p className="text-[13px] font-bold text-navy-950">
              5 provinsi tertinggi
            </p>
            <p className="mt-1 text-[13px] text-slate-400">
              Data belum tersedia
            </p>
          </div>
          <div>
            <p className="text-[13px] font-bold text-navy-950">
              5 provinsi prioritas
            </p>
            <p className="mt-1 text-[13px] text-slate-400">
              Data belum tersedia
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
