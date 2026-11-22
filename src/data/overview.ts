import {
  formatCountId,
  formatPctId,
  mcprCoverageBands,
  oct2026Dummy,
  OCT2026_SOURCE_CAPTION,
  OCT2026_SOURCE_CAPTION_4T,
  OCT2026_SOURCE_CAPTION_MII,
} from './dummy/oct2026'

export type Indicator = {
  id: string
  label: string
  value: string
  delta?: string
  direction?: 'up' | 'down'
  status?: 'ok' | 'pending'
  pendingLabel?: string
  /** Short SIGA / naming caveat under the KPI */
  note?: string
}

const unmetNasional = formatPctId(oct2026Dummy.nasional.unmet_need_pct)
const mcprNasional = formatPctId(oct2026Dummy.nasional.mcpr_pct)
const fourTNasional = formatPctId(oct2026Dummy.nasional.pct_4t)
const ktdNasional = formatCountId(oct2026Dummy.nasional.ktd)
const demandSatisfiedNasional = formatPctId(
  oct2026Dummy.nasional.demand_satisfied_pct,
)
const miiNasional = formatPctId(oct2026Dummy.nasional.mii_pct)

export const overviewDataCaption = OCT2026_SOURCE_CAPTION

export const indicators: Indicator[] = [
  {
    id: '01',
    label: 'UNMET NEED',
    value: unmetNasional,
    status: 'ok',
    note: 'Dummy Excel Oct 2026',
  },
  {
    id: '02',
    label: 'mCPR',
    value: mcprNasional,
    status: 'ok',
    note: 'Proxy modern÷PUS · dummy Oct 2026',
  },
  {
    id: '03',
    label: '4T (RISIKO)',
    value: fourTNasional,
    status: 'ok',
    note: OCT2026_SOURCE_CAPTION_4T,
  },
  {
    id: '04',
    label: 'KTD',
    value: ktdNasional,
    status: 'ok',
    note: 'hamil_tial count · dummy Oct 2026',
  },
  {
    id: '05',
    label: 'DEMAND SATISFIED',
    value: demandSatisfiedNasional,
    status: 'ok',
    note: 'modern÷(modern+unmet) · dummy Oct 2026',
  },
  {
    id: '06',
    label: 'MII',
    value: miiNasional,
    status: 'ok',
    note: OCT2026_SOURCE_CAPTION_MII,
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
    label: 'KB WIL. KHUSUS',
    value: '8,1%',
    delta: '0,5 p.p',
    direction: 'up',
    status: 'ok',
    note: 'Historis % KB Pria · perlu konfirmasi',
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
    pendingLabel: 'DCR (Permas) · perlu konfirmasi',
  },
]

export const comparisonBars = [
  {
    key: 'mcpr',
    label: 'mCPR',
    valueLabel: mcprNasional,
    value: oct2026Dummy.nasional.mcpr_pct,
    color: '#386de3',
  },
  {
    key: 'demand',
    label: 'Demand Satisfied',
    valueLabel: demandSatisfiedNasional,
    value: oct2026Dummy.nasional.demand_satisfied_pct,
    color: '#377887',
  },
  {
    key: 'unmet',
    label: 'Unmet Need',
    valueLabel: unmetNasional,
    value: oct2026Dummy.nasional.unmet_need_pct,
    color: '#e04444',
  },
]

/** mCPR province bands from Excel dummy (38 Provinsi). */
export const coverageBands = mcprCoverageBands()

export const navItems = [
  { id: 'overview', label: 'Overview', to: '/' },
  {
    id: 'indikator',
    label: '12 Indikator',
    to: '/indikator/mcpr',
    matchPrefix: '/indikator',
  },
  { id: 'service', label: 'Service Statistics', to: '/#service' },
  {
    id: 'input',
    label: 'Kapasitas & Kemitraan',
    section: 'INPUT',
    to: '/#input',
  },
  {
    id: 'proses',
    label: 'Aktivitas Layanan',
    section: 'PROSES',
    to: '/#proses',
  },
  {
    id: 'output',
    label: 'Hasil Pelayanan',
    section: 'OUTPUT',
    to: '/#output',
  },
  { id: 'peta', label: 'Peta Capaian', to: '/peta', matchPrefix: '/peta' },
  { id: 'wilayah', label: 'Wilayah Prioritas', to: '/#wilayah' },
  { id: 'data', label: 'Data & Sumber', to: '/#data' },
] as const
