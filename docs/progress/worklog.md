# Worklog

Append-only, newest first. One entry per working session. Breadcrumbs for future-self —
when you change your mind mid-build, write down *why* here (or as an ADR in `../decisions/`).

---

## 2026-06-08 — Week 1 Mac-complete (gates 5 + 6 green)

**Done**
- rusqlite (bundled) wired via a `db` module; `db_healthcheck` creates `pos-dev.sqlite` in the app data dir and writes rows. Gate 5 ✅.
- Supabase project provisioned (ap-south-1 Mumbai). `@supabase/supabase-js` client + `cloudHealthcheck()` (GoTrue health endpoint). `.env.local` (gitignored, new-format publishable key) + committed `.env.example`. "Check Cloud" → Cloud OK. Gate 6 ✅.
- CI workflow (typecheck/lint/test) green on push.
- Pre-commit hook caught the missing `@supabase/supabase-js` dep before commit — working as intended.

**State:** Every Mac-doable Week 1 item complete. Remaining Week 1 = shop-machine hardware (gate 2–4) + Windows installer (gate 7).

**Next options**
- Shop-machine session: TVS thermal/label printers + scanner + `tauri build` installer.
- Or start Week 2 on the Mac: schema + migration runner + event log + PIN auth.

**Note:** shell is fish — heredocs (`<<EOF`) fail; use `echo >` / `echo >>` for file creation.

---

## 2026-06-08 — Repo hygiene + remote

**Done**
- Pushed baseline to private GitHub repo (personal account, PAT over HTTPS) — covers R9.
- Repo hygiene: ESLint 9 flat config (typescript-eslint, react-hooks, react-refresh) + Prettier (single quotes, width 100, trailing-all; markdown prettier-ignored to keep spec docs pristine). Strict TS bumped with `noUncheckedIndexedAccess`. Vitest wired with a smoke test. Husky pre-commit runs lint-staged + `tsc --noEmit`. All green.

**Next**
- Frontend libs: Tailwind v4 + shadcn/ui, Zustand, TanStack Query, react-hook-form + zod.
- Then rusqlite (gate 5: SQLite file on disk) and Supabase project + supabase-js (gate 6: Cloud OK).
- CI workflow (tsc/lint/test on push).

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
