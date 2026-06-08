# Module List — v1

This document enumerates every module that v1 ships with, organized by phase. Each phase represents a milestone where something meaningful is usable.

> Companion docs: [Timeline](./02-three-month-timeline.md) · [Risks](./03-risk-list.md) · [Tech setup](./04-tech-setup-checklist.md)

---

## Phase 1 — Foundation (Weeks 1–4)

**Goal:** A runnable Tauri app with auth, catalog, master data, and the event-log infrastructure that everything else depends on.

### 1.1 Core infrastructure
- Tauri 2 shell + React + TypeScript scaffold
- SQLite local database with schema migration runner (versioned)
- Cloud Postgres (Supabase) with identical schema + `tenant_id` columns
- **Event log infrastructure** — append-only `events` table, common envelope, sequence numbers
- Materialized-state rebuild capability (replay events → reconstruct state)
- Local PIN auth (bcrypt-hashed)
- Role-based access (Admin / Cashier / Inventory)
- Cloud sync client (opportunistic; configurable by sync-mode preset)
- Logging + error reporting (local-first)

### 1.2 Setup / onboarding
- First-run wizard
  - Admin user creation
  - Shop master (name, GSTIN, address, state, phone)
  - Sync-mode preset picker (4 options)
  - Cloud account linkage (or skip)
- Print/scanner detection (test pages)

### 1.3 Catalog
- Categories (CRUD)
- Sub-categories (CRUD)
- Tags (schema only; UI optional)
- Products (CRUD with: name, brand, article, gender, HSN, GST rate, max-discount, status)
- Variants (Size × Color CRUD per product, with reorder level)
- Custom attributes bag (schema only)
- Fit / Fabric (schema-only, UI deferred)

### 1.4 Master data
- Supplier master (CRUD)
- Customer master (CRUD; phone-keyed)
- User management (Admin can create/edit/deactivate users + roles)
- Shop settings (post-setup edits)

**Phase 1 demo point:** *"I can add products, variants, suppliers, customers. I can log in as different roles."*

---

## Phase 2 — Inventory Operations (Weeks 5–7)

**Goal:** Stock can enter the system, leave to suppliers, and be corrected for damages/audit.

### 2.1 Goods Receipt (GR)
- GR entry (header + lines)
- Auto-PL logic: full match → add qty; mismatch → new PL with notification
- Per-line discount, GST inclusive/exclusive
- Header-level freight + supplier discount (tracked separately, not allocated)
- Price-list creation events
- Barcode generation per new PL
- Label-print integration (TVS label printer via ESC/POS)
- GR void (creates reversing events)

### 2.2 Supplier Returns
- Supplier return entry referencing original GR + PL
- Partial qty supported
- GST input credit reversal
- Credit-note capture (deferred entry allowed)

### 2.3 Stock Adjustments
- Adjustment entry with reasons: Damage / Audit-shortage / Audit-excess / Theft / Sample / Wrong-PL / Other
- Wrong-PL-correction mode (decrease one PL + increase another)
- Inventory + Admin roles only
- Adjustment void (reversing events)

### 2.4 Price-list lifecycle automation
- Auto-archive PL when qty = 0
- Hide archived PLs from default catalog views

**Phase 2 demo point:** *"I can receive stock, return defective items to supplier, and correct stock for damages."*

---

## Phase 3 — POS / Sales (Weeks 8–10)

**Goal:** Bills can be rung up end-to-end with all payment types and customer returns.

### 3.1 POS sale flow
- Sale cart UI (scan + manual fallback)
- Customer optional (forced if khata > 0)
- Sale type toggle: B2C / B2B
- Line-level discount (% or ₹, line-wide not per-piece)
- Cart-level discount (% or ₹)
- Max-discount enforcement (soft warning; combined line + proportional cart)
- Multi-payment (Cash / UPI / Card / Khata)
- Khata adjusts customer balance
- Sale states: Draft / Parked / Completed / Voided
- Parking + resuming saved sales
- Bill print (thermal) — minimal v1 layout, GST-compliant fields
- Sale void (with reason; cashier-allowed in v1)

