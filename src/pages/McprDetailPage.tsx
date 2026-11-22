import { useMemo, useState } from 'react'
import { CatatanAnalitik } from '../components/CatatanAnalitik'
import { DashboardLayout } from '../components/DashboardLayout'
import { DetailKpiCard } from '../components/DetailKpiCard'
import { DetailPageHeader } from '../components/DetailPageHeader'
import { FilterBar } from '../components/FilterBar'
import { McprTrendChart } from '../components/McprTrendChart'
import {
  WilayahBreakdown,
  type WilayahBreakdownRow,
} from '../components/WilayahBreakdown'
import {
  buildMcprDummyResponse,
  formatPctId,
  OCT2026_LABEL,
  preferOct2026Dummy,
} from '../data/dummy/oct2026'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'
import { mcprMeta, mcprNotes } from '../data/mcpr'

export function McprDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')
  const useDummy = preferOct2026Dummy()

  const payload = useMemo(
    () => (useDummy ? buildMcprDummyResponse(level) : null),
    [level, useDummy],
  )

  const capaianFromDummy =
    useDummy && level === 'nasional' && payload?.data[0] != null

  const capaianValue = capaianFromDummy
    ? formatPctId(payload!.data[0].mcpr_pct)
    : mcprMeta.capaian

  const breakdownRows: WilayahBreakdownRow[] | undefined =
    useDummy && payload && level === 'provinsi'
      ? payload.data.map((row) => ({
          wilayah: row.kode_provinsi
            ? `${row.nama_provinsi} (${row.kode_provinsi})`
            : (row.nama_provinsi ?? '—'),
          value: formatPctId(row.mcpr_pct),
          vsTarget: '—',
          tren: row.denominator
            ? `modern=${row.numerator.toLocaleString('id-ID')} / PUS=${row.denominator.toLocaleString('id-ID')}`
            : 'denom 0',
        }))
      : useDummy && level === 'nasional' && payload?.data[0]
        ? [
            {
              wilayah: 'Nasional',
              value: formatPctId(payload.data[0].mcpr_pct),
              vsTarget: mcprMeta.target,
              tren: `modern=${payload.data[0].numerator.toLocaleString('id-ID')} / PUS=${payload.data[0].denominator.toLocaleString('id-ID')}`,
            },
          ]
        : undefined

  return (
    <DashboardLayout mobileTitle="Detail mCPR">
      <DetailPageHeader
        crumbLabel="mCPR"
        title={mcprMeta.title}
        subtitle={mcprMeta.subtitle}
        indikatorPath="/indikator/mcpr"
      />

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
              {useDummy ? 'Oktober 2026' : 'Stub Overview'}
            </span>
          }
        />
        <DetailKpiCard
          label="Target"
          value={mcprMeta.target}
          footnote={
            <span className="font-semibold text-trend">
              {mcprMeta.selisih}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={mcprMeta.sumber}
          valueClassName="text-[17px] sm:text-[19px]"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <McprTrendChart />
        <CatatanAnalitik notes={mcprNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="mCPR"
        indicatorName="mCPR"
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
            ? '38 Provinsi · mCPR proxy = total_modern / jumlah_pus. Kabupaten tidak disertakan.'
            : undefined
        }
      />
    </DashboardLayout>
  )
}
