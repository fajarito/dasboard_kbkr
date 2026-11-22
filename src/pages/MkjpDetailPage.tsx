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
  buildMkjpDummyResponse,
  formatPctId,
  OCT2026_LABEL,
  OCT2026_SOURCE_CAPTION_MKJP,
  preferOct2026Dummy,
} from '../data/dummy/oct2026'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'
import { mkjpMeta, mkjpNotes } from '../data/mkjp'

export function MkjpDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')
  const useDummy = preferOct2026Dummy()

  const payload = useMemo(
    () => (useDummy ? buildMkjpDummyResponse(level) : null),
    [level, useDummy],
  )

  const capaianFromDummy =
    useDummy && level === 'nasional' && payload?.data[0] != null

  const capaianValue = capaianFromDummy
    ? formatPctId(payload!.data[0].mkjp_pct)
    : mkjpMeta.capaian

  const breakdownRows: WilayahBreakdownRow[] | undefined =
    useDummy && payload && level === 'provinsi'
      ? [...payload.data]
          .sort((a, b) => (b.mkjp_pct ?? 0) - (a.mkjp_pct ?? 0))
          .map((row) => ({
            wilayah: row.kode_provinsi
              ? `${row.nama_provinsi} (${row.kode_provinsi})`
              : (row.nama_provinsi ?? '—'),
            value: formatPctId(row.mkjp_pct),
            vsTarget: '—',
            tren: `MKJP=${row.numerator.toLocaleString('id-ID')} / total=${row.denominator.toLocaleString('id-ID')}`,
          }))
      : useDummy && level === 'nasional' && payload?.data[0]
        ? [
            {
              wilayah: 'Nasional',
              value: formatPctId(payload.data[0].mkjp_pct),
              vsTarget: mkjpMeta.target,
              tren: `MKJP=${payload.data[0].numerator.toLocaleString('id-ID')} / total=${payload.data[0].denominator.toLocaleString('id-ID')}`,
            },
          ]
        : undefined

  return (
    <DashboardLayout mobileTitle="Detail % MKJP">
      <DetailPageHeader
        crumbLabel={mkjpMeta.shortName}
        title={mkjpMeta.title}
        subtitle={mkjpMeta.subtitle}
        indikatorPath="/indikator/mkjp"
      />

      {useDummy ? (
        <p className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-[12px] leading-relaxed text-sky-950">
          {OCT2026_SOURCE_CAPTION_MKJP}. Rumus = (MKJP_baru + MKJP_ulangan) ÷
          (total_baru + total_ulangan) × 100. Metode MKJP: IUD + Implan +
          Vasektomi + Tubektomi. Tabel10 KB ulangan tanpa kolom
          vasektomi/tubektomi (dianggap 0). Live API:{' '}
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
              {useDummy ? OCT2026_SOURCE_CAPTION_MKJP : 'Stub Overview'}
            </span>
          }
        />
        <DetailKpiCard
          label="Target"
          value={mkjpMeta.target}
          valueClassName="text-[15px] leading-snug sm:text-[17px]"
          footnote={
            <span className="font-medium text-amber-warn">
              {mkjpMeta.targetNote}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={mkjpMeta.sumber}
          valueClassName="text-[15px] sm:text-[17px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {mkjpMeta.sumberNote}
              <span className="mt-1 block text-[11px] text-slate-400">
                {mkjpMeta.strength}
              </span>
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title="Tren % MKJP Nasional"
          defaultPeriod="bulanan"
          annualSubtitle="Seri tahunan · ≥5 tahun (RPJMN) · skala 0–100%"
          monthlySubtitle="Seri bulanan · ≥36 bulan · skala 0–100%"
          monthlyStubDetail={`Seri bulanan belum tersedia. Capaian Oktober 2026 = ${mkjpMeta.capaian} — tidak ada deret yang dikarang.`}
          annualStubDetail={`Seri tahunan belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (${mkjpMeta.capaian}) di kartu KPI.`}
        />
        <CatatanAnalitik notes={mkjpNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="% MKJP"
        indicatorName="% MKJP"
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
            ? '38 Provinsi · MKJP = (MKJP_baru+MKJP_ulangan)/(total_baru+total_ulangan). Kabupaten tidak disertakan. Tabel10 ulangan: vasektomi/tubektomi = 0 (kolom tidak ada).'
            : undefined
        }
      />
    </DashboardLayout>
  )
}
