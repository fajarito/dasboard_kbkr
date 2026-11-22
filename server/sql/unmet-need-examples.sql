-- Unmet Need (KBKR) — Postgres examples against
--   dwh_siga.fa_laporan_dallap_bulanan_tabel10_20rdk
--
-- Formula (exact):
--   unmet_need_pct =
--     (hamil_ihn + hamil_tial + tdkhamil_ihn + tdkhamil_tial)
--     / NULLIF(status_pus_true, 0) * 100
-- Denominator 0 → NULL (omit from rate; keep counts if needed).
--
-- Source rows are kelurahan-level. Aggregate up to kabupaten / provinsi / nasional.
-- Yearly rollup: SUM numerators & denominators across months, then compute %.

-- ---------------------------------------------------------------------------
-- Nasional, bulanan
-- ---------------------------------------------------------------------------
SELECT
  tahun_rekap,
  bulan_rekap,
  SUM(
    COALESCE(hamil_ihn, 0)
    + COALESCE(hamil_tial, 0)
    + COALESCE(tdkhamil_ihn, 0)
    + COALESCE(tdkhamil_tial, 0)
  ) AS numerator,
  SUM(COALESCE(status_pus_true, 0)) AS denominator,
  CASE
    WHEN SUM(COALESCE(status_pus_true, 0)) = 0 THEN NULL
    ELSE
      SUM(
        COALESCE(hamil_ihn, 0)
        + COALESCE(hamil_tial, 0)
        + COALESCE(tdkhamil_ihn, 0)
        + COALESCE(tdkhamil_tial, 0)
      )::numeric
      / SUM(COALESCE(status_pus_true, 0))
      * 100
  END AS unmet_need_pct
FROM dwh_siga.fa_laporan_dallap_bulanan_tabel10_20rdk
WHERE tahun_rekap = :tahun
  AND bulan_rekap = :bulan
GROUP BY tahun_rekap, bulan_rekap;

-- ---------------------------------------------------------------------------
-- Nasional, tahunan (rollup months then %)
-- ---------------------------------------------------------------------------
SELECT
  tahun_rekap,
  SUM(
    COALESCE(hamil_ihn, 0)
    + COALESCE(hamil_tial, 0)
    + COALESCE(tdkhamil_ihn, 0)
    + COALESCE(tdkhamil_tial, 0)
  ) AS numerator,
  SUM(COALESCE(status_pus_true, 0)) AS denominator,
  CASE
    WHEN SUM(COALESCE(status_pus_true, 0)) = 0 THEN NULL
    ELSE
      SUM(
        COALESCE(hamil_ihn, 0)
        + COALESCE(hamil_tial, 0)
        + COALESCE(tdkhamil_ihn, 0)
        + COALESCE(tdkhamil_tial, 0)
      )::numeric
      / SUM(COALESCE(status_pus_true, 0))
      * 100
  END AS unmet_need_pct
FROM dwh_siga.fa_laporan_dallap_bulanan_tabel10_20rdk
WHERE tahun_rekap = :tahun
GROUP BY tahun_rekap;

-- ---------------------------------------------------------------------------
-- Provinsi, bulanan
-- ---------------------------------------------------------------------------
SELECT
  tahun_rekap,
  bulan_rekap,
  id_provinsi,
  SUM(
    COALESCE(hamil_ihn, 0)
    + COALESCE(hamil_tial, 0)
    + COALESCE(tdkhamil_ihn, 0)
    + COALESCE(tdkhamil_tial, 0)
  ) AS numerator,
  SUM(COALESCE(status_pus_true, 0)) AS denominator,
  CASE
    WHEN SUM(COALESCE(status_pus_true, 0)) = 0 THEN NULL
    ELSE
      SUM(
        COALESCE(hamil_ihn, 0)
        + COALESCE(hamil_tial, 0)
        + COALESCE(tdkhamil_ihn, 0)
        + COALESCE(tdkhamil_tial, 0)
      )::numeric
      / SUM(COALESCE(status_pus_true, 0))
      * 100
  END AS unmet_need_pct
FROM dwh_siga.fa_laporan_dallap_bulanan_tabel10_20rdk
WHERE tahun_rekap = :tahun
  AND bulan_rekap = :bulan
GROUP BY tahun_rekap, bulan_rekap, id_provinsi
ORDER BY id_provinsi;

