# Development Status — single source of truth

> **Read this first every session.** It records exactly where the build is, what's done,
> what's blocked, and the next action. Update it at the end of every working session.
> Detailed per-session history lives in [worklog.md](./worklog.md).

- **Last updated:** 2026-06-08
- **Current phase:** Phase 1 — Foundation
- **Current week:** Week 1 — Tech setup ([checklist](../planning/04-tech-setup-checklist.md)) — **Mac-complete ✅** (shop-machine hardware items remain)
- **Stack:** Locked — see [ADR 0001](../decisions/0001-tech-stack.md) (Tauri 2 + React/TS + Rust + rusqlite + Supabase)

## Legend

`✅ done` · `🔄 in progress` · `⬜ todo` · `🚫 blocked (shop machine)` · `⏸ deferred`

---

## Environment split

Dev on **macOS** (this machine). Deploy target **Windows**. TVS thermal printer, label
printer, and scanner live on the **shop's Windows machine** — not on the dev Mac. Any task
needing hardware or a Windows installer is marked 🚫 and batched for a shop-machine session.

---

## Week 1 — progress

### Mac-doable (critical path)

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | Lock stack + ADR 0001 | ✅ | rusqlite chosen over sqlx |
| 2 | Install Rust toolchain (`rustup`) | ✅ | `cargo` on PATH after `source ~/.cargo/env` |
| 3 | Scaffold Tauri 2 + React/TS, `tauri dev` opens window | ✅ | window opened; toolchain verified end-to-end |
| 4 | Merge scaffold into repo (preserve `docs/` + `.git`) | ✅ | runs from repo; build dirs ignored |
| 5 | Folder structure per checklist §7 | ✅ | module + Rust domain dirs (.gitkeep) |
| 6 | Add Tailwind + shadcn/ui | ✅ | Tailwind v4 + shadcn (Radix/Nova, Neutral, Lucide); Button renders |
| 7 | Add Zustand + TanStack Query | ✅ | installed; providers wired when first used |
| 8 | Add react-hook-form + zod | ✅ | installed; used from Week 3 |
| 9 | Add rusqlite (Rust side) | ✅ | `bundled`; `db_healthcheck` writes `pos-dev.sqlite` |
| 10 | Add supabase-js (TS side) | ✅ | client + `cloudHealthcheck()` in `src/lib/supabase.ts` |
| 11 | TS strict mode, ESLint, Prettier | ✅ | flat ESLint 9 config; `noUncheckedIndexedAccess` on |
| 12 | Husky + lint-staged + `tsc --noEmit` hook | ✅ | pre-commit live |
| 13 | First conventional commit | ✅ | baseline scaffold + docs |
| 14 | GitHub repo (private) + push | ✅ | personal account via PAT/HTTPS |
| 15 | CI: install / tsc / lint / test on push | ✅ | GitHub Actions green on push/PR |
| 16 | Supabase account + project provisioned | ✅ | project in ap-south-1 (Mumbai) |
| 17 | `.env.local` (gitignored) + `.env.example` | ✅ | new-format publishable key; service-role excluded |
| 18 | One successful Supabase call → "Cloud OK" (gate 6) | ✅ | GoTrue health endpoint 200 |
| 19 | Vitest wired (smoke test) | ✅ | `tests/smoke.test.ts` green |

### Shop-machine (deferred — needs Windows + hardware)

| # | Item | Status | Notes |
|---|---|---|---|
| H1 | TVS thermal printer: driver + ESC/POS "Hello World" print (gate 2) | 🚫 | highest-priority shop task (R4) |
| H2 | TVS label printer: print test barcode label (gate 3) | 🚫 | |
| H3 | Scanner: reads printed barcode into input field (gate 4) | 🚫 | note suffix char (\n / \t) |
| H4 | `tauri build` → Windows installer on clean VM (gate 7) | 🚫 | |

---

## Week 1 verification gate (§9) — 7 items

| Gate | Item | Status |
|---|---|---|
| 1 | `tauri dev` opens window with placeholder UI | ✅ |
| 2 | Button prints "Hello from POS" on thermal printer | 🚫 |
| 3 | Button prints barcode label | 🚫 |
| 4 | Scanner types barcode into input | 🚫 |
| 5 | SQLite file created on disk, openable in DB Browser | ✅ |
| 6 | One successful Supabase call → "Cloud OK" | ✅ |
| 7 | `tauri build` installs + launches on clean Windows VM | 🚫 |

> Gate items 2–4 and 7 cannot close on the Mac. Week 1 is "Mac-complete" when 1, 5, 6 pass
> and all Mac-doable rows above are ✅; the 🚫 items close in a shop-machine session.

---

## Next action

All Mac-doable Week 1 items are ✅. Two tracks open:
1. **Shop-machine session** — close gate items 2–4 (printers + scanner) and 7 (Windows installer) on the shop's Windows machine. This is the rest of Week 1.
2. **Week 2 (Mac-doable now)** — DB schema for all entities, versioned migration runner, append-only event log + envelope, local PIN auth + roles. Start whenever.

## Blockers

- Hardware gate items blocked on shop's Windows machine (expected, not a problem).

## Open decisions

- _None pending._ (Resolved: SQLite binding → rusqlite, ADR 0001.)
