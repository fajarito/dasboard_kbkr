import { geoLevels, type GeoLevel } from '../data/indicatorShared'

type WilayahBreakdownProps = {
  level: GeoLevel
  onLevelChange: (level: GeoLevel) => void
  metricColumn?: string
  indicatorName?: string
}

export function WilayahBreakdown({
  level,
  onLevelChange,
  metricColumn = 'Nilai',
  indicatorName = 'indikator',
}: WilayahBreakdownProps) {
  const emptyCopy =
    level === 'nasional'
      ? {
          title: 'Ringkasan nasional aktif',
          body: `Pilih Provinsi atau Kabupaten untuk melihat daftar wilayah. Data per kabupaten belum tersedia.`,
        }
      : level === 'provinsi'
        ? {
            title: 'Data per provinsi belum tersedia',
            body: `Daftar wilayah akan tampil setelah dataset geografis ${indicatorName} terhubung. Tidak ada angka yang diisi sementara.`,
          }
        : {
            title: 'Data per kabupaten belum tersedia',
            body: 'Tabel kabupaten/kota akan diisi setelah data breakdown tersedia. Kecamatan dan faskes menyusul.',
          }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-navy-950">
            Breakdown Wilayah
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            Drill-down Nasional → Provinsi → Kabupaten (kecamatan/faskes
            menyusul)
          </p>
        </div>

        <div
          className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1"
          role="tablist"
          aria-label="Level wilayah"
        >
          {geoLevels.map((item) => {
            const active = item.id === level
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onLevelChange(item.id)}
                className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition ${
                  active
                    ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/25'
                    : 'text-slate-500 hover:bg-white hover:text-navy-900'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </header>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-[1.4fr_0.7fr_0.8fr_0.7fr] gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
            <span>Wilayah</span>
            <span>{metricColumn}</span>
            <span>vs target</span>
            <span>Tren</span>
          </div>

          <div className="flex min-h-[160px] items-center justify-center bg-[#eef2f7]/xl px-6 py-10">
            <div className="max-w-md text-center">
              <p className="text-[15px] font-bold text-navy-900">
                {emptyCopy.title}
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
                {emptyCopy.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
