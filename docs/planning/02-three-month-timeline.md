# 3-Month Timeline — v1

**Target:** A solo developer building v1 in ~12 weeks, after which data migration + parallel-run testing begins.

> Companion docs: [Modules](./01-module-list.md) · [Risks](./03-risk-list.md) · [Tech setup](./04-tech-setup-checklist.md)

---

## Assumptions

- **Solo developer** — you (strong SDE background)
- **~30–40 productive hours/week** on this project (a real shop owner has a shop to run)
- **No formal QA team** — you test what you build; staff trial happens at end of Phase 4
- **3-month focus = building, not migrating** — migration tool + parallel run happen *after* week 12
- **Buffer for surprise** baked in (~20% — solo dev velocity is hard to predict accurately)

---

## Week-by-week breakdown

### Phase 1 — Foundation (Weeks 1–4)

| Week | Focus | Deliverable |
|---|---|---|
| **1** | Tooling + scaffold | Tauri 2 + React + TS app builds & runs on Windows. SQLite wired. Supabase project provisioned. Repo + CI hooked up. |
| **2** | Schema + event log + auth | DB schema for all entities (per ERD). Migration runner. Event log table + envelope. Local PIN auth + role system. |
| **3** | Setup wizard + master data | First-run wizard (admin user, shop master, sync mode, cloud link). User management. Supplier + Customer master CRUD. |
| **4** | Catalog | Category + Sub-category + Product + Variant + Price List schema & UI. **No GR yet — manual seed for testing.** |

**End of Week 4 milestone:** App boots, sets up, lets you log in as different roles, navigate catalog. Master data tables work. **You can demo this to yourself.**

---

### Phase 2 — Inventory Operations (Weeks 5–7)

| Week | Focus | Deliverable |
|---|---|---|
| **5** | Goods Receipt | GR header + lines entry. Auto-PL logic (full-match → merge; mismatch → new). Barcode generation. Test with TVS label printer. |
| **6** | Supplier returns + price-list lifecycle | Supplier return flow. Auto-archive PL at qty=0. Stock movement events firing correctly. |
| **7** | Stock adjustments | Adjustment entry (all reason types). Wrong-PL-correction. Verify entire inventory loop (in → adjust → return) end-to-end via event replay. |

**End of Week 7 milestone:** Inventory operations are complete. Stock truly works — you can receive, adjust, return. Event log proves recoverability via replay test.

---

### Phase 3 — POS / Sales (Weeks 8–10)

| Week | Focus | Deliverable |
|---|---|---|
| **8** | POS cart + scanning + discounts | Cart UI. Barcode scan to add item. Manual search fallback. Line + cart discounts. Max-discount soft warning. Sale draft + park + resume. |
| **9** | Payments + completion + bill print | Multi-payment (Cash + UPI + Card + Khata). Khata adjusts customer balance. Bill print via TVS thermal printer (minimal layout, GST-compliant fields). Sale completion + void. |
| **10** | Customer returns + day-end + cash drawer | Customer return flow with proportional refund. Cash drawer movements. Day-end open/close with variance + lock. |

**End of Week 10 milestone:** A full sale lifecycle works. You can ring up bills, take payments, process returns, close the day. **Functionally usable as a POS.**

---

### Phase 4 — Reports, Sync, Polish (Weeks 11–12)

| Week | Focus | Deliverable |
|---|---|---|
| **11** | Reports + sync | All v1 reports built. Event-log streaming to cloud (per sync-mode preset). Nightly SQLite snapshot to Supabase Storage. Restore-from-cloud tested. |
| **12** | UI polish + buffer | Keyboard shortcuts for POS hot paths. Error messages for non-tech staff. Empty states. Performance pass. Self-test sweep. **Catch-up week for anything that slipped.** |

**End of Week 12 milestone:** v1 is feature-complete. Reports work. Sync runs. UI is staff-friendly.

---

## After Week 12 — Migration + Trial (out of this document but worth flagging)

- **Week 13–14:** Build CSV import tool (parked task)
- **Week 15–16:** Migrate your shop's data into a staging copy. Reconcile against current system.
- **Week 17–20:** Parallel run — both old and new systems live in the shop. Catch issues. Iterate.
- **Week 21+:** Cutover. Old system retired. v1 is production.

---

## Demo / checkpoint schedule

Treat these as self-imposed gates. If you can't demo what's listed, don't move to the next phase.

| Gate | What you must demo |
|---|---|
| **End of Week 4** | Login as Admin / Cashier / Inventory. Create a product with variants. Add a supplier. Add a customer. |
| **End of Week 7** | Receive 30 pieces via GR. See new PL created automatically. Return 5 to supplier. Adjust 2 for damage. Verify event log: replay events → state matches. |
| **End of Week 10** | Ring up a bill with 2 items, 5% line discount, ₹10 cart discount. Pay with mixed Cash + UPI + Khata. Print bill. Process a partial return. Close day with cash variance. |
| **End of Week 12** | Pull daily sales report. Pull GST output report. Verify nightly cloud backup ran. Simulate machine wipe + restore from cloud. |

---

## Velocity notes for solo dev

- **First 2 weeks are slowest** — scaffolding, tooling decisions, learning Tauri quirks. Don't panic if Week 1 feels light.
- **Phase 2 (inventory) is the densest backend work.** Reserve mental energy.
- **Phase 3 (POS) is the most UX-sensitive.** Test with realistic data — receive 50 products, then practice scanning.
- **Don't optimize the UI until Week 11.** Functionality first. Many hours will be wasted polishing something that gets restructured.
- **Avoid feature creep** — if a feature isn't on the [module list](./01-module-list.md), defer it. (See [risks](./03-risk-list.md) for why.)

---

## What slips first if you fall behind

If you reach Week 8 and Phase 2 isn't done, here's the prioritization for trimming:

1. **Customer return flow** — defer to post-v1 (block returns; refund manually via admin)
2. **Stock adjustments UI polish** — defer (CLI-style entry OK for v1)
3. **GST input report** — defer (sales report is more critical day-to-day)
4. **Cash drawer movements** — defer if absolutely needed (variance becomes manual)
5. **Cloud sync** — defer to a v1.1 patch (local-only is still functional)

What you **can NOT cut and still ship v1:**
- Catalog, GR, Sale flow, Day-end close, GST output report, Bill print with GST fields, Event log, Local backup

---

## Communication rhythm with future-self

Keep a `/docs/decisions/` folder for ADR-style decision logs as you build. When you change your mind mid-build, write it down. Future-you in week 10 will thank week-3-you for the breadcrumb.