-- ---------------------------------------------------------------------------
-- Kabupaten, bulanan (optional filter by id_provinsi)
-- ---------------------------------------------------------------------------
SELECT
  tahun_rekap,
  bulan_rekap,
  id_provinsi,
  id_kabupaten,
  SUM(
    COALESCE(hamil_ihn, 0)
    + COALESCE(hamil_tial, 0)
    + COALESCE(tdkhamil_ihn, 0)
    + COALESCE(tdkhamil_tial, 0)
  ) AS numerator,
  SUM(COALESCE(status_pus_true, 0)) AS denominator,
  CASE
    WHEN SUM(COALESCE(status_pus_true, 0)) = 0 THEN NULL
    ELSE
      SUM(
        COALESCE(hamil_ihn, 0)
        + COALESCE(hamil_tial, 0)
        + COALESCE(tdkhamil_ihn, 0)
        + COALESCE(tdkhamil_tial, 0)
      )::numeric
      / SUM(COALESCE(status_pus_true, 0))
      * 100
  END AS unmet_need_pct
FROM dwh_siga.fa_laporan_dallap_bulanan_tabel10_20rdk
WHERE tahun_rekap = :tahun
  AND bulan_rekap = :bulan
  AND (:id_provinsi IS NULL OR id_provinsi = :id_provinsi)
GROUP BY tahun_rekap, bulan_rekap, id_provinsi, id_kabupaten
ORDER BY id_provinsi, id_kabupaten;

-- ---------------------------------------------------------------------------
-- Provinsi + names from year-suffixed dim (exact tahun_rekap)
-- If d_provinsi_<tahun> is missing, the API picks the nearest year table.
-- ---------------------------------------------------------------------------
SELECT
  a.id_provinsi,
  p.kode_provinsi,
  p.nama_provinsi,
  a.numerator,
  a.denominator,
  a.unmet_need_pct
FROM (
  SELECT
    id_provinsi,
    SUM(
      COALESCE(hamil_ihn, 0)
      + COALESCE(hamil_tial, 0)
      + COALESCE(tdkhamil_ihn, 0)
      + COALESCE(tdkhamil_tial, 0)
    ) AS numerator,
    SUM(COALESCE(status_pus_true, 0)) AS denominator,
    CASE
      WHEN SUM(COALESCE(status_pus_true, 0)) = 0 THEN NULL
      ELSE
        SUM(
          COALESCE(hamil_ihn, 0)
          + COALESCE(hamil_tial, 0)
          + COALESCE(tdkhamil_ihn, 0)
          + COALESCE(tdkhamil_tial, 0)
        )::numeric
        / SUM(COALESCE(status_pus_true, 0))
        * 100
    END AS unmet_need_pct
  FROM dwh_siga.fa_laporan_dallap_bulanan_tabel10_20rdk
  WHERE tahun_rekap = :tahun
    AND bulan_rekap = :bulan
  GROUP BY id_provinsi
) a
LEFT JOIN dwh_siga.d_provinsi_2023 p
  ON p.id_provinsi = a.id_provinsi
ORDER BY a.id_provinsi;

-- Kabupaten + names (replace _2023 with the resolved dim year)
SELECT
  a.id_provinsi,
  a.id_kabupaten,
  p.nama_provinsi,
  p.kode_provinsi,
  k.nama_kabupaten,
  k.kode_kabupaten,
  a.numerator,
  a.denominator,
  a.unmet_need_pct
FROM (
  SELECT
    id_provinsi,
    id_kabupaten,
    SUM(
      COALESCE(hamil_ihn, 0)
      + COALESCE(hamil_tial, 0)
      + COALESCE(tdkhamil_ihn, 0)
      + COALESCE(tdkhamil_tial, 0)
    ) AS numerator,
    SUM(COALESCE(status_pus_true, 0)) AS denominator,
    CASE
      WHEN SUM(COALESCE(status_pus_true, 0)) = 0 THEN NULL
      ELSE
        SUM(
          COALESCE(hamil_ihn, 0)
          + COALESCE(hamil_tial, 0)
          + COALESCE(tdkhamil_ihn, 0)
          + COALESCE(tdkhamil_tial, 0)
        )::numeric
        / SUM(COALESCE(status_pus_true, 0))
        * 100
    END AS unmet_need_pct
  FROM dwh_siga.fa_laporan_dallap_bulanan_tabel10_20rdk
  WHERE tahun_rekap = :tahun
    AND bulan_rekap = :bulan
  GROUP BY id_provinsi, id_kabupaten
) a
LEFT JOIN dwh_siga.d_provinsi_2023 p ON p.id_provinsi = a.id_provinsi
LEFT JOIN dwh_siga.d_kabupaten_2023 k
  ON k.id_kabupaten = a.id_kabupaten
 AND k.id_provinsi = a.id_provinsi
ORDER BY a.id_provinsi, a.id_kabupaten;
