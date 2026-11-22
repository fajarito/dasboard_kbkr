import { useMemo, useState } from 'react'
import { CatatanAnalitik } from '../components/CatatanAnalitik'
import { DashboardLayout } from '../components/DashboardLayout'
import { DetailKpiCard } from '../components/DetailKpiCard'
import { DetailPageHeader } from '../components/DetailPageHeader'
import { FilterBar } from '../components/FilterBar'
import { IndicatorTrendPanel } from '../components/IndicatorTrendPanel'
import {
  WilayahBreakdown,
  type WilayahBreakdownRow,
} from '../components/WilayahBreakdown'
import {
  buildFourTDummyResponse,
  formatPctId,
  fourTNasionalComponents,
  OCT2026_LABEL,
  OCT2026_SOURCE_CAPTION_4T,
  preferOct2026Dummy,
} from '../data/dummy/oct2026'
import {
  fourTLowestProvinces,
  fourTMeta,
  fourTNotes,
  fourTTopProvinces,
} from '../data/fourT'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'

export function FourTDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')
  const useDummy = preferOct2026Dummy()

  const payload = useMemo(
    () => (useDummy ? buildFourTDummyResponse(level) : null),
    [level, useDummy],
  )

  const components = useMemo(
    () => (useDummy ? fourTNasionalComponents() : []),
    [useDummy],
  )

  const capaianFromDummy =
    useDummy && level === 'nasional' && payload?.data[0] != null

  const capaianValue = capaianFromDummy
    ? formatPctId(payload!.data[0].pct_4t)
    : fourTMeta.capaian

  const breakdownRows: WilayahBreakdownRow[] | undefined =
    useDummy && payload && level === 'provinsi'
      ? [...payload.data]
          .sort((a, b) => (b.pct_4t ?? 0) - (a.pct_4t ?? 0))
          .map((row) => ({
            wilayah: row.kode_provinsi
              ? `${row.nama_provinsi} (${row.kode_provinsi})`
              : (row.nama_provinsi ?? '—'),
            value: formatPctId(row.pct_4t),
            vsTarget: '—',
            tren: row.denominator
              ? `4T=${row.numerator.toLocaleString('id-ID')} / bumil=${row.denominator.toLocaleString('id-ID')}`
              : 'denom 0',
          }))
      : useDummy && level === 'nasional' && payload?.data[0]
        ? [
            {
              wilayah: 'Nasional',
              value: formatPctId(payload.data[0].pct_4t),
              vsTarget: fourTMeta.target,
              tren: `4T=${payload.data[0].numerator.toLocaleString('id-ID')} / bumil=${payload.data[0].denominator.toLocaleString('id-ID')}`,
            },
          ]
        : undefined

  return (
    <DashboardLayout mobileTitle="Detail 4T">
      <DetailPageHeader
        crumbLabel={fourTMeta.shortName}
        title={fourTMeta.title}
        subtitle={fourTMeta.subtitle}
        indikatorPath="/indikator/4t"
      />

      {useDummy ? (
        <p className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-[12px] leading-relaxed text-sky-950">
          {OCT2026_SOURCE_CAPTION_4T}. Headline KPI = jumlah_bumil_4t ÷
          jumlah_bumil (unique — bukan penjumlahan empat komponen). Live API:{' '}
          <code className="rounded bg-white px-1 py-0.5 text-[11px]">
            VITE_USE_LIVE_API=true
          </code>
          .
        </p>
      ) : null}

      <FilterBar
        periode={
          useDummy ? `${OCT2026_LABEL} (dummy Excel Tabel1)` : OCT2026_LABEL
        }
        wilayah="Nasional"
        level={levelLabel(level)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailKpiCard
          label="Capaian saat ini"
          value={capaianValue}
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {useDummy ? OCT2026_SOURCE_CAPTION_4T : 'Stub Overview'}
            </span>
          }
        />
        <DetailKpiCard
          label="Target"
          value={fourTMeta.target}
          valueClassName="text-[15px] leading-snug sm:text-[17px]"
          footnote={
            <span className="font-medium text-amber-warn">
              {fourTMeta.targetNote}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={fourTMeta.sumber}
          valueClassName="text-[16px] sm:text-[18px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {fourTMeta.sumberNote}
              <span className="mt-1 block text-[11px] text-slate-400">
                {fourTMeta.strength}
              </span>
            </span>
          }
        />
      </div>

      {useDummy && components.length > 0 ? (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/30 sm:p-5">
          <header className="mb-3">
            <h2 className="text-[15px] font-bold text-navy-950">
              Komponen Kategori 4T (nasional)
            </h2>
            <p className="mt-0.5 text-[12px] text-slate-500">
              Count &amp; rate per komponen ÷ jumlah bumil. Headline 4T memakai
              jumlah_bumil_4t (unique), bukan jumlah keempat angka ini.
            </p>
          </header>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {components.map((c) => (
              <div
                key={c.key}
                className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3"
              >
                <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                  {c.label}
                </p>
                <p className="mt-1 text-[20px] font-extrabold tabular-nums text-navy-950">
                  {formatPctId(c.pct)}
                </p>
                <p className="mt-0.5 text-[12px] text-slate-500">
                  {c.count.toLocaleString('id-ID')} bumil
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {useDummy ? (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/30 sm:p-5">
          <header className="mb-3">
            <h2 className="text-[15px] font-bold text-navy-950">
              Ranking Provinsi (pct_4t)
            </h2>
            <p className="mt-0.5 text-[12px] text-slate-500">
              Top 5 tertinggi &amp; terendah dari 38 Provinsi · dummy Tabel1 Oct
              2026
            </p>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <RankingList title="Tertinggi" rows={fourTTopProvinces} />
            <RankingList title="Terendah" rows={fourTLowestProvinces} />
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm shadow-slate-200/30 sm:px-5">
        <p className="text-[12px] leading-relaxed text-slate-500">
          <span className="font-semibold text-navy-900">BNBA:</span> data
          individual tersedia lewat Elsimil IBU HAMIL Tabel 4 (DETAIL BUMIL
          TEREGISTER). Level kecamatan/faskes relevan untuk pemodelan
          service-statistic dan daftar individu; agregat kab/kota dari Tabel 1
          belum ada di share dummy ini.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title="Tren 4T Nasional"
          defaultPeriod="bulanan"
          annualSubtitle="Seri tahunan / kumulatif · ≥5 tahun (RPJMN) · skala 0–100%"
          monthlySubtitle="Seri bulanan · ≥36 bulan (Elsimil Bumil) · skala 0–100%"
          monthlyStubDetail={`Seri bulanan belum tersedia. Capaian Overview ${capaianValue} dari dummy Tabel1 Oct 2026 saja yang ditampilkan — tidak ada deret yang dikarang.`}
          annualStubDetail={`Seri tahunan/kumulatif belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (${capaianValue}) di kartu KPI.`}
        />
        <CatatanAnalitik notes={fourTNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="4T"
        indicatorName="4T"
        rows={breakdownRows}
        emptyOverride={
          level === 'kabupaten'
            ? {
                title: 'Data per kabupaten belum tersedia',
                body: 'Share dummy Excel Tabel1 Oct 2026 hanya nasional + 38 Provinsi. Tidak ada angka kabupaten yang dikarang.',
              }
            : undefined
        }
        footerNote={
          useDummy
            ? '38 Provinsi · pct_4t = jumlah_bumil_4t / jumlah_bumil. Kabupaten tidak disertakan.'
            : undefined
        }
      />
    </DashboardLayout>
  )
}

function RankingList({
  title,
  rows,
}: {
  title: string
  rows: { provinsi: string; kode: string; pct: number; numerator: number }[]
}) {
  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold text-slate-600">{title}</p>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
        {rows.map((row, i) => (
          <li
            key={row.kode}
            className="flex items-center justify-between gap-3 bg-white px-3 py-2.5 text-[13px]"
          >
            <span className="min-w-0 font-medium text-navy-950">
              <span className="mr-2 tabular-nums text-slate-400">{i + 1}.</span>
              {row.provinsi}
            </span>
            <span className="shrink-0 tabular-nums font-semibold text-navy-950">
              {formatPctId(row.pct)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