### 3.2 Customer returns
- Return entry referencing original sale
- Proportional refund computation
- Refund method (Cash / UPI / Card-reversal / Khata-credit)
- Stock restored to original PL
- GST output reversal

### 3.3 Cash drawer + day-end
- Cash drawer movements (in/out with reason)
- Day-end formal close
  - Opening cash carry-forward
  - Expected vs actual cash variance
  - UPI / Card / Khata totals
  - Day-lock after close (admin reopen)

**Phase 3 demo point:** *"I can ring up a full sale, take mixed payments, process a return, and close the day."*

---

## Phase 4 — Reports, Sync, Polish (Weeks 11–12)

**Goal:** Reports for daily ops + GST filing. Cloud sync + backup running cleanly. UI polish for staff.

### 4.1 Reports
- Sales: Daily summary, by date range, by product (variant + PL drill-down), top sellers
- Stock: Current stock, valuation at cost, reorder alerts, stock movement
- GST: Output (sales) per HSN + rate, Input (purchases) per supplier, HSN summary
- Khata: Outstanding balances, customer purchase history
- Supplier: Purchases by supplier, supplier returns
- Day-end: Summary report (printable), cash drawer movement log
- Audit: Stock adjustment log, void log, user activity log
- Margin (Admin only): Gross margin by product, daily/monthly profit

### 4.2 Cloud sync + backup
- Event-log streaming to cloud (per sync-mode interval)
- Nightly SQLite snapshot to Supabase Storage
- Sync status indicator in UI
- Restore from cloud (recovery flow)

### 4.3 Polish
- Keyboard shortcuts for POS hot paths
- Error messages tuned for non-technical staff
- Inline validation + helpful empty states
- Performance pass (catalog search, report generation)
- Staff trial run with feedback loop

**Phase 4 demo point:** *"I can see how the shop is doing, file GST returns, and recover from a machine failure."*

---

## Out of v1 scope (parked)

| Feature | Why deferred |
|---|---|
| **CSV data migration tool** | Parked per your call; will be designed when CSV format is shared |
| **UPI auto-reconciliation (webhook / SMS)** | v2 — adds external dependency; cashier enters UPI manually in v1 |
| **Multi-device sync** | v2 — needs proven sync engine (PowerSync / ElectricSQL) |
| **Multi-counter overselling protection** | v2 — kicks in with multi-device |
| **Promotion rules engine** (brand × cat × time × cart) | v2+ — significant complexity |
| **Mobile companion app for owner** | v3+ |
| **AI features** (scope undecided) | v3+ |
| **SaaS multi-tenancy** | v4 — schema already tenant-aware |
| **Inheritable category defaults / last-used suggestions** | Parked — UX polish |
| **Tags / Fit / Fabric UI** | Schema-only in v1; UI later when used |
| **Pack / bundle / combo selling units** | Collapsed to unit-wise scanning per your call |

---

## Module dependency graph

```
Phase 1 (Foundation)
   │
   ├─→ Catalog ─── needs → Core infra (DB, events, auth)
   ├─→ Master data ── needs → Core infra
   │
   ▼
Phase 2 (Inventory Ops)
   │
   ├─→ GR ──────── needs → Catalog, Suppliers
   ├─→ Supplier Returns ── needs → GR
   ├─→ Stock Adjustments ── needs → Catalog, Price Lists
   │
   ▼
Phase 3 (POS)
   │
   ├─→ POS Sale ── needs → Catalog, Price Lists, Customers
   ├─→ Customer Returns ── needs → Sales
   ├─→ Day-end ── needs → Sales, Payments, Cash Drawer
   │
   ▼
Phase 4 (Reports + Sync)
   │
   ├─→ Reports ── needs → all transaction data
   ├─→ Cloud sync ── needs → Event log (Phase 1)
```

Sync depends only on the event log built in Phase 1, so it can begin running in the background from Phase 2 onwards — useful for "developer-on-laptop" cloud backup early.
