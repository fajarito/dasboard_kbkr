

-- ----------------------------
-- Table structure for fa_laporan_dallap_bulanan_tabel10_20rdk
-- ----------------------------
DROP TABLE IF EXISTS "dwh_siga"."fa_laporan_dallap_bulanan_tabel10_20rdk";
CREATE TABLE "dwh_siga"."fa_laporan_dallap_bulanan_tabel10_20rdk" (
  "id_provinsi" int4 NOT NULL,
  "id_kabupaten" int4 NOT NULL,
  "id_kecamatan" int4 NOT NULL,
  "id_kelurahan" int4 NOT NULL,
  "status_pus_true" int4,
  "kesertaan_berkb_sedang" int4,
  "kes_berkb_sdg_mtd_suntik" int4,
  "kes_berkb_sdg_mtd_pil" int4,
  "kes_berkb_sdg_mtd_kondom" int4,
  "kes_berkb_sdg_mtd_implan" int4,
  "kes_berkb_sdg_mtd_iud" int4,
  "kes_berkb_sdg_mtd_vasektomi" int4,
  "kes_berkb_sdg_mtd_tubektomi" int4,
  "kes_berkb_sdg_mtd_mal" int4,
  "kes_berkb_sdg_mtd_tradisional" int4,
  "capaian_lestari_mkjp" int4,
  "capaian_mandiri_mkjp" int4,
  "status_pus_true_jkn_pbi" int4,
  "status_pus_true_jkn_nonpbi" int4,
  "status_pus_true_non_jkn" int4,
  "status_pus_true_tdk_memiliki_jkn" int4,
  "peserta_kb_pa" int4,
  "peserta_kb_pa_suntik" int4,
  "peserta_kb_pa_pil" int4,
  "peserta_kb_pa_kondom" int4,
  "peserta_kb_pa_implan" int4,
  "peserta_kb_pa_iud" int4,
  "peserta_kb_pa_vasektomi" int4,
  "peserta_kb_pa_tubektomi" int4,
  "peserta_kb_pa_mal" int4,
  "peserta_kb_pa_tradisional" int4,
  "peserta_kb_pa_modern_pemerintah" int4,
  "peserta_kb_pa_modern_suntik_pemr" int4,
  "peserta_kb_pa_modern_pil_pemr" int4,
  "peserta_kb_pa_modern_kondom_pemr" int4,
  "peserta_kb_pa_modern_implan_pemr" int4,
  "peserta_kb_pa_modern_iud_pemr" int4,
  "peserta_kb_pa_modern_vasektomi_pemr" int4,
  "peserta_kb_pa_modern_tubektomi_pemr" int4,
  "peserta_kb_pa_modern_swasta" int4,
  "peserta_kb_pa_modern_suntik_swst" int4,
  "peserta_kb_pa_modern_pil_swst" int4,
  "peserta_kb_pa_modern_kondom_swst" int4,
  "peserta_kb_pa_modern_implan_swst" int4,
  "peserta_kb_pa_modern_iud_swst" int4,
  "peserta_kb_pa_modern_vasektomi_swst" int4,
  "peserta_kb_pa_modern_tubektomi_swst" int4,
  "peserta_kb_pa_modern_jkn_pbi_nonpbi" int4,
  "peserta_kb_pa_modern_suntik_jkn_pbi_nonpbi" int4,
  "peserta_kb_pa_modern_pil_jkn_pbi_nonpbi" int4,
  "peserta_kb_pa_modern_kondom_jkn_pbi_nonpbi" int4,
  "peserta_kb_pa_modern_implan_jkn_pbi_nonpbi" int4,
  "peserta_kb_pa_modern_iud_jkn_pbi_nonpbi" int4,
  "peserta_kb_pa_modern_vasektomi_jkn_pbi_nonpbi" int4,
  "peserta_kb_pa_modern_tubektomi_jkn_pbi_nonpbi" int4,
  "peserta_kb_pa_modern_jkn_pbi" int4,
  "peserta_kb_pa_modern_suntik_jkn_pbi" int4,
  "peserta_kb_pa_modern_pil_jkn_pbi" int4,
  "peserta_kb_pa_modern_kondom_jkn_pbi" int4,
  "peserta_kb_pa_modern_implan_jkn_pbi" int4,
  "peserta_kb_pa_modern_iud_jkn_pbi" int4,
  "peserta_kb_pa_modern_vasektomi_jkn_pbi" int4,
  "peserta_kb_pa_modern_tubektomi_jkn_pbi" int4,
  "pus_hamil_ihsi_berkb" int4,
  "pus_hamil_ihsi_tdk_berkb" int4,
  "pus_hamil_ihn_berkb" int4,
  "pus_hamil_ihn_tdk_berkb" int4,
  "pus_hamil_tial_berkb" int4,
  "pus_hamil_tial_tdk_berkb" int4,
  "pus_tdk_hamil_ias_berkb" int4,
  "pus_tdk_hamil_ias_tdk_berkb" int4,
  "pus_tdk_hamil_ian_berkb" int4,
  "pus_tdk_hamil_ian_tdk_berkb" int4,
  "pus_tdk_hamil_tial_berkb" int4,
  "pus_tdk_hamil_tial_tdk_berkb" int4,
  "putus_mtd_suntik" int4,
  "putus_mtd_pil" int4,
  "putus_mtd_kondom" int4,
  "putus_mtd_implan" int4,
  "putus_mtd_iud" int4,
  "putus_mtd_vasektomi" int4,
  "putus_mtd_tubektomi" int4,
  "tahun_rekap" int4 NOT NULL,
  "bulan_rekap" int4 NOT NULL,
  "hamil_ias" int4,
  "hamil_ihn" int4,
  "hamil_tial" int4,
  "tdkhamil_ias" int4,
  "tdkhamil_ihn" int4,
  "tdkhamil_tial" int4,
  "uppka_status_pus_true" int4,
  "uppka_kesertaan_berkb_sedang" int4,
  "uppka_kes_berkb_sdg_mtd_suntik" int4,
  "uppka_kes_berkb_sdg_mtd_pil" int4,
  "uppka_kes_berkb_sdg_mtd_kondom" int4,
  "uppka_kes_berkb_sdg_mtd_implan" int4,
  "uppka_kes_berkb_sdg_mtd_iud" int4,
  "uppka_kes_berkb_sdg_mtd_vasektomi" int4,
  "uppka_kes_berkb_sdg_mtd_tubektomi" int4,
  "uppka_kes_berkb_sdg_mtd_mal" int4,
  "uppka_kes_berkb_sdg_mtd_tradisional" int4
)
;
ALTER TABLE "dwh_siga"."fa_laporan_dallap_bulanan_tabel10_20rdk" OWNER TO "postgres";

