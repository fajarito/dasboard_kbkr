export const unmetNeedMeta = {
  title: 'Detail Indikator: Unmet Need',
  shortName: 'Unmet Need',
  subtitle:
    'PUS yang ingin menunda kehamilan atau tidak ingin anak lagi, namun tidak menggunakan kontrasepsi ÷ total PUS.',
  capaian: '11,2%',
  capaianDelta: '0,8 p.p',
  capaianDirection: 'down' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'DALLAP Tabel 16 (+ T10)',
  sumberNote: 'Endpoint report-siga-dallap-ocp · denom Tabel 10',
  strength: 'Sedang — perlu verifikasi konsep (admin vs survei)',
} as const

export const unmetNeedNotes = [
  'Kekuatan sumber SIGA sedang: kandidat kuat, perlu verifikasi konsep.',
  'Data administratif rutin (DALLAP), bukan survei SKI/SDKI yang biasa jadi basis unmet need internasional.',
  'Verifikasi kategori “keinginan punya anak” di formulir PUS vs mistimed/unwanted sebelum menggantikan PK.',
  'Breakdown standar hingga kabupaten/kota setelah API tersedia.',
] as const
