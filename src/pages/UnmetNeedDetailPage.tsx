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
import { levelLabel, type GeoLevel } from '../data/indicatorShared'
import { unmetNeedMeta, unmetNeedNotes } from '../data/unmetNeed'

/** Default period matches the largest month present in the Phase-1 fixture. */
const FIXTURE_TAHUN = 2023
const FIXTURE_BULAN = 7

export function UnmetNeedDetailPage() {
  const [level, setLevel] = useState<GeoLevel>('nasional')
  const [apiPayload, setApiPayload] = useState<UnmetNeedResponse | null>(null)
  const [apiStatus, setApiStatus] = useState<'loading' | 'ok' | 'fallback'>(
    'loading',
  )

  useEffect(() => {
    const controller = new AbortController()
    setApiStatus('loading')

    void fetchUnmetNeed(
      {
        level,
        tahun: FIXTURE_TAHUN,
        bulan: FIXTURE_BULAN,
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
  }, [level])

  const capaianFromApi =
    apiStatus === 'ok' &&
    level === 'nasional' &&
    apiPayload?.data[0] != null

  const capaianValue = capaianFromApi
    ? formatUnmetNeedPct(apiPayload!.data[0].unmet_need_pct)
    : unmetNeedMeta.capaian

  const breakdownRows: WilayahBreakdownRow[] | undefined =
    apiStatus === 'ok' && apiPayload
      ? apiPayload.data.map((row) => ({
          wilayah: wilayahLabelFromIds(row),
          value: formatUnmetNeedPct(row.unmet_need_pct),
          vsTarget: '—',
          tren: row.denominator
            ? `n=${row.numerator.toLocaleString('id-ID')} / d=${row.denominator.toLocaleString('id-ID')}`
            : 'denom 0',
        }))
      : undefined

  const periodeLabel =
    apiStatus === 'ok'
      ? apiPayload?.meta.source === 'postgres'
        ? `Jul ${FIXTURE_TAHUN} (Postgres DALLAP)`
        : `Jul ${FIXTURE_TAHUN} (fixture DALLAP)`
      : 'Jan – Jun 2026'

  return (
    <DashboardLayout mobileTitle="Detail Unmet Need">
      <DetailPageHeader
        crumbLabel={unmetNeedMeta.shortName}
        title={unmetNeedMeta.title}
        subtitle={unmetNeedMeta.subtitle}
        indikatorPath="/indikator/unmet-need"
      />

      {apiStatus === 'ok' && apiPayload?.meta.source === 'fixture' ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-900">
          {apiPayload.meta.fixture_note ??
            'Serving fixture sample (DB env unset). National % is fixture-only.'}{' '}
          Periode API: tahun_rekap={FIXTURE_TAHUN}, bulan_rekap=
          {FIXTURE_BULAN}.
        </p>
      ) : null}

      {apiStatus === 'ok' && apiPayload?.meta.source === 'postgres' ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] leading-relaxed text-emerald-900">
          Live Postgres · {apiPayload.meta.table ?? 'dwh_siga…'} · tahun_rekap=
          {FIXTURE_TAHUN}, bulan_rekap={FIXTURE_BULAN}.
        </p>
      ) : null}

      {apiStatus === 'fallback' ? (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-600">
          API Unmet Need tidak tersedia — menampilkan stub Overview. Jalankan{' '}
          <code className="rounded bg-white px-1 py-0.5 text-[11px]">
            npm run api
          </code>{' '}
          atau{' '}
          <code className="rounded bg-white px-1 py-0.5 text-[11px]">
            npm run dev:all
          </code>
          .
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
            capaianFromApi ? (
              <span className="font-medium leading-snug text-slate-500">
                Fixture agregat Jul {FIXTURE_TAHUN} · formula DALLAP T10/16
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-trend">
                <ArrowDown />−{unmetNeedMeta.capaianDelta}
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
                  ? apiPayload?.meta.source === 'postgres'
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
          monthlyStubDetail="Seri bulanan (≥36 bulan) akan diisi dari DALLAP Bulanan Tabel 16 (+ denom Tabel 10). Capaian saat ini 11,2% dari Overview; angka deret bulanan tidak diisi sementara."
          annualStubDetail="Seri tahunan opsional belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (11,2%) yang ditampilkan di kartu KPI."
        />
        <CatatanAnalitik notes={unmetNeedNotes} />
      </div>

      <WilayahBreakdown
        level={level}
        onLevelChange={setLevel}
        metricColumn="Unmet Need"
        indicatorName="Unmet Need"
        rows={breakdownRows}
        footerNote={
          apiStatus === 'ok'
            ? apiPayload?.meta.source === 'postgres'
              ? 'Label wilayah memakai id dari database (nama resmi tidak diisi di UI).'
              : 'Label wilayah memakai id dari fixture saja (nama resmi tidak diisi). Sample ~1000 baris — bukan angka nasional resmi.'
            : undefined
        }
      />
    </DashboardLayout>
  )
}

function ArrowDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
      <path d="M5 8.5 L1.5 3 H8.5 Z" fill="currentColor" />
    </svg>
  )
}
