# POS + Inventory System

A Windows desktop POS and inventory management system for a garments/hosiery retail shop in India. Offline-first with cloud sync.

## Status

🚧 **In active development — v1 planning complete, Week 1 setup in progress.**

## Documentation

- **[Status dashboard](./docs/progress/STATUS.md) — current dev state; read this first.**
- [Worklog](./docs/progress/worklog.md) — per-session history
- [Planning docs](./docs/planning/) — module list, timeline, risks, tech setup
- [Decisions](./docs/decisions/) — ADRs (architecture decision records)
- [Parked features](./docs/parked/) — deferred ideas (v2+)
- [Runbooks](./docs/runbooks/) — operational procedures

## Tech stack

- **Desktop:** Tauri 2 + React + TypeScript
- **Local DB:** SQLite (event-sourced ledger)
- **Cloud:** Supabase (Postgres + Storage)
- **UI:** shadcn/ui + Tailwind
- **Architecture:** Local-first, configurable cloud sync

See [01-module-list.md](./docs/planning/01-module-list.md) for full scope.

## Quick start

> Not yet runnable — scaffolding pending (Week 1 task).

## License

Private / proprietary.
