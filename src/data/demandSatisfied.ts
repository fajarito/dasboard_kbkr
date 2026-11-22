export const demandSatisfiedMeta = {
  title: 'Detail Indikator: Demand Satisfied',
  shortName: 'Demand Satisfied',
  subtitle:
    'Pengguna metode modern ÷ (pengguna metode modern + unmet need) × 100%. Derivasi dari mCPR (#2) dan Unmet Need (#1).',
  capaian: '88,1%',
  capaianDelta: '1,5 p.p',
  capaianDirection: 'up' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'Derivasi #1 + #2',
  sumberNote:
    'Tidak ada tabel baru — DALLAP T10–16 (sama endpoint Unmet Need / mCPR: report-siga-dallap-ocp)',
  strength: 'Sedang — bergantung validitas Unmet Need sebagai proksi administratif',
} as const

export const demandSatisfiedNotes = [
  'Indikator turunan murni dari mCPR (numerator modern users) dan Unmet Need.',
  'Sumber SIGA: tidak ada tabel baru; tarik DALLAP Tabel 10–16 lewat report-siga-dallap-ocp.',
  'Kekuatan sedang: akurasi mengikuti validitas Unmet Need (#1) sebagai proksi administratif.',
  'Breakdown standar hingga kabupaten/kota setelah API #1 dan #2 tersedia.',
] as const
