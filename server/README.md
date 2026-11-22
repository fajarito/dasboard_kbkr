# Dashboard KBKR API — Unmet Need

Express API for **Unmet Need** aggregates.

- **Live Postgres** when `DATABASE_URL` or `PGHOST`+`PGDATABASE`+`PGUSER` are set
- **Fixture fallback** (partial ~1000-row sample) when DB env is unset

Default table: `dwh_siga.fa_laporan_dallap_bulanan_tabel10_20rdk`

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
| `UNMET_NEED_TABLE` | Optional `schema.table` override |
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

Response: `numerator`, `denominator`, `unmet_need_pct`, wilayah ids, `meta.source` (`postgres`|`fixture`).

Wilayah **names are not invented** — only ids.

## Examples

```bash
curl 'http://127.0.0.1:8787/api/unmet-need?level=nasional&tahun=2023&bulan=7'
curl 'http://127.0.0.1:8787/api/unmet-need?level=provinsi&tahun=2023&bulan=7'
curl 'http://127.0.0.1:8787/api/unmet-need?level=kabupaten&tahun=2023&bulan=7&id_provinsi=25'
curl 'http://127.0.0.1:8787/api/unmet-need?level=nasional&tahun=2023'   # yearly rollup
```

## SQL reference

`sql/unmet-need-examples.sql` and DDL in `sql/fa_laporan_dallap_bulanan_tabel10_20rdk.sql`.

## OpenShift

SPA Deployment (`deploy/openshift/`) stays nginx-only. This API is a separate Node process; wire DB secrets via OpenShift env/Secret when promoted to a service — never bake them into the image.
