# Architecture — HSMS Frontend

## Intent

Admin/ops frontend for HSMS: plot lifecycle, installments, visitors, gamification rewards, file management, and policy-aware dashboards. Next.js App Router with TanStack Query/Table and a documented design system.

## System shape

App Router with `(protected)` segments. Server/client components split by data needs. API contract documented in `BACKEND_API_SPECIFICATION.md`.

## Stack decisions

- Next.js
- React
- TypeScript
- TanStack Query + Table
- Redux
- Tailwind + shadcn/ui
- Leaflet maps

## Boundaries

- Secrets stay in environment variables / secret managers — never in git.
- Client bundles only receive public configuration (`NEXT_PUBLIC_*` / `VITE_*`).
- Tenant or role checks belong in middleware / server layers, not UI-only gates.
- Heavy or long-running work should not run inside short-lived serverless handlers unless designed for it.

## Quality bar

- Prefer typed contracts at API and domain boundaries.
- Ship a vertical slice (auth → persisted outcome) before a broad feature surface.
- Document trade-offs in PRs when changing data models or auth.

