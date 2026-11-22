import { IndicatorTrendPanel } from './IndicatorTrendPanel'
import { mcprTrendAnnual } from '../data/mcpr'

export function McprTrendChart() {
  return (
    <IndicatorTrendPanel
      title="Tren mCPR Nasional"
      defaultPeriod="tahunan"
      annualSeries={mcprTrendAnnual}
      annualSubtitle="Seri tahunan · ≥5 tahun (baseline/target RPJMN) · skala 0–100%"
      monthlySubtitle="Seri bulanan · ≥36 bulan (DALLAP Bulanan) · skala 0–100%"
      monthlyStubDetail="Seri bulanan (≥36 bulan) akan diisi dari DALLAP Bulanan Tabel 10–15. Angka bulanan tidak ditampilkan sementara agar tidak mengarang data."
      annualStubDetail="Seri tahunan akan diisi setelah data RPJMN tersedia."
    />
  )
}
