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
  buildWilayahKhususDummyResponse,
  formatPctId,
  OCT2026_LABEL,
  OCT2026_SOURCE_CAPTION_WILAYAH_KHUSUS,
  preferOct2026Dummy,
} from '../data/dummy/oct2026'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'
import {
  wilayahKhususLowestProvinces,
  wilayahKhususMeta,
  wilayahKhususNotes,
  wilayahKhususTopProvinces,
} from '../data/wilayahKhusus'

export function WilayahKhususDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')
  const useDummy = preferOct2026Dummy()

  const payload = useMemo(
    () => (useDummy ? buildWilayahKhususDummyResponse(level) : null),
    [level, useDummy],
  )

  const capaianFromDummy =
    useDummy && level === 'nasional' && payload?.data[0] != null

  const capaianValue = capaianFromDummy
    ? formatPctId(payload!.data[0].wilayah_khusus_pct)
    : wilayahKhususMeta.capaian

  const breakdownRows: WilayahBreakdownRow[] | undefined =
    useDummy && payload && level === 'provinsi'
      ? [...payload.data]
          .sort(
            (a, b) =>
              (b.wilayah_khusus_pct ?? 0) - (a.wilayah_khusus_pct ?? 0),
          )
          .map((row) => ({
            wilayah: row.kode_provinsi
              ? `${row.nama_provinsi} (${row.kode_provinsi})`
              : (row.nama_provinsi ?? '—'),
            value: formatPctId(row.wilayah_khusus_pct),
            vsTarget: '—',
            tren: `kondom+vasektomi=${row.numerator.toLocaleString('id-ID')} / KB aktif=${row.denominator.toLocaleString('id-ID')}`,
          }))
      : useDummy && level === 'nasional' && payload?.data[0]
        ? [
            {
              wilayah: 'Nasional',
              value: formatPctId(payload.data[0].wilayah_khusus_pct),
              vsTarget: wilayahKhususMeta.target,
              tren: `kondom+vasektomi=${payload.data[0].numerator.toLocaleString('id-ID')} / KB aktif=${payload.data[0].denominator.toLocaleString('id-ID')}`,
            },
          ]
        : undefined

  return (
    <DashboardLayout mobileTitle="Detail Wil. Khusus">
      <DetailPageHeader
        crumbLabel={wilayahKhususMeta.shortName}
        title={wilayahKhususMeta.title}
        subtitle={wilayahKhususMeta.subtitle}
        indikatorPath="/indikator/wilayah-khusus"
      />

      {useDummy ? (
        <p className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-[12px] leading-relaxed text-sky-950">
          {OCT2026_SOURCE_CAPTION_WILAYAH_KHUSUS}
        </p>
      ) : null}

      <FilterBar
        periode={OCT2026_LABEL}
        wilayah="Nasional"
        level={levelLabel(level)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailKpiCard
          label="Capaian saat ini"
          value={capaianValue}
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {useDummy
                ? OCT2026_SOURCE_CAPTION_WILAYAH_KHUSUS
                : 'Stub Overview'}
            </span>
          }
        />
        <DetailKpiCard
          label="Target"
          value={wilayahKhususMeta.target}
          valueClassName="text-[15px] leading-snug sm:text-[17px]"
          footnote={
            <span className="font-medium text-amber-warn">
              {wilayahKhususMeta.targetNote}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={wilayahKhususMeta.sumber}
          valueClassName="text-[15px] sm:text-[17px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {wilayahKhususMeta.sumberNote}
            </span>
          }
        />
      </div>

      {useDummy ? (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/30 sm:p-5">
          <header className="mb-3">
            <h2 className="text-[15px] font-bold text-navy-950">
              Ranking Provinsi (wilayah_khusus_pct)
            </h2>
            <p className="mt-0.5 text-[12px] text-slate-500">
              Top 5 tertinggi &amp; terendah dari 15 Provinsi · Dallap Tabel 20 -
              SIGA
            </p>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <RankingList title="Tertinggi" rows={wilayahKhususTopProvinces} />
            <RankingList title="Terendah" rows={wilayahKhususLowestProvinces} />
          </div>
        </section>
      ) : null}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title="Tren Wilayah Khusus Nasional"
          defaultPeriod="bulanan"
          annualSubtitle="Seri tahunan · ≥5 tahun (RPJMN) · skala 0–100%"
          monthlySubtitle="Seri bulanan · ≥36 bulan · skala 0–100%"
          monthlyStubDetail={`Seri bulanan belum tersedia. Capaian Oktober 2026 = ${wilayahKhususMeta.capaian} (Dallap Tabel 20 - SIGA) — tidak ada deret yang dikarang.`}
          annualStubDetail={`Seri tahunan belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (${wilayahKhususMeta.capaian}) di kartu KPI.`}
        />
        <CatatanAnalitik notes={wilayahKhususNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="Wil. Khusus"
        indicatorName="Wilayah Khusus"
        rows={breakdownRows}
        emptyOverride={
          level === 'kabupaten'
            ? {
                title: 'Data per kabupaten belum tersedia',
                body: 'Data tersedia untuk nasional + 15 Provinsi (agregat kabupaten tertinggal). Kabupaten individual belum tersedia.',
              }
            : undefined
        }
        footerNote={
          useDummy
            ? '15 Provinsi · Wilayah Khusus = (kondom+vasektomi)/jumlah KB aktif. Provinsi di luar Tabel20 tidak ditampilkan. Kabupaten individual tidak disertakan.'
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
