import type { TrendPeriod } from './indicatorShared'

export type IndicatorDetailConfig = {
  id: string
  slug: string
  title: string
  shortName: string
  subtitle: string
  capaian: string
  capaianDelta?: string
  capaianDirection?: 'up' | 'down'
  capaianPending?: boolean
  capaianPendingLabel?: string
  target: string
  targetNote: string
  sumber: string
  sumberNote: string
  strength: string
  strengthTone?: 'ok' | 'warn' | 'weak'
  gapBanner?: string
  notes: readonly string[]
  metricColumn: string
  defaultTrendPeriod?: TrendPeriod
  monthlyStubDetail: string
  annualStubDetail: string
  screenshotBase: string
}

export const remainingIndicators: IndicatorDetailConfig[] = [
  {
    id: '07',
    slug: 'ikp',
    title: 'Detail Indikator: IKP',
    shortName: 'IKP',
    subtitle:
      'Indeks Kualitas Pelayanan KB — indeks komposit; bobot dan formula resmi antar-komponen belum dikonfirmasi ke Dittasyan.',
    capaian: '80,6',
    capaianDelta: '1,8',
    capaianDirection: 'up',
    target: 'Target belum dikonfirmasi',
    targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
    sumber: 'Komposit YanKB',
    sumberNote:
      'Kandidat: informed consent, komplikasi, sarana, nakes, kelengkapan laporan — formula belum ada',
    strength: 'Sedang — komponen kandidat ada; formula index belum ada',
    strengthTone: 'warn',
    gapBanner:
      'Formula IKP belum tersedia. Jangan menghitung ulang indeks di UI hingga Dittasyan mengonfirmasi bobot/komponen resmi.',
    notes: [
      'Kandidat komponen: YanKB T2/20 (consent), T7/25 (komplikasi), Tahunan T5/5A/5B (sarana), T7A/7B (nakes), Bulanan T1 (laporan).',
      'Endpoint: report-siga-yankb-ocp untuk seluruh Tabel kandidat.',
      'Rekomendasi: minta formula resmi sebelum menarik seluruh Tabel.',
      'Breakdown kab/kota setelah formula dan API tersedia.',
    ],
    metricColumn: 'IKP',
    defaultTrendPeriod: 'bulanan',
    monthlyStubDetail:
      'Seri belum tersedia hingga formula IKP dikonfirmasi. Capaian Overview 80,6 saja yang ditampilkan — tidak ada deret yang dikarang.',
    annualStubDetail:
      'Seri tahunan belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (80,6) di kartu KPI.',
    screenshotBase: 'ikp',
  },
  {
    id: '10',
    slug: 'keterpaparan',
    title: 'Detail Indikator: Indeks Keterpaparan KBKR',
    shortName: 'Keterpaparan',
    subtitle:
      'Indeks komposit paparan/jangkauan informasi dan layanan KBKR — formula resmi belum ditemukan; banyak Tabel kandidat DALLAP.',
    capaian: '66,4',
    capaianDelta: '2,7',
    capaianDirection: 'up',
    target: 'Target belum dikonfirmasi',
    targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
    sumber: 'DALLAP T2–9 + T8–16',
    sumberNote:
      'Bulanan aktivitas + Tahunan kapasitas · formula belum ada',
    strength: 'Sedang — banyak kandidat Tabel; formula index belum ada',
    strengthTone: 'warn',
    gapBanner:
      'Formula Indeks Keterpaparan belum dikonfirmasi. Rekomendasi: minta formula resmi Ditkespro sebelum menarik 15+ Tabel kandidat.',
    notes: [
      'Aktivitas bulanan: DALLAP Bulanan Tabel 2–9 (BKB/BKR/BKL/UPPKA/PIK-R/PPKS, dll.).',
      'Kapasitas tahunan: DALLAP Tahunan Tabel 8–16 sebagai basis/denominator.',
      'Indikator paling kompleks di 12 indikator dari sisi jumlah Tabel.',
      'Breakdown kab/kota setelah formula dikunci.',
    ],
    metricColumn: 'Indeks',
    defaultTrendPeriod: 'bulanan',
    monthlyStubDetail:
      'Seri belum tersedia hingga formula keterpaparan dikonfirmasi. Capaian Overview 66,4 saja yang ditampilkan — tidak ada deret yang dikarang.',
    annualStubDetail:
      'Seri tahunan belum tersedia. Tidak ada nilai yang dikarang — hanya capaian Overview (66,4) di kartu KPI.',
    screenshotBase: 'keterpaparan',
  },
  {
    id: '12',
    slug: 'dcr',
    title: 'Detail Indikator: DCR (Permas)',
    shortName: 'DCR',
    subtitle:
      'Discontinuation Rate (tingkat putus pakai kontrasepsi) — “Permas” perlu dikonfirmasi arti operasionalnya ke Ditkespro/BKKBN.',
    capaian: '—',
    capaianPending: true,
    capaianPendingLabel: 'DCR (Permas) · perlu konfirmasi',
    target: 'Target belum dikonfirmasi',
    targetNote: 'Nilai target dan definisi Permas belum ditetapkan di UI',
    sumber: 'DALLAP Tabel 17',
    sumberNote:
      'Opsional YanKB pencabutan · arti Permas terbuka',
    strength: 'Perlu konfirmasi — angka Overview belum diisi',
    strengthTone: 'weak',
    gapBanner:
      'Overview menampilkan “—” / perlu konfirmasi. Arti “Permas” dan formula DCR operasional masih terbuka di Bagian 8 dokumen SIGA. Jangan mengisi angka hingga definisi dikunci.',
    notes: [
      'Kandidat sumber: DALLAP Bulanan Tabel 17; YanKB untuk data pencabutan/putus pakai.',
      'Endpoint: report-siga-dallap-ocp (+ report-siga-yankb-ocp bila diperlukan).',
      'Konfirmasi ke Ditkespro/BKKBN: definisi Permas, denominator, dan jendela waktu DCR.',
      'Breakdown kab/kota setelah definisi dan API tersedia.',
    ],
    metricColumn: 'DCR',
    defaultTrendPeriod: 'bulanan',
    monthlyStubDetail:
      'Seri bulanan belum tersedia. Tidak ada angka yang dikarang — tunggu konfirmasi definisi DCR/Permas.',
    annualStubDetail:
      'Seri tahunan belum tersedia. Capaian Overview masih “—” / perlu konfirmasi.',
    screenshotBase: 'dcr',
  },
]

export const remainingBySlug = Object.fromEntries(
  remainingIndicators.map((item) => [item.slug, item]),
) as Record<string, IndicatorDetailConfig>

export const detailPathByOverviewId: Record<string, string> = {
  '01': '/indikator/unmet-need',
  '02': '/indikator/mcpr',
  '03': '/indikator/4t',
  '04': '/indikator/ktd',
  '05': '/indikator/demand-satisfied',
  '06': '/indikator/mii',
  '07': '/indikator/ikp',
  '08': '/indikator/mkjp',
  '09': '/indikator/wilayah-khusus',
  '10': '/indikator/keterpaparan',
  '11': '/indikator/kbpp-tanpa-mal',
  '12': '/indikator/dcr',
}
