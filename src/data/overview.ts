export type Indicator = {
  id: string
  label: string
  value: string
  delta?: string
  direction?: 'up' | 'down'
  status?: 'ok' | 'pending'
  pendingLabel?: string
}

export const indicators: Indicator[] = [
  {
    id: '01',
    label: 'UNMET NEED',
    value: '11,2%',
    delta: '0,8 p.p',
    direction: 'down',
    status: 'ok',
  },
  {
    id: '02',
    label: 'mCPR',
    value: '61,4%',
    delta: '2,1 p.p',
    direction: 'up',
    status: 'ok',
  },
  {
    id: '03',
    label: '4T (RISIKO)',
    value: '16,7%',
    delta: '1,3 p.p',
    direction: 'down',
    status: 'ok',
  },
  {
    id: '04',
    label: 'KTD',
    value: '10,8%',
    delta: '0,9 p.p',
    direction: 'down',
    status: 'ok',
  },
  {
    id: '05',
    label: 'DEMAND SATISFIED',
    value: '88,1%',
    delta: '1,5 p.p',
    direction: 'up',
    status: 'ok',
  },
  {
    id: '06',
    label: 'MK',
    value: '76,3',
    delta: '2,4',
    direction: 'up',
    status: 'ok',
  },
  {
    id: '07',
    label: 'IKP',
    value: '80,6',
    delta: '1,8',
    direction: 'up',
    status: 'ok',
  },
  {
    id: '08',
    label: '% MKJP',
    value: '27,3%',
    delta: '1,9 p.p',
    direction: 'up',
    status: 'ok',
  },
  {
    id: '09',
    label: '% KB PRIA',
    value: '8,1%',
    delta: '0,5 p.p',
    direction: 'up',
    status: 'ok',
  },
  {
    id: '10',
    label: 'INDEKS KETEROBARAN',
    value: '66,4',
    delta: '2,7',
    direction: 'up',
    status: 'ok',
  },
  {
    id: '11',
    label: 'KBPP TANPA MAL',
    value: '28,5%',
    delta: '1,3 p.p',
    direction: 'up',
    status: 'ok',
  },
  {
    id: '12',
    label: 'DCR',
    value: '—',
    status: 'pending',
    pendingLabel: 'Perlu konfirmasi',
  },
]

export const trendData = [
  { month: 'Jan', mCPR: 58.2, demand: 84.6, unmet: 13.1 },
  { month: 'Feb', mCPR: 58.8, demand: 85.1, unmet: 12.7 },
  { month: 'Mar', mCPR: 59.4, demand: 85.9, unmet: 12.4 },
  { month: 'Apr', mCPR: 60.1, demand: 86.7, unmet: 12.0 },
  { month: 'Mei', mCPR: 60.7, demand: 87.4, unmet: 11.6 },
  { month: 'Jun', mCPR: 61.4, demand: 88.1, unmet: 11.2 },
]

export const coverageBands = [
  { key: 'high', label: '≥ 60%', value: 11, color: '#2f8f8a' },
  { key: 'mid', label: '40–59%', value: 15, color: '#4ea19d' },
  { key: 'low', label: '20–39%', value: 9, color: '#e6a037' },
  { key: 'crit', label: '< 20%', value: 3, color: '#cd5a55' },
]

export const auditColumns = [
  {
    key: 'input',
    badge: 'INPUT',
    title: 'Kapasitas & Kemitraan',
    badgeClass: 'text-input bg-green-50',
    iconClass: 'bg-green-100 text-input',
    items: [
      'Faskes KB & kepemilikan',
      'Kerja sama BPJS',
      'Sarana & perlengkapan',
      'Nakes & tenaga administrasi',
    ],
  },
  {
    key: 'proses',
    badge: 'PROSES',
    title: 'Throughput & Aktivitas',
    badgeClass: 'text-proses bg-blue-50',
    iconClass: 'bg-blue-100 text-proses',
    items: [
      'Kelengkapan laporan',
      'Informed consent',
      'Persediaan alokon',
      'Pelayanan KB bergerak',
    ],
  },
  {
    key: 'output',
    badge: 'OUTPUT',
    title: 'Hasil Pelayanan',
    badgeClass: 'text-output bg-violet-50',
    iconClass: 'bg-violet-100 text-output',
    items: [
      'KB baru & ulangan',
      'KB ganti cara',
      'Pencabutan implant/IUD',
      'Tingkat putus pakai',
    ],
  },
] as const

export const navItems = [
  { id: 'overview', label: 'Overview', active: true },
  { id: 'indikator', label: '12 Indikator' },
  { id: 'service', label: 'Service Statistics' },
  {
    id: 'input',
    label: 'Kapasitas & Kemitraan',
    section: 'INPUT',
  },
  {
    id: 'proses',
    label: 'Aktivitas Layanan',
    section: 'PROSES',
  },
  {
    id: 'output',
    label: 'Hasil Pelayanan',
    section: 'OUTPUT',
  },
  { id: 'peta', label: 'Peta Capaian' },
  { id: 'wilayah', label: 'Wilayah Prioritas' },
  { id: 'data', label: 'Data & Sumber' },
] as const
