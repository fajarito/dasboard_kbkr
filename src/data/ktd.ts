export const ktdMeta = {
  title: 'Detail Indikator: KTD',
  shortName: 'KTD',
  subtitle:
    'Kehamilan Tidak Diinginkan — proporsi kehamilan yang tidak diinginkan (saat itu atau sama sekali) dari total kehamilan.',
  capaian: '10,8%',
  capaianDelta: '0,9 p.p',
  capaianDirection: 'down' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'Kandidat: DALLAP T16 / Elsimil',
  sumberNote:
    'Proksi DALLAP Tabel 16; Elsimil Bumil T2/T4 — field intensi perlu konfirmasi',
  strength: 'Lemah — keyakinan sumber paling rendah di 12 indikator',
} as const

export const ktdNotes = [
  'Kekuatan sumber SIGA lemah: gap field tertinggi di antara 12 indikator — konfirmasi field-level ke Elsimil/Dittasyan sebelum menganggap data tersedia.',
  'Kandidat 1: DALLAP Tabel 16 (proksi — PUS hamil yang sebelumnya “tidak ingin anak lagi”; berbagi sumber dengan Unmet Need).',
  'Kandidat 2–3: Elsimil IBU HAMIL Tabel 2 (hasil pemeriksaan) dan Tabel 4 (individu/BNBA) — PERLU KONFIRMASI apakah ada field intensi kehamilan.',
  'Endpoint: report-siga-dallap-ocp (T16) + report-siga-elsimil-ocp (Bumil T2/T4). Breakdown kab/kota setelah sumber terverifikasi.',
] as const
