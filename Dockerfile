# syntax=docker/dockerfile:1
# Multi-stage image for OpenShift (static Vite SPA + nginx, non-root, PORT 8080).

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
# VITE_* are inlined at build time. Override with --build-arg if needed later.
# ARG VITE_API_BASE_URL=
# ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Unprivileged nginx (UID 101) — required for OpenShift restricted pod security
# (project dashboard-kbkr). Do not replace with root nginx.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# OpenShift may remount with arbitrary UID in group 0; keep tree group-writable.
USER root
RUN chgrp -R 0 /usr/share/nginx/html /etc/nginx/conf.d \
  && chmod -R g=u /usr/share/nginx/html /etc/nginx/conf.d
USER 101

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
