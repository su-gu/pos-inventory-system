# Worklog

Append-only, newest first. One entry per working session. Breadcrumbs for future-self —
when you change your mind mid-build, write down *why* here (or as an ADR in `../decisions/`).

---

## 2026-06-08 — Scaffold merged + structure laid

**Done**
- Installed Rust (`rustup`); `cargo` verified.
- Scaffolded Tauri 2 + React/TS (Vite) at `~/pos/pos-inventory-system`; window opened (gate item 1 ✅).
- Merged scaffold into repo via rsync (kept repo README/.gitignore/docs); `pnpm tauri dev` runs from repo; build dirs (`node_modules`, `target`, `dist`) correctly ignored. Removed leftover scaffold folder.
- Laid §7 folder structure: `src/modules/{catalog,inventory,pos,reports,setup}`, `src/components`, `src/lib`, `tests/`, `src-tauri/src/{db,events,sync,printer,auth}`.

**Next**
- First baseline commit (conventional). Choose git remote (GitHub/GitLab) + push.
- Then wire libraries (Tailwind/shadcn, Zustand/TanStack, rhf/zod, rusqlite, supabase-js) and tooling (ESLint/Prettier/strict TS, Husky/lint-staged, Vitest, CI).

---

## 2026-06-08 — Week 1 kickoff

**Done**
- Reviewed all 4 planning docs; assessed current state (planning-complete, zero code, nothing committed yet).
- Locked the SQLite Rust binding: **rusqlite** over sqlx. Rationale: async is marginal for a single-writer embedded DB; sqlx compile-time checks add CI/migration friction; cloud goes through supabase-js (TS), so sqlx's Postgres half is unused. Recorded in [ADR 0001](../decisions/0001-tech-stack.md).
- Established `docs/progress/` dev-tracking: [STATUS.md](./STATUS.md) (living dashboard) + this worklog.
- Identified Mac-vs-Windows split: hardware + Windows-installer gate items (gate 2–4, 7) deferred to a shop-machine session.

**Next**
- User installs Rust (`rustup`) and scaffolds Tauri 2 + React/TS on the Mac; verify `pnpm tauri dev` opens a window.
- Then: merge scaffold into repo, set §7 folder structure, wire Tailwind/shadcn/Zustand/TanStack/rusqlite/supabase-js, repo hygiene, first commit.

**Notes**
- `git`: branch `main` exists but has **no commits yet**; README/CHANGELOG/docs still untracked. First commit is a Week 1 task.
