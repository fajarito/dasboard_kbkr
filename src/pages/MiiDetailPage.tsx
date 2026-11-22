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
  buildMiiDummyResponse,
  formatPctId,
  OCT2026_LABEL,
  OCT2026_SOURCE_CAPTION_MII,
  preferOct2026Dummy,
} from '../data/dummy/oct2026'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'
import { miiMeta, miiNotes } from '../data/mii'

export function MiiDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')
  const useDummy = preferOct2026Dummy()

  const payload = useMemo(
    () => (useDummy ? buildMiiDummyResponse(level) : null),
    [level, useDummy],
  )

  const capaianFromDummy =
    useDummy && level === 'nasional' && payload?.data[0] != null

  const capaianValue = capaianFromDummy
    ? formatPctId(payload!.data[0].mii_pct)
    : miiMeta.capaian

  const breakdownRows: WilayahBreakdownRow[] | undefined =
    useDummy && payload && level === 'provinsi'
      ? [...payload.data]
          .sort((a, b) => (b.mii_pct ?? 0) - (a.mii_pct ?? 0))
          .map((row) => ({
            wilayah: row.kode_provinsi
              ? `${row.nama_provinsi} (${row.kode_provinsi})`
              : (row.nama_provinsi ?? '—'),
            value: formatPctId(row.mii_pct),
            vsTarget: '—',
            tren: `IC=${row.numerator.toLocaleString('id-ID')} / KB=${row.denominator.toLocaleString('id-ID')}`,
          }))
      : useDummy && level === 'nasional' && payload?.data[0]
        ? [
            {
              wilayah: 'Nasional',
              value: formatPctId(payload.data[0].mii_pct),
              vsTarget: miiMeta.target,
              tren: `IC=${payload.data[0].numerator.toLocaleString('id-ID')} / KB=${payload.data[0].denominator.toLocaleString('id-ID')}`,
            },
          ]
        : undefined

  return (
    <DashboardLayout mobileTitle="Detail MII">
      <DetailPageHeader
        crumbLabel={miiMeta.shortName}
        title={miiMeta.title}
        subtitle={miiMeta.subtitle}
        indikatorPath="/indikator/mii"
      />

      {useDummy ? (
        <p className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-[12px] leading-relaxed text-sky-950">
          {OCT2026_SOURCE_CAPTION_MII}
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
              {useDummy ? OCT2026_SOURCE_CAPTION_MII : 'Stub Overview'}
            </span>
          }
        />
        <DetailKpiCard
          label="Target"
          value={miiMeta.target}
          valueClassName="text-[15px] leading-snug sm:text-[17px]"
          footnote={
            <span className="font-medium text-amber-warn">
              {miiMeta.targetNote}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={miiMeta.sumber}
          valueClassName="text-[15px] sm:text-[17px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {miiMeta.sumberNote}
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title="Tren MII Nasional"
          defaultPeriod="bulanan"
          annualSubtitle="Seri tahunan · ≥5 tahun (RPJMN) · skala 0–100%"
          monthlySubtitle="Seri bulanan · ≥36 bulan · skala 0–100%"
          monthlyStubDetail={`Seri bulanan belum tersedia. Capaian Oktober 2026 = ${miiMeta.capaian} (Dallap Tabel 2, 3 & 10 - SIGA) — tidak ada deret yang dikarang.`}
          annualStubDetail={`Seri tahunan belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (${miiMeta.capaian}) di kartu KPI.`}
        />
        <CatatanAnalitik notes={miiNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="MII"
        indicatorName="MII"
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
            ? '38 Provinsi. Kabupaten tidak disertakan.'
            : undefined
        }
      />
    </DashboardLayout>
  )
}
