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
  buildKtdDummyResponse,
  formatCountId,
  OCT2026_LABEL,
  OCT2026_SOURCE_CAPTION_KTD,
  preferOct2026Dummy,
} from '../data/dummy/oct2026'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'
import { ktdMeta, ktdNotes } from '../data/ktd'

export function KtdDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')
  const useDummy = preferOct2026Dummy()

  const payload = useMemo(
    () => (useDummy ? buildKtdDummyResponse(level) : null),
    [level, useDummy],
  )

  const capaianFromDummy =
    useDummy && level === 'nasional' && payload?.data[0] != null

  const capaianValue = capaianFromDummy
    ? formatCountId(payload!.data[0].ktd)
    : ktdMeta.capaian

  const breakdownRows: WilayahBreakdownRow[] | undefined =
    useDummy && payload && level === 'provinsi'
      ? [...payload.data]
          .sort((a, b) => b.ktd - a.ktd)
          .map((row) => ({
            wilayah: row.kode_provinsi
              ? `${row.nama_provinsi} (${row.kode_provinsi})`
              : (row.nama_provinsi ?? '—'),
            value: formatCountId(row.ktd),
            vsTarget: '—',
            tren: `hamil_tial=${formatCountId(row.ktd)}`,
          }))
      : useDummy && level === 'nasional' && payload?.data[0]
        ? [
            {
              wilayah: 'Nasional',
              value: formatCountId(payload.data[0].ktd),
              vsTarget: ktdMeta.target,
              tren: `hamil_tial=${formatCountId(payload.data[0].ktd)}`,
            },
          ]
        : undefined

  return (
    <DashboardLayout mobileTitle="Detail KTD">
      <DetailPageHeader
        crumbLabel={ktdMeta.shortName}
        title={ktdMeta.title}
        subtitle={ktdMeta.subtitle}
        indikatorPath="/indikator/ktd"
      />

      {useDummy ? (
        <p className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-[12px] leading-relaxed text-sky-950">
          {OCT2026_SOURCE_CAPTION_KTD}. KTD = Tabel16{' '}
          <span className="font-semibold">hamil_tial</span> (HAMIL · TIDAK
          INGIN ANAK LAGI) — count, bukan %. Live API:{' '}
          <code className="rounded bg-white px-1 py-0.5 text-[11px]">
            VITE_USE_LIVE_API=true
          </code>
          .
        </p>
      ) : (
        <div className="rounded-2xl border border-[#e8c98a] bg-[#f7edd8] px-4 py-3 sm:px-5">
          <p className="text-[12px] leading-relaxed text-[#9a6b2f]">
            <span className="font-bold">Gap sumber (SIGA #4):</span> field
            intensi kehamilan belum terkonfirmasi di katalog. Lihat juga{' '}
            <Link
              to="/indikator/unmet-need"
              className="font-semibold text-brand-600 underline-offset-2 hover:underline"
            >
              Unmet Need
            </Link>{' '}
            (berbagi DALLAP Tabel 16).
          </p>
        </div>
      )}

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
                ? 'Count hamil_tial · Dallap Tabel 16 - SIGA'
                : 'Stub Overview'}
            </span>
          }
        />
        <DetailKpiCard
          label="Target"
          value={ktdMeta.target}
          valueClassName="text-[15px] leading-snug sm:text-[17px]"
          footnote={
            <span className="font-medium text-amber-warn">
              {ktdMeta.targetNote}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={ktdMeta.sumber}
          valueClassName="text-[15px] sm:text-[17px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {ktdMeta.sumberNote}
              <span className="mt-1 block text-[11px] text-slate-400">
                {ktdMeta.strength}
              </span>
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title="Tren KTD Nasional"
          defaultPeriod="bulanan"
          annualSubtitle="Seri tahunan · ≥5 tahun (RPJMN) · skala count"
          monthlySubtitle="Seri bulanan · ≥36 bulan · skala count"
          monthlyStubDetail={`Seri bulanan belum tersedia. Capaian Oktober 2026 = ${ktdMeta.capaian} (hamil_tial) — tidak ada deret yang dikarang.`}
          annualStubDetail={`Seri tahunan belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (${ktdMeta.capaian}) di kartu KPI.`}
        />
        <CatatanAnalitik notes={ktdNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="KTD"
        indicatorName="KTD"
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
            ? '38 Provinsi · KTD = hamil_tial (count). Kabupaten tidak disertakan.'
            : undefined
        }
      />
    </DashboardLayout>
  )
}
