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
    label: 'MII',
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
    label: 'INDEKS KETERPAPARAN',
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

export const comparisonBars = [
  { key: 'mcpr', label: 'mCPR', valueLabel: '61,4%', value: 61.4, color: '#386de3' },
  {
    key: 'demand',
    label: 'Demand Satisfied',
    valueLabel: '88,1%',
    value: 88.1,
    color: '#377887',
  },
  {
    key: 'unmet',
    label: 'Unmet Need',
    valueLabel: '11,2%',
    value: 11.2,
    color: '#e04444',
  },
]

export const coverageBands = [
  { key: 'high', label: '≥ 60%', value: 11, color: '#377887' },
  { key: 'mid', label: '40–59%', value: 15, color: '#4ba09b' },
  { key: 'low', label: '20–39%', value: 9, color: '#e6b44b' },
  { key: 'crit', label: '< 20%', value: 3, color: '#c34b46' },
]

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
