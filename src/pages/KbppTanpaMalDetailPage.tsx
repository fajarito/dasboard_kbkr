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
  buildKbppDummyResponse,
  formatPctId,
  OCT2026_LABEL,
  OCT2026_SOURCE_CAPTION_KBPP,
  preferOct2026Dummy,
} from '../data/dummy/oct2026'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'
import {
  kbppLowestProvinces,
  kbppMeta,
  kbppNotes,
  kbppTopProvinces,
} from '../data/kbpp'

export function KbppTanpaMalDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')
  const useDummy = preferOct2026Dummy()

  const payload = useMemo(
    () => (useDummy ? buildKbppDummyResponse(level) : null),
    [level, useDummy],
  )

  const capaianFromDummy =
    useDummy && level === 'nasional' && payload?.data[0] != null

  const capaianValue = capaianFromDummy
    ? formatPctId(payload!.data[0].kbpp_tanpa_mal_pct)
    : kbppMeta.capaian

  const breakdownRows: WilayahBreakdownRow[] | undefined =
    useDummy && payload && level === 'provinsi'
      ? [...payload.data]
          .sort(
            (a, b) =>
              (b.kbpp_tanpa_mal_pct ?? 0) - (a.kbpp_tanpa_mal_pct ?? 0),
          )
          .map((row) => ({
            wilayah: row.kode_provinsi
              ? `${row.nama_provinsi} (${row.kode_provinsi})`
              : (row.nama_provinsi ?? '—'),
            value: formatPctId(row.kbpp_tanpa_mal_pct),
            vsTarget: '—',
            tren: `KBPP=${row.numerator.toLocaleString('id-ID')} / ibu=${row.denominator.toLocaleString('id-ID')} (MAL=${row.mal.toLocaleString('id-ID')})`,
          }))
      : useDummy && level === 'nasional' && payload?.data[0]
        ? [
            {
              wilayah: 'Nasional',
              value: formatPctId(payload.data[0].kbpp_tanpa_mal_pct),
              vsTarget: kbppMeta.target,
              tren: `KBPP=${payload.data[0].numerator.toLocaleString('id-ID')} / ibu=${payload.data[0].denominator.toLocaleString('id-ID')}`,
            },
          ]
        : undefined

  return (
    <DashboardLayout mobileTitle="Detail KBPP Tanpa MAL">
      <DetailPageHeader
        crumbLabel={kbppMeta.shortName}
        title={kbppMeta.title}
        subtitle={kbppMeta.subtitle}
        indikatorPath="/indikator/kbpp-tanpa-mal"
      />

      {useDummy ? (
        <p className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-[12px] leading-relaxed text-sky-950">
          {OCT2026_SOURCE_CAPTION_KBPP}. Rumus = (IUD+MOW+MOP+Implan+Suntik+Pil+Kondom)
          ÷ jumlah ibu pasca persalinan × 100. MAL dan Tradisional dikecualikan
          (= ber_kb − MAL − tradisional). Live API:{' '}
          <code className="rounded bg-white px-1 py-0.5 text-[11px]">
            VITE_USE_LIVE_API=true
          </code>
          .
        </p>
      ) : null}

      <FilterBar
        periode={
          useDummy ? `${OCT2026_LABEL} (dummy Excel Tabel1 KBPP)` : OCT2026_LABEL
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
              {useDummy ? OCT2026_SOURCE_CAPTION_KBPP : 'Stub Overview'}
            </span>
          }
        />
        <DetailKpiCard
          label="Target"
          value={kbppMeta.target}
          valueClassName="text-[15px] leading-snug sm:text-[17px]"
          footnote={
            <span className="font-medium text-amber-warn">
              {kbppMeta.targetNote}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={kbppMeta.sumber}
          valueClassName="text-[15px] sm:text-[17px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {kbppMeta.sumberNote}
              <span className="mt-1 block text-[11px] text-slate-400">
                {kbppMeta.strength}
              </span>
            </span>
          }
        />
      </div>

      {useDummy ? (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/30 sm:p-5">
          <header className="mb-3">
            <h2 className="text-[15px] font-bold text-navy-950">
              Ranking Provinsi (KBPP Tanpa MAL)
            </h2>
            <p className="mt-0.5 text-[12px] text-slate-500">
              Top 5 tertinggi &amp; terendah dari 38 Provinsi · dummy Tabel1
              KBPP Oct 2026
            </p>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <RankingList title="Tertinggi" rows={kbppTopProvinces} />
            <RankingList title="Terendah" rows={kbppLowestProvinces} />
          </div>
        </section>
      ) : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title="Tren KBPP Tanpa MAL Nasional"
          defaultPeriod="bulanan"
          annualSubtitle="Seri tahunan · ≥5 tahun (RPJMN) · skala 0–100%"
          monthlySubtitle="Seri bulanan · ≥36 bulan · skala 0–100%"
          monthlyStubDetail={`Seri bulanan belum tersedia. Capaian dummy Oct 2026 = ${kbppMeta.capaian} — tidak ada deret yang dikarang.`}
          annualStubDetail={`Seri tahunan belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (${kbppMeta.capaian}) di kartu KPI.`}
        />
        <CatatanAnalitik notes={kbppNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="KBPP"
        indicatorName="KBPP Tanpa MAL"
        rows={breakdownRows}
        emptyOverride={
          level === 'kabupaten'
            ? {
                title: 'Data per kabupaten belum tersedia',
                body: 'Share dummy Excel Tabel1 KBPP Oct 2026 hanya nasional + 38 Provinsi. Tidak ada angka kabupaten yang dikarang.',
              }
            : undefined
        }
        footerNote={
          useDummy
            ? '38 Provinsi · KBPP Tanpa MAL = (IUD+MOW+MOP+Implan+Suntik+Pil+Kondom) / jumlah ibu pasca persalinan. Kabupaten tidak disertakan.'
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
