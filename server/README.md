# Dashboard KBKR API — Unmet Need

Express API for **Unmet Need** aggregates with wilayah name enrichment.

- **Live Postgres** when `DATABASE_URL` or `PGHOST`+`PGDATABASE`+`PGUSER` are set
- **Fixture fallback** (partial ~1000-row sample) when DB env is unset

Default fact table: `dwh_siga.fa_laporan_dallap_bulanan_tabel10_20rdk`

## Run

```bash
cp .env.example .env   # fill PG* or DATABASE_URL — never commit .env
npm install
npm run api            # http://127.0.0.1:8787
npm run dev:all        # SPA + API (Vite proxies /api → :8787)
```

Without DB env, the API uses `server/fixtures/…_sample.json` (fixture-only %).

Health: `GET /api/health` — reports `data_source: postgres|fixture`.

## Env

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Preferred connection string |
| `PGHOST` / `PGPORT` / `PGDATABASE` / `PGUSER` / `PGPASSWORD` | Discrete connection (example port **5435**, database **BKKBN**) |
| `UNMET_NEED_TABLE` | Optional fact `schema.table` override |
| `DIM_SCHEMA` | Schema for year-suffixed dims (default `dwh_siga`) |
| `PORT` | API listen port (default `8787`) |

See repo-root [`.env.example`](../.env.example). **Do not commit real passwords or host secrets.**

## Unmet Need endpoint

```
GET /api/unmet-need?level=nasional|provinsi|kabupaten&tahun=&bulan=&id_provinsi=&id_kabupaten=
```

| Param | Meaning |
| --- | --- |
| `level` | `nasional`, `provinsi`, or `kabupaten` |
| `tahun` | `tahun_rekap` (optional) |
| `bulan` | `bulan_rekap` 1–12 (optional). **Omit for yearly rollup** |
| `id_provinsi` / `id_kabupaten` | Optional filters |

**Formula:** `(hamil_ihn + hamil_tial + tdkhamil_ihn + tdkhamil_tial) / status_pus_true * 100`  
Denominator 0 → `unmet_need_pct: null`.

### Response fields

Each row includes:

- `numerator`, `denominator`, `unmet_need_pct`, `row_count` (`0` kept; denom-0 → `unmet_need_pct` omitted)
- `id_provinsi` / `id_kabupaten` when applicable
- `nama_provinsi` / `kode_provinsi` / `nama_kabupaten` / `kode_kabupaten` when dim join hits

**Null keys are omitted** from `data[]` items and `meta` (including nested filters/wilayah). Zeros and empty strings are kept.

`meta.wilayah` reports which dim year/tables were used when present.

### Wilayah dims

| Mode | Source |
| --- | --- |
| Postgres | `{DIM_SCHEMA}.d_provinsi_YYYY` and `d_kabupaten_YYYY` — exact `tahun_rekap`, else **nearest** available year table |
| Fixture | `fixtures/d_provinsi_sample.json` + `d_kabupaten_sample.json` (same nearest-year rule) |

Names are **never invented** — missing joins stay `null`.

## Examples

```bash
# Provinsi with names (fixture or PG)
curl -s 'http://127.0.0.1:8787/api/unmet-need?level=provinsi&tahun=2023&bulan=7' | jq '.data[0]'
# → id_provinsi, nama_provinsi, kode_provinsi, unmet_need_pct, …

curl -s 'http://127.0.0.1:8787/api/unmet-need?level=kabupaten&tahun=2023&bulan=7&id_provinsi=25' | jq '.data[:2]'
curl -s 'http://127.0.0.1:8787/api/unmet-need?level=nasional&tahun=2023&bulan=7' | jq '.meta.wilayah'
curl -s 'http://127.0.0.1:8787/api/unmet-need?level=nasional&tahun=2023'   # yearly rollup
```

## SQL reference

- Fact + aggregate examples: `sql/unmet-need-examples.sql`
- Dim DDL: `sql/d_provinsi.sql`, `sql/d_kabupaten.sql`
- Fact DDL: `sql/fa_laporan_dallap_bulanan_tabel10_20rdk.sql`

## OpenShift

SPA Deployment (`deploy/openshift/`) stays nginx-only. This API is a separate Node process; wire DB secrets via OpenShift env/Secret when promoted to a service — never bake them into the image.
