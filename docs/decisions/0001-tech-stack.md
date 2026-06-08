# 0001 — Tech stack

- **Status:** Accepted
- **Date:** 2026-06-08
- **Context:** Week 1, foundation. Locks the core stack before any feature code.
- **References:** [Planning docs](../planning/) — [modules](../planning/01-module-list.md), [timeline](../planning/02-three-month-timeline.md), [risks](../planning/03-risk-list.md), [tech setup](../planning/04-tech-setup-checklist.md)

## Decision

Build the POS + inventory system as a **Tauri 2** desktop app with a **React + TypeScript** frontend and a **Rust** backend, backed by a **local-first, event-sourced SQLite** ledger, with **Supabase** (Postgres + Storage) for opportunistic cloud sync and backup.

Specific bindings/libraries:

| Concern | Choice |
|---|---|
| Desktop shell | Tauri 2 |
| Frontend | React + TypeScript (strict) |
| Backend | Rust |
| Local DB driver | **rusqlite** (see below) |
| Local DB | SQLite, event-sourced (append-only `events` + materialized state) |
| Cloud | Supabase — reached from the **TS side via supabase-js**, not from Rust |
| UI | Tailwind + shadcn/ui |
| State / data | Zustand + TanStack Query |
| Forms / validation | react-hook-form + zod |

## Rationale

**Why Tauri (not Electron):** small binary, native Rust backend for direct hardware access (ESC/POS to the TVS thermal + label printers), low memory footprint on modest shop hardware. Deploy target is Windows.

**Why local-first:** billing must never depend on internet. The shop runs ~30 txns/day; a flaky connection cannot block a sale. Cloud is for backup and (later) sync, never the source of truth.

**Why event-sourced:** the ledger is recoverable and auditable — every stock movement, sale, void, and adjustment is an append-only event; materialized state is rebuilt by replay. This underpins the recoverability and audit reports in the plan, and the replay-equivalence test guarding [R2](../planning/03-risk-list.md#r2--event-sourcing-discipline-collapse-mid-build).

## SQLite binding: rusqlite (over sqlx)

The Week 1 checklist (§1.4) left this open with sqlx tagged "recommended". We chose **rusqlite** instead.

- **sqlx's async is marginal here.** SQLite is a synchronous, single-writer engine; v1 is a single counter (multi-device is explicitly v2). There is no concurrency pressure for async to relieve.
- **sqlx's compile-time query checking adds build/CI friction** (needs a live DB at build time or an `sqlx prepare` offline cache) — exactly when we're building the migration runner and CI from scratch in Week 2.
- **sqlx's cross-DB strength does not apply.** Cloud access goes through supabase-js on the TS side; the Rust layer only ever touches local SQLite, so the sqlx-Postgres half would go unused.
- **rusqlite maps cleanly to SQLite**, has simple transactional control (required for transactional migrations — [R5](../planning/03-risk-list.md#r5--schema-migration-bugs-in-production)), no build-time DB coupling, lighter build.

**Tradeoff accepted:** manual row→struct mapping (optionally `serde_rusqlite`) and no compile-time query checking. Acceptable for a single-writer local ledger. Event-sourcing safety comes from the `appendEvent()` / `applyEvent()` funnel, not from the driver.

## Dev/deploy split

Development happens on **macOS**; deploy target is **Windows**. Hardware (TVS thermal printer, label printer, scanner) lives on the shop's Windows machine. Consequence: Week 1 verification-gate items that require hardware or a Windows installer (gate items 2–4 and 7) are deferred to a shop-machine session and tracked separately. Mac-doable Week 1 work (Rust install, Tauri scaffold, repo hygiene, Supabase healthcheck) proceeds independently.

## Consequences

- All local mutations must flow through the event layer; state tables are written only by event handlers (enforces R2).
- Rust owns hardware + local DB; TS owns UI + cloud sync.
- Dependency versions pinned (no floating `^`/`~` on critical libs); upgrades only at phase boundaries ([R10](../planning/03-risk-list.md#r10--tauri-or-supabase-api-breaking-changes)).
