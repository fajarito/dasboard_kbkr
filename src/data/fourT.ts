export const fourTMeta = {
  title: 'Detail Indikator: 4T (Risiko)',
  shortName: '4T',
  subtitle:
    'Proporsi ibu hamil dengan ≥1 faktor risiko 4T: Terlalu Muda (<20 th), Terlalu Tua (>35 th), Terlalu Dekat (jarak kelahiran <2 th), atau Terlalu Banyak (jumlah anak >3).',
  capaian: '16,7%',
  capaianDelta: '1,3 p.p',
  capaianDirection: 'down' as const,
  target: 'Target belum dikonfirmasi',
  targetNote: 'Nilai target RPJMN belum ditetapkan di UI',
  sumber: 'Elsimil Bumil T1 + T4',
  sumberNote:
    'Endpoint report-siga-elsimil-ocp · Tabel 1 agregat; Tabel 4 BNBA (individu)',
  strength: 'Sedang — kandidat kuat, perlu verifikasi konsep / flag 4T',
} as const

export const fourTNotes = [
  'Kekuatan sumber SIGA sedang: Elsimil Bumil Tabel 1 memuat 3 dari 4 komponen 4T secara langsung.',
  'BNBA tersedia eksplisit lewat IBU HAMIL Tabel 4 (individu) — paling kuat di antara 12 indikator untuk data individual.',
  'Perlu konfirmasi apakah Tabel 4 sudah menyertakan flag 4T terhitung, atau dihitung manual dari umur/jarak/jumlah anak.',
  'Breakdown standar hingga kabupaten/kota; kecamatan/faskes relevan untuk BNBA.',
] as const