-- ----------------------------
-- Indexes structure for table fa_laporan_dallap_bulanan_tabel10_20rdk
-- ----------------------------
CREATE INDEX "fa_laporan_dallap_bulanan_tabel10_20rdk_idx_period" ON "dwh_siga"."fa_laporan_dallap_bulanan_tabel10_20rdk" USING btree (
  "tahun_rekap" "pg_catalog"."int4_ops" ASC NULLS LAST,
  "bulan_rekap" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "fa_laporan_dallap_bulanan_tabel10_20rdk_idx_tahun" ON "dwh_siga"."fa_laporan_dallap_bulanan_tabel10_20rdk" USING btree (
  "tahun_rekap" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "fa_laporan_dallap_bulanan_tabel10_20rdk_tahun_rekap_idx" ON "dwh_siga"."fa_laporan_dallap_bulanan_tabel10_20rdk" USING btree (
  "tahun_rekap" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table fa_laporan_dallap_bulanan_tabel10_20rdk
-- ----------------------------
ALTER TABLE "dwh_siga"."fa_laporan_dallap_bulanan_tabel10_20rdk" ADD CONSTRAINT "fa_laporan_dallap_bulanan_tabel10_20rdk_pk" PRIMARY KEY ("id_provinsi", "id_kabupaten", "id_kecamatan", "id_kelurahan", "tahun_rekap", "bulan_rekap");
