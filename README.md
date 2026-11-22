# Dashboard 12 Indikator Prioritas KBKR

Overview + detail indikator + Peta Capaian for Kemendukbangga — 12 indikator prioritas KBKR.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- Recharts
- MapLibre GL (Peta Capaian)

## Scripts

```bash
npm install
npm run dev          # SPA only (Vite)
npm run api          # Unmet Need API → http://127.0.0.1:8787
npm run dev:all      # SPA + API (Vite proxies /api → :8787)
npm run build
```

Local app: `http://127.0.0.1:5173/`

### Unmet Need API

- **Postgres** when `DATABASE_URL` or `PGHOST`/`PGPORT`/`PGDATABASE`/`PGUSER`/`PGPASSWORD` are set (default table `dwh_siga.fa_laporan_dallap_bulanan_tabel10_20rdk`). Example: port **5435**, database **BKKBN** — see [`.env.example`](.env.example).
- **Wilayah names** from year-suffixed `d_provinsi_YYYY` / `d_kabupaten_YYYY` (exact `tahun_rekap`, else nearest year); fixture dims when DB unset.
- **Excel dummy (default UI)** for **Oktober 2026** (`tahun=2026&bulan=10`): nasional Unmet Need ≈ **5,6%**, mCPR proxy ≈ **67,0%**, 4T ≈ **22,3%** (Tabel1 `jumlah_bumil_4t`÷`jumlah_bumil`) from `src/data/dummy/oct2026.json` (38 Provinsi). Set `VITE_USE_LIVE_API=true` to force `/api` instead.
- **Fixture fallback** if DB env is unset: Oct 2026 → `server/fixtures/oct2026_excel_dummy.json`; other periods → partial ~1000-row sample.

```bash
cp .env.example .env   # fill credentials locally — never commit .env
npm run api
curl 'http://127.0.0.1:8787/api/unmet-need?level=nasional&tahun=2026&bulan=10'
```

Details + SQL examples: [`server/README.md`](server/README.md).

OpenShift SPA image stays nginx-only; API + DB secrets can be a separate service later.

## OpenShift deploy

**Project / namespace:** `dashboard-kbkr` (display name: Dashboard KBKR).

Static SPA image (multi-stage Node build → **nginx-unprivileged** on port **8080**). Required for OpenShift **restricted** pod security — do not switch to root nginx. Manifests under `deploy/openshift/` (no secrets).

### 1. Build & push image

```bash
# From repo root — namespace dashboard-kbkr
podman build -t image-registry.openshift-image-registry.svc:5000/dashboard-kbkr/dasboard-kbkr:latest .
podman push image-registry.openshift-image-registry.svc:5000/dashboard-kbkr/dasboard-kbkr:latest
```

Or with OpenShift Build:

```bash
oc project dashboard-kbkr
oc new-build --name=dasboard-kbkr --binary --strategy=docker
oc start-build dasboard-kbkr --from-dir=. --follow
```

### 2. Optional Route host

Set `spec.host` in `deploy/openshift/route.yaml` if you need a fixed hostname; otherwise OpenShift generates one.

### 3. Apply manifests

```bash
oc project dashboard-kbkr
oc apply -f deploy/openshift/configmap.yaml
oc apply -f deploy/openshift/deployment.yaml
oc apply -f deploy/openshift/service.yaml
oc apply -f deploy/openshift/route.yaml
oc get route dasboard-kbkr -n dashboard-kbkr
```

Health check path: `/health`. SPA routes fall back to `index.html` (React Router).

## Design

Figma-driven Overview, 12 indicator detail pages (SIGA notes/stubs), and MapLibre province outline map (`/peta`) without invented wilayah values.
