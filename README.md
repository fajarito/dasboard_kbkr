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
npm run dev
npm run build
```

Local app: `http://127.0.0.1:5173/`

## OpenShift deploy

Static SPA image (multi-stage Node build → nginx on port **8080**, non-root). Manifests under `deploy/openshift/` (no secrets).

### 1. Build & push image

```bash
# From repo root — replace NAMESPACE / registry as needed
podman build -t image-registry.openshift-image-registry.svc:5000/NAMESPACE/dasboard-kbkr:latest .
podman push image-registry.openshift-image-registry.svc:5000/NAMESPACE/dasboard-kbkr:latest
```

Or with OpenShift Build:

```bash
oc new-build --name=dasboard-kbkr --binary --strategy=docker
oc start-build dasboard-kbkr --from-dir=. --follow
```

### 2. Edit placeholders

In `deploy/openshift/deployment.yaml`, set `image:` to your registry/`NAMESPACE`/tag.

Optional: set Route `spec.host` in `deploy/openshift/route.yaml`.

### 3. Apply manifests

```bash
oc project NAMESPACE
oc apply -f deploy/openshift/configmap.yaml
oc apply -f deploy/openshift/deployment.yaml
oc apply -f deploy/openshift/service.yaml
oc apply -f deploy/openshift/route.yaml
oc get route dasboard-kbkr
```

Health check path: `/health`. SPA routes fall back to `index.html` (React Router).

## Design

Figma-driven Overview, 12 indicator detail pages (SIGA notes/stubs), and MapLibre province outline map (`/peta`) without invented wilayah values.
