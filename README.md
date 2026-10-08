<div align="center">

# HSMS Frontend

**Housing Society Management System — Next.js operations console**

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

[Repository](https://github.com/ubaid-dev-01/hsms-frontend) · [Author](https://github.com/ubaid-dev-01) · [Portfolio](https://ubaid-dev-01.vercel.app)

</div>

---

## Overview

Admin/ops frontend for HSMS: plot lifecycle, installments, visitors, gamification rewards, file management, and policy-aware dashboards. Next.js App Router with TanStack Query/Table and a documented design system.

## Features

- Protected operational routes
- Plot and billing workflows
- Visitor management
- Gamification rewards admin
- File management guides
- Design system documentation

## Architecture

App Router with `(protected)` segments. Server/client components split by data needs. API contract documented in `BACKEND_API_SPECIFICATION.md`.

## Tech stack

- Next.js
- React
- TypeScript
- TanStack Query + Table
- Redux
- Tailwind + shadcn/ui
- Leaflet maps

## Project structure

```text
hsms-frontend/
├── app/ components/ hooks/ lib/
└── docs/
```

## Getting started

```bash
cp env.example .env.local
npm install
npm run dev
```

## Environment

API base URL and auth-related public vars go in `.env.local` (see `env.example`).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` / `dev:turbo` | Local Next |
| `npm run build` / `start` | Production |

## Documentation

| Doc | Purpose |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System shape, data flow, boundaries |
| [docs/SETUP.md](docs/SETUP.md) | Local install, env, runbook |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Branching, commits, PR checklist |


## Author

**M Ubaid Javaid** — Software Engineer (MERN / Next.js)

- GitHub: [https://github.com/ubaid-dev-01](https://github.com/ubaid-dev-01)
- Portfolio: [https://ubaid-dev-01.vercel.app](https://ubaid-dev-01.vercel.app)
- Email: mubaidjavaid97@gmail.com

## License

Source is published for portfolio and engineering review. Client product ownership is not implied unless stated in a case study.

