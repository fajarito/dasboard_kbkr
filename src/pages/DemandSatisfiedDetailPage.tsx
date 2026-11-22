import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
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
  buildDemandSatisfiedDummyResponse,
  formatPctId,
  OCT2026_LABEL,
  OCT2026_SOURCE_CAPTION_DEMAND,
  preferOct2026Dummy,
} from '../data/dummy/oct2026'
import {
  demandSatisfiedMeta,
  demandSatisfiedNotes,
} from '../data/demandSatisfied'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'

export function DemandSatisfiedDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')
  const useDummy = preferOct2026Dummy()

  const payload = useMemo(
    () => (useDummy ? buildDemandSatisfiedDummyResponse(level) : null),
    [level, useDummy],
  )

  const capaianFromDummy =
    useDummy && level === 'nasional' && payload?.data[0] != null

  const capaianValue = capaianFromDummy
    ? formatPctId(payload!.data[0].demand_satisfied_pct)
    : demandSatisfiedMeta.capaian

  const breakdownRows: WilayahBreakdownRow[] | undefined =
    useDummy && payload && level === 'provinsi'
      ? [...payload.data]
          .sort(
            (a, b) =>
              (b.demand_satisfied_pct ?? 0) - (a.demand_satisfied_pct ?? 0),
          )
          .map((row) => ({
            wilayah: row.kode_provinsi
              ? `${row.nama_provinsi} (${row.kode_provinsi})`
              : (row.nama_provinsi ?? '—'),
            value: formatPctId(row.demand_satisfied_pct),
            vsTarget: '—',
            tren: `modern=${row.modern.toLocaleString('id-ID')} / unmet=${row.unmet_need.toLocaleString('id-ID')}`,
          }))
      : useDummy && level === 'nasional' && payload?.data[0]
        ? [
            {
              wilayah: 'Nasional',
              value: formatPctId(payload.data[0].demand_satisfied_pct),
              vsTarget: demandSatisfiedMeta.target,
              tren: `modern=${payload.data[0].modern.toLocaleString('id-ID')} / unmet=${payload.data[0].unmet_need.toLocaleString('id-ID')}`,
            },
          ]
        : undefined

  return (
    <DashboardLayout mobileTitle="Detail Demand Satisfied">
      <DetailPageHeader
        crumbLabel={demandSatisfiedMeta.shortName}
        title={demandSatisfiedMeta.title}
        subtitle={demandSatisfiedMeta.subtitle}
        indikatorPath="/indikator/demand-satisfied"
      />

      {useDummy ? (
        <p className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-[12px] leading-relaxed text-sky-950">
          {OCT2026_SOURCE_CAPTION_DEMAND}. Rumus = total_modern (Tabel11) ÷
          (total_modern + jumlah_unmet_need Tabel16) × 100. Live API:{' '}
          <code className="rounded bg-white px-1 py-0.5 text-[11px]">
            VITE_USE_LIVE_API=true
          </code>
          .
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
              {useDummy ? OCT2026_SOURCE_CAPTION_DEMAND : 'Stub Overview'}
            </span>
          }
        />
        <DetailKpiCard
          label="Target"
          value={demandSatisfiedMeta.target}
          valueClassName="text-[15px] leading-snug sm:text-[17px]"
          footnote={
            <span className="font-medium text-amber-warn">
              {demandSatisfiedMeta.targetNote}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={demandSatisfiedMeta.sumber}
          valueClassName="text-[16px] sm:text-[18px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {demandSatisfiedMeta.sumberNote}
              <span className="mt-1 block text-[11px] text-slate-400">
                {demandSatisfiedMeta.strength}
              </span>
            </span>
          }
        />
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm shadow-slate-200/30 sm:px-5">
        <p className="text-[12px] text-slate-500">
          Komponen derivasi:{' '}
          <Link
            to="/indikator/mcpr"
            className="font-semibold text-brand-500 hover:text-brand-600"
          >
            Detail mCPR
          </Link>
          {' · '}
          <Link
            to="/indikator/unmet-need"
            className="font-semibold text-brand-500 hover:text-brand-600"
          >
            Detail Unmet Need
          </Link>
          <span className="text-slate-400">
            {' '}
            — Demand Satisfied = modern ÷ (modern + unmet count).
          </span>
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title="Tren Demand Satisfied Nasional"
          defaultPeriod="bulanan"
          annualSubtitle="Seri tahunan · ≥5 tahun (opsional / RPJMN) · skala 0–100%"
          monthlySubtitle="Seri bulanan · ≥36 bulan (turunan DALLAP T11+T16) · skala 0–100%"
          monthlyStubDetail={`Seri bulanan belum tersedia. Capaian Oktober 2026 = ${demandSatisfiedMeta.capaian} — tidak ada deret yang dikarang.`}
          annualStubDetail={`Seri tahunan belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (${demandSatisfiedMeta.capaian}) di kartu KPI.`}
        />
        <CatatanAnalitik notes={demandSatisfiedNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="Demand Sat."
        indicatorName="Demand Satisfied"
        rows={breakdownRows}
        emptyOverride={
          level === 'kabupaten'
            ? {
                title: 'Data per kabupaten belum tersedia',
                body: 'Data tersedia untuk nasional + 38 Provinsi. Kabupaten belum tersedia.',
              }
            : undefined
        }
        footerNote={
          useDummy
            ? '38 Provinsi · Demand Satisfied = modern / (modern + unmet). Kabupaten tidak disertakan.'
            : undefined
        }
      />
    </DashboardLayout>
  )
}
