import { useEffect, useState } from 'react'
import {
  fetchUnmetNeed,
  formatUnmetNeedPct,
  wilayahLabelFromIds,
  type UnmetNeedResponse,
} from '../api/unmetNeed'
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
  buildUnmetNeedDummyResponse,
  OCT2026_BULAN,
  OCT2026_LABEL,
  OCT2026_SOURCE_CAPTION,
  OCT2026_TAHUN,
  preferOct2026Dummy,
} from '../data/dummy/oct2026'
import { levelLabel, type GeoLevel } from '../data/indicatorShared'
import { unmetNeedMeta, unmetNeedNotes } from '../data/unmetNeed'

const DEFAULT_TAHUN = OCT2026_TAHUN
const DEFAULT_BULAN = OCT2026_BULAN
const DEFAULT_PERIODE_LABEL = OCT2026_LABEL

export function UnmetNeedDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')
  const [apiPayload, setApiPayload] = useState<UnmetNeedResponse | null>(null)
  const [apiStatus, setApiStatus] = useState<'loading' | 'ok' | 'fallback'>(
    'loading',
  )
  const useDummy = preferOct2026Dummy()

  useEffect(() => {
    if (useDummy) {
      const dummy = buildUnmetNeedDummyResponse(level)
      setApiPayload(dummy as UnmetNeedResponse)
      setApiStatus('ok')
      return
    }

    const controller = new AbortController()
    setApiStatus('loading')

    void fetchUnmetNeed(
      {
        level,
        tahun: DEFAULT_TAHUN,
        bulan: DEFAULT_BULAN,
      },
      controller.signal,
    ).then((result) => {
      if (controller.signal.aborted) return
      if (result) {
        setApiPayload(result)
        setApiStatus('ok')
      } else {
        setApiPayload(null)
        setApiStatus('fallback')
      }
    })

    return () => controller.abort()
  }, [level, useDummy])

  const source = apiPayload?.meta.source
  const isExcelDummy = source === 'excel-dummy'
  const isPostgres = source === 'postgres'
  const isSampleFixture = source === 'fixture'

  const capaianFromData =
    apiStatus === 'ok' && level === 'nasional' && apiPayload?.data[0] != null

  const capaianValue = capaianFromData
    ? formatUnmetNeedPct(apiPayload!.data[0].unmet_need_pct)
    : unmetNeedMeta.capaian

  const breakdownRows: WilayahBreakdownRow[] | undefined =
    apiStatus === 'ok' && apiPayload && level !== 'kabupaten'
      ? apiPayload.data.map((row) => ({
          wilayah: wilayahLabelFromIds(row),
          value: formatUnmetNeedPct(row.unmet_need_pct),
          vsTarget: '—',
          tren: row.denominator
            ? `n=${row.numerator.toLocaleString('id-ID')} / d=${row.denominator.toLocaleString('id-ID')}`
            : 'denom 0',
        }))
      : undefined

  const periodeLabel = isExcelDummy
    ? `${DEFAULT_PERIODE_LABEL} (dummy Excel)`
    : apiStatus === 'ok'
      ? isPostgres
        ? `${DEFAULT_PERIODE_LABEL} (Postgres DALLAP)`
        : `${DEFAULT_PERIODE_LABEL} (fixture DALLAP)`
      : DEFAULT_PERIODE_LABEL

  return (
    <DashboardLayout mobileTitle="Detail Unmet Need">
      <DetailPageHeader
        crumbLabel={unmetNeedMeta.shortName}
        title={unmetNeedMeta.title}
        subtitle={unmetNeedMeta.subtitle}
        indikatorPath="/indikator/unmet-need"
      />

      {apiStatus === 'ok' && isExcelDummy ? (
        <p className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-[12px] leading-relaxed text-sky-950">
          {OCT2026_SOURCE_CAPTION}. Periode: tahun_rekap={DEFAULT_TAHUN},
          bulan_rekap={DEFAULT_BULAN}. Live Postgres:{' '}
          <code className="rounded bg-white px-1 py-0.5 text-[11px]">
            VITE_USE_LIVE_API=true
          </code>
          .
        </p>
      ) : null}

      {apiStatus === 'ok' && isSampleFixture ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-900">
          {apiPayload?.meta.fixture_note ??
            'Serving fixture sample (DB env unset). National % is fixture-only.'}{' '}
          Periode API: tahun_rekap={DEFAULT_TAHUN}, bulan_rekap=
          {DEFAULT_BULAN}.
        </p>
      ) : null}

      {apiStatus === 'ok' && isPostgres ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] leading-relaxed text-emerald-900">
          Live Postgres · {apiPayload?.meta.table ?? 'dwh_siga…'} · tahun_rekap=
          {DEFAULT_TAHUN}, bulan_rekap={DEFAULT_BULAN}.
        </p>
      ) : null}

      {apiStatus === 'fallback' ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-600">
          API Unmet Need tidak tersedia — menampilkan stub Overview. Jalankan{' '}
          <code className="rounded bg-white px-1 py-0.5 text-[11px]">
            npm run api
          </code>{' '}
          atau unset{' '}
          <code className="rounded bg-white px-1 py-0.5 text-[11px]">
            VITE_USE_LIVE_API
          </code>{' '}
          untuk dummy Excel.
        </p>
      ) : null}

      <FilterBar
        periode={periodeLabel}
        wilayah="Nasional"
        level={levelLabel(level)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailKpiCard
          label="Capaian saat ini"
          value={capaianValue}
          footnote={
            capaianFromData ? (
              <span className="font-medium leading-snug text-slate-500">
                {isExcelDummy
                  ? OCT2026_SOURCE_CAPTION
                  : isPostgres
                    ? `Agregat ${DEFAULT_PERIODE_LABEL}`
                    : `Fixture agregat ${DEFAULT_PERIODE_LABEL}`}{' '}
                · formula DALLAP T10/16
              </span>
            ) : (
              <span className="font-medium leading-snug text-slate-500">
                {OCT2026_SOURCE_CAPTION}
              </span>
            )
          }
        />
        <DetailKpiCard
          label="Target"
          value={unmetNeedMeta.target}
          valueClassName="text-[15px] sm:text-[17px] leading-snug"
          footnote={
            <span className="font-medium text-amber-warn">
              {unmetNeedMeta.targetNote}
            </span>
          }
        />
        <DetailKpiCard
          label="Sumber data"
          value={unmetNeedMeta.sumber}
          valueClassName="text-[16px] sm:text-[18px]"
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {unmetNeedMeta.sumberNote}
              <span className="mt-1 block text-[11px] text-slate-400">
                {apiStatus === 'ok'
                  ? isExcelDummy
                    ? 'UI default · Excel dummy (bukan Live Postgres)'
                    : isPostgres
                      ? 'Live SQL via /api/unmet-need'
                      : 'Fixture sample via /api/unmet-need'
                  : unmetNeedMeta.strength}
              </span>
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title="Tren Unmet Need Nasional"
          defaultPeriod="bulanan"
          annualSubtitle="Seri tahunan · ≥5 tahun (opsional / RPJMN) · skala 0–100%"
          monthlySubtitle="Seri bulanan primer · ≥36 bulan (DALLAP Bulanan) · skala 0–100%"
          monthlyStubDetail={`Seri bulanan (≥36 bulan) belum diisi. Capaian snapshot ${capaianValue} dari dummy Excel Oct 2026 (satu bulan).`}
          annualStubDetail={`Seri tahunan opsional belum tersedia. Snapshot KPI: ${capaianValue} (dummy Excel Oct 2026).`}
        />
        <CatatanAnalitik notes={unmetNeedNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="Unmet Need"
        indicatorName="Unmet Need"
        rows={breakdownRows}
        emptyOverride={
          level === 'kabupaten'
            ? {
                title: 'Data per kabupaten belum tersedia',
                body: 'Share dummy Excel Oct 2026 hanya nasional + 38 Provinsi. Tidak ada angka kabupaten yang dikarang.',
              }
            : undefined
        }
        footerNote={
          apiStatus === 'ok'
            ? isExcelDummy
              ? '38 Provinsi dari Tabel16 Excel · % = unmet / PUS. Kabupaten tidak disertakan.'
              : isPostgres
                ? 'Nama wilayah dari d_provinsi / d_kabupaten (tahun dim mengikuti tahun_rekap, fallback tahun terdekat). Id tetap disertakan.'
                : 'Nama dari sample dim JSON bila id cocok; jika tidak ada → id saja. Sample Unmet Need ~1000 baris (bukan angka nasional resmi).'
            : undefined
        }
      />
    </DashboardLayout>
  )
}
