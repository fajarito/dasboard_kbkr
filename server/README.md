# Dashboard KBKR API (Phase 1 — fixture)

Lightweight Express API that serves **Unmet Need** from the partial DALLAP sample JSON (~1000 kelurahan rows). No live Postgres required.

**National / provincial percentages from this API are fixture-only** — the sample does not cover all wilayah.

## Run

From repo root (after `npm install`):

```bash
# API only (default http://127.0.0.1:8787)
npm run api

# SPA + API together (Vite proxies /api → :8787)
npm run dev:all
```

Health: `GET http://127.0.0.1:8787/api/health`

## Unmet Need endpoint

```
GET /api/unmet-need?level=nasional|provinsi|kabupaten&tahun=&bulan=&id_provinsi=&id_kabupaten=
```

| Param | Meaning |
| --- | --- |
| `level` | Aggregation: `nasional`, `provinsi`, or `kabupaten` |
| `tahun` | `tahun_rekap` (optional) |
| `bulan` | `bulan_rekap` 1–12 (optional). **Omit for yearly rollup** (sum nums/dens across months, then %) |
| `id_provinsi` | Optional filter |
| `id_kabupaten` | Optional filter |

**Formula:** `(hamil_ihn + hamil_tial + tdkhamil_ihn + tdkhamil_tial) / status_pus_true * 100`  
Denominator 0 → `unmet_need_pct: null`.

Response includes `numerator`, `denominator`, `unmet_need_pct`, wilayah ids, and `meta.fixture_note`.

Wilayah **names are not invented** — only ids from the fixture are returned.

## Examples

```bash
curl 'http://127.0.0.1:8787/api/unmet-need?level=nasional&tahun=2023&bulan=7'
curl 'http://127.0.0.1:8787/api/unmet-need?level=provinsi&tahun=2023&bulan=7'
curl 'http://127.0.0.1:8787/api/unmet-need?level=kabupaten&tahun=2023&bulan=7&id_provinsi=25'
curl 'http://127.0.0.1:8787/api/unmet-need?level=nasional&tahun=2023'   # yearly rollup
```

## SQL for later (live DWH)

See `sql/unmet-need-examples.sql` and table DDL in `sql/fa_laporan_dallap_bulanan_tabel10_20rdk.sql` for Postgres `dwh_siga.fa_laporan_dallap_bulanan_tabel10_20rdk`.

## OpenShift

The existing SPA Deployment (`deploy/openshift/`) stays unchanged — nginx static only. This API is a separate Node process for local/dev; it can become its own OpenShift service later without changing the SPA image.
