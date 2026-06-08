# Tech Setup Checklist — Week 1

Everything that needs to be installed, configured, or signed up for **before you write the first feature line of code.** Goal: by end of Week 1, you have a Tauri app that builds, runs on Windows, connects to Supabase, and prints a test page to your TVS thermal printer.

> Companion docs: [Modules](./01-module-list.md) · [Timeline](./02-three-month-timeline.md) · [Risks](./03-risk-list.md)

---

## 1. Development machine prerequisites

This is your dev machine (could be the same as the shop's POS, but ideally a separate dev machine).

### 1.1 Operating system
- [ ] **Windows 10/11** as primary dev OS (matches deployment target — saves cross-platform pain)
- [ ] Optional: a Mac/Linux for code editing, but **always build & test on Windows**

### 1.2 Core toolchains
- [ ] **Node.js 20 LTS or later** — `node --version` shows v20+
- [ ] **pnpm** (recommended) or **npm 10+** — `pnpm --version`
- [ ] **Rust toolchain via `rustup`** — `rustc --version` and `cargo --version` work
   - Tauri uses Rust for the native backend
- [ ] **Git 2.40+** — `git --version`
- [ ] **VS Code** (or your editor of choice) with:
   - [ ] Rust Analyzer extension
   - [ ] ESLint extension
   - [ ] Prettier extension
   - [ ] Tauri extension

### 1.3 Tauri 2 prerequisites (Windows-specific)
- [ ] **Microsoft Visual Studio C++ Build Tools** — required by Rust for Windows linking
- [ ] **WebView2 runtime** — usually pre-installed on Windows 11; verify
- [ ] Run `pnpm create tauri-app@latest` once to verify environment

### 1.4 SQLite tooling
- [ ] **SQLite CLI** — for inspecting the local DB during development
- [ ] **DB Browser for SQLite** (GUI) — useful for verifying state
- [ ] Decide on Rust binding: `sqlx` (async, recommended) **or** `rusqlite` (sync, simpler) — locked-in by end of Week 1

---

## 2. Repository setup

- [ ] **GitHub or GitLab repo created** — private to start
- [ ] `.gitignore` covers: `node_modules/`, `target/`, `dist/`, `*.db`, `*.db-journal`, `.env*`, `.tauri/`
- [ ] `README.md` with: project name, one-line description, run instructions
- [ ] `LICENSE` — decide (private/proprietary is fine for v1)
- [ ] Branch strategy: `main` (stable) + feature branches; PR before merge even though solo (for self-review)
- [ ] Commit hygiene: conventional commits (`feat:`, `fix:`, `chore:`) — easier changelog later

### 2.1 Pre-commit hooks
- [ ] **Husky** installed
- [ ] **lint-staged** runs ESLint + Prettier on staged files
- [ ] **Type-check** runs on commit (`tsc --noEmit`)
- [ ] Optional: `cargo fmt --check` and `cargo clippy` for Rust files

---

## 3. Code quality + tooling

- [ ] **TypeScript** in strict mode — `strict: true`, `noUncheckedIndexedAccess: true`
- [ ] **ESLint** with `@typescript-eslint`, `react-hooks`, `react`
- [ ] **Prettier** for formatting (settle on width, trailing commas, etc.)
- [ ] **Vitest** for unit tests
- [ ] **Playwright** for end-to-end tests (used sparingly — only critical paths)

---

## 4. Cloud accounts

### 4.1 Supabase
- [ ] **Account created** — free tier is enough for v1/v2
- [ ] **Project created** — note the project URL and `anon` / `service_role` keys
- [ ] **Postgres schema** initialized (will mirror local SQLite — defined in Week 2)
- [ ] **Storage bucket created** for nightly DB snapshots
- [ ] **Row Level Security (RLS) policy template** prepared (single-tenant for now; `tenant_id` filter)
- [ ] Service role key stored **only in `.env.local`** — never committed

### 4.2 (Optional) Sentry or similar
- [ ] Account created for crash reporting (free tier)
- [ ] Optional for v1 — useful if shop logs you out

---

## 5. Environment variables / secrets management

- [ ] `.env.local` (gitignored) holds:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (only if your code legitimately needs it — usually not on client)
- [ ] `.env.example` (committed) shows the keys without values
- [ ] Tauri's `tauri.conf.json` is reviewed — no secrets leak into the binary

---

## 6. Hardware verification (the highest-priority Week 1 task — see [R4](./03-risk-list.md#r4--hardware-integration-headaches-printer--scanner))

### 6.1 TVS thermal printer (receipt)
- [ ] Physically connected to dev Windows machine via USB
- [ ] Driver installed (TVS provides on their site)
- [ ] Print a Windows test page to confirm OS-level connectivity
- [ ] Write a minimal Rust function that opens the printer and sends raw ESC/POS bytes:
   - `0x1B 0x40` (initialize)
   - `"Hello World\n"`
   - `0x1D 0x56 0x01` (cut paper)
- [ ] **This must print actual paper from your code before any other Week 1 work is "done."**

### 6.2 TVS label printer
- [ ] Connected via USB
- [ ] Driver installed
- [ ] Same exercise — print a single label with a test barcode (CODE128 or EAN-13)
- [ ] Verify the TVS scanner reads the printed barcode

### 6.3 USB barcode scanner (TVS)
- [ ] Plugged in
- [ ] Verify it emits keystrokes by opening Notepad and scanning anything with a barcode — characters appear
- [ ] Note the suffix character (most scanners append `\n` or `\t` — this matters for POS input parsing)

---

## 7. Project scaffolding — first commit

- [ ] `pnpm create tauri-app@latest` with React + TypeScript template
- [ ] Verify `pnpm tauri dev` opens a window on Windows
- [ ] Verify `pnpm tauri build` produces a Windows installer (.msi or .exe)
- [ ] Add Tailwind + shadcn/ui
- [ ] Add Zustand + TanStack Query
- [ ] Add `react-hook-form` + `zod`
- [ ] Add SQLite Rust binding (locked from §1.4)
- [ ] Add Supabase JS client (for cloud sync)
- [ ] Folder structure committed:

```
pos-inventory-system/
├── docs/
│   ├── planning/          ← these files
│   ├── decisions/         ← future ADRs
│   └── parked/            ← parked features
├── src-tauri/             ← Rust backend
│   ├── src/
│   │   ├── db/            ← SQLite + migrations
│   │   ├── events/        ← event log + envelope
│   │   ├── sync/          ← cloud sync
│   │   ├── printer/       ← ESC/POS
│   │   └── auth/
│   └── Cargo.toml
├── src/                   ← React frontend
│   ├── modules/
│   │   ├── catalog/
│   │   ├── inventory/
│   │   ├── pos/
│   │   ├── reports/
│   │   └── setup/
│   ├── components/
│   ├── lib/               ← shared utilities
│   └── App.tsx
├── tests/                 ← Vitest + Playwright
├── package.json
├── tauri.conf.json
└── README.md
```

---

## 8. CI / CD (lightweight)

- [ ] **GitHub Actions** (or GitLab CI) workflow that on every push:
   - Installs deps
   - Runs `tsc --noEmit`
   - Runs `pnpm lint`
   - Runs `pnpm test`
   - Optionally: produces a debug Windows build artifact
- [ ] **Don't bother with auto-deploy for v1** — manual installer build is fine
- [ ] **Schema replay test in CI** (see [R2](./03-risk-list.md#r2--event-sourcing-discipline-collapse-mid-build)) — added once event infrastructure exists in Week 2

---

## 9. Verification gate — end of Week 1

Before declaring Week 1 complete, you must be able to demonstrate all of the following on the dev Windows machine:

1. ✅ `pnpm tauri dev` opens a window with a placeholder UI
2. ✅ Window has a button that, when clicked, prints "Hello from POS" on the TVS thermal printer
3. ✅ Window has another button that, when clicked, prints a label with a test barcode on the TVS label printer
4. ✅ The TVS scanner, scanning that label, types the barcode value into an input field on screen
5. ✅ A test SQLite file is created on disk; you can open it with DB Browser
6. ✅ The app makes one successful HTTP call to Supabase (e.g., fetches the project's healthcheck endpoint) and shows a "Cloud OK" indicator
7. ✅ `pnpm tauri build` produces a Windows installer; running it on a clean Windows VM successfully installs and launches

**If any of the seven fail, do not start Week 2.** The cost of fixing these mid-project is dramatically higher.

---

## 10. Documentation discipline (lightweight, but start now)

- [ ] `/docs/decisions/0001-tech-stack.md` — write a short ADR (Architecture Decision Record) explaining why Tauri, why local-first, why event-sourced. References the planning docs.
- [ ] `/docs/parked/` — empty folder, ready to receive parked features as you encounter them
- [ ] `/docs/runbooks/` — empty folder; populate as operational procedures emerge (backup restore, schema migration, etc.)
- [ ] `/CHANGELOG.md` — start it now, even with just "v0.0.1 — Project scaffolded"

---

## 11. Things to **not** do in Week 1

- ❌ Don't build any catalog/GR/POS features yet
- ❌ Don't optimize anything
- ❌ Don't pick UI colors / branding / icons
- ❌ Don't write production code in `App.tsx` — just enough to verify the toolchain
- ❌ Don't sign code yet (deferred — Windows code-signing is a v1.0 release task)
- ❌ Don't set up auto-update — manual installer is fine for v1
