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

  return (
    <DashboardLayout mobileTitle="Detail Unmet Need">
      <DetailPageHeader
        crumbLabel={unmetNeedMeta.shortName}
        title={unmetNeedMeta.title}
        subtitle={unmetNeedMeta.subtitle}
        indikatorPath="/indikator/unmet-need"
      />

      <FilterBar
        periode={DEFAULT_PERIODE_LABEL}
        wilayah="Nasional"
        level={levelLabel(level)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailKpiCard
          label="Capaian saat ini"
          value={capaianValue}
          footnote={
            <span className="font-medium leading-snug text-slate-500">
              {DEFAULT_PERIODE_LABEL}
            </span>
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
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        <IndicatorTrendPanel
          title="Tren Unmet Need Nasional"
          defaultPeriod="bulanan"
          annualSubtitle="Seri tahunan · ≥5 tahun (opsional / RPJMN) · skala 0–100%"
          monthlySubtitle="Seri bulanan primer · ≥36 bulan (DALLAP Bulanan) · skala 0–100%"
          monthlyStubDetail={`Seri bulanan (≥36 bulan) belum diisi. Capaian snapshot ${capaianValue} (satu bulan).`}
          annualStubDetail={`Seri tahunan opsional belum tersedia. Snapshot KPI: ${capaianValue}.`}
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
                body: 'Data tersedia untuk nasional + 38 Provinsi. Kabupaten belum tersedia.',
              }
            : undefined
        }
        footerNote={
          apiStatus === 'ok'
            ? '38 Provinsi · % = unmet / PUS. Kabupaten belum tersedia.'
            : undefined
        }
      />
    </DashboardLayout>
  )
}
