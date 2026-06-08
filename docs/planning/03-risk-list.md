# Risk List — v1

What could derail v1, ranked by likelihood × impact, with mitigations.

> Companion docs: [Modules](./01-module-list.md) · [Timeline](./02-three-month-timeline.md) · [Tech setup](./04-tech-setup-checklist.md)

---

## Risk rating legend

| Level | Likelihood | Impact |
|---|---|---|
| 🔴 High | Probable | Would slip the timeline by 2+ weeks or compromise v1 quality |
| 🟡 Medium | Possible | Would slip by 1–2 weeks or force a feature cut |
| 🟢 Low | Unlikely or contained | Minor adjustment |

---

## Top risks

### R1 🔴 Scope creep — "just one more feature"

**Why it's the biggest risk:** You're the owner *and* the builder. You'll keep seeing genuine improvements ("oh, this would be useful…") and adding them. Solo devs hardest hit because there's no PM saying no.

**Real example:** You already mentioned UPI auto-reconciliation, AI features, multi-tenancy, inheritable category defaults, promotion rules engine. All valuable. None v1.

**Mitigation:**
- The [module list](./01-module-list.md) "Out of v1 scope" table is your contract with yourself
- For every "small" feature idea: open `docs/parked/<feature>.md`, write 3 sentences, close the file, move on
- Don't touch the parked list until v1 ships
- If a feature genuinely seems blocking, ask: *"Would my shop still function tomorrow without this? If yes → park."*

---

### R2 🔴 Event-sourcing discipline collapse mid-build

**What this looks like:** Around Week 6, under deadline pressure, you write a direct `UPDATE` statement on the `products` or `price_lists` table instead of going through an event. It "fixes the bug." Three weeks later, the materialized state diverges from what's replayable. Recovery is impossible.

**Why it's high risk:** Event-sourcing is more discipline than design. One shortcut metastasizes.

**Mitigation:**
- **Code structure that makes the wrong path harder:**
  - All mutations go through a single `appendEvent()` + `applyEvent()` flow
  - State tables are *only* written by event handlers, never by feature code
  - A periodic test: pick a random day's events → replay into a fresh DB → diff against actual state → must be identical
- Add this replay-equivalence check to CI before Phase 3 starts
- If you ever feel tempted by a direct UPDATE, that's a missing event type — define it

---

### R3 🔴 Solo-dev velocity overestimation

**Reality:** 12 weeks is tight for one person building a real system end-to-end. Indian devs estimate ~30% too optimistic on average; solo devs more.

**Mitigation:**
- 20% buffer already baked into Week 12 (catch-up week)
- Weekly self-honesty: at end of each week, ask *"Did I finish the week's milestone?"* If no, decide before Friday: stretch the week, or cut scope
- **Pre-decide what gets cut first** (see [timeline § "What slips first"](./02-three-month-timeline.md#what-slips-first-if-you-fall-behind))
- Don't extend the timeline silently — explicitly mark slippage

---

### R4 🟡 Hardware integration headaches (printer / scanner)

**What this looks like:** TVS thermal printer prints garbled characters because of wrong ESC/POS encoding. Or the USB barcode scanner works as keystrokes but fires keypresses to the wrong window. Days lost to driver/integration issues.

**Mitigation:**
- **Don't leave printer work for Week 9.** Get a "hello world" thermal print + scan working in Week 1 — even before the catalog UI exists. Verifies the hardware path early.
- Maintain a simple `print-test.html` page that exercises both printers throughout the build
- Have a fallback "print via Windows native dialog" mode if ESC/POS direct fails — slower but works

---

### R5 🟡 Schema migration bugs in production

**What this looks like:** You ship a v1.0.1 update with a schema change. Migration fails on the shop's machine. SQLite is half-migrated. App won't start.

**Why it's medium risk:** Schema migrations are well-understood but easy to get wrong under stress.

**Mitigation:**
- Migration runner is built **in Week 2**, not improvised later
- Every migration is **transactional** (atomic or rolled back; never half-applied)
- App **backs up the SQLite file before running any migration**
- Test every migration on a copy of the live shop DB before pushing the update
- Migrations are append-only (no in-place edits to historical migrations)

---

### R6 🟡 Cloud-sync edge cases (during outages)

**What this looks like:** Internet flickers on/off rapidly during a busy hour. Sync starts, fails, retries, duplicates events, marks some as synced that didn't actually save.

**Mitigation:**
- **Idempotent sync by `event_id`** — re-sending the same event is a no-op on cloud
- Sync uses an exponential-backoff retry with jitter — no thundering herd
- Mark events as "synced" only after **server-side ack**, not before
- Background sync never blocks foreground UI — outages must not affect billing
- Log all sync attempts (success + failure) for debugging

---

### R7 🟡 GST compliance gaps surface during first filing

**What this looks like:** You file GSTR-1 in July using the new system's reports. The GST portal rejects it because some HSN summary field is wrong, or rounding differs, or place-of-supply isn't right.

**Mitigation:**
- **Run GSTR-1 export against your old system's data first** to validate format/correctness (parallel-run period)
- Cross-check totals: new system's GST output report must reconcile to your accountant's expected numbers for the first 1–2 months
- Have your **chartered accountant review the invoice format and reports** before live filing
- Keep raw event log: even if a report is wrong, the underlying truth is recoverable

---

### R8 🟡 UX feedback from staff forces redesign late

**What this looks like:** Cashier staff use the POS in Week 13 trial. They find scanning awkward, search confusing, or the bill flow too many clicks. Days lost re-shaping the POS UI.

**Mitigation:**
- **Build POS for keyboard speed first**, not mouse — match how your staff actually work
- Show a paper prototype or rough screen to staff **before Week 8 coding starts**
- Reserve Week 12 explicitly for UX feedback iteration
- The 80% solution: prioritize the 3–4 hottest paths (scan, discount, payment, complete). Polish them. Other screens can be plain.

---

### R9 🟢 Disk corruption / hard-drive failure on dev machine

**Mitigation:**
- Git commits pushed daily to GitHub / GitLab
- Cloud DB snapshot ≠ code backup; use proper git remote
- Test the restore flow at end of Phase 1 (week 4) — wipe local DB, restore from Supabase backup, verify

---

### R10 🟢 Tauri or Supabase API breaking changes

**What this looks like:** Tauri 2.x → 3.x ships during build; some API changes silently. Or Supabase deprecates an auth method.

**Mitigation:**
- Pin dependency versions in `package.json` / `Cargo.toml`. No floating `^` or `~` on critical libs.
- Update dependencies only at phase boundaries, not mid-phase
- Read the Tauri changelog before any minor upgrade

---

### R11 🟢 You burn out

**What this looks like:** Running a shop + building software + family = exhaustion. Code quality drops. Mistakes pile up.

**Mitigation:**
- Plan for 1 full day off per week (no exceptions)
- Don't code past midnight — the bugs you write at 1 AM cost 4 AM hours next day
- Recognize that 12 weeks of relentless solo work isn't sustainable — pad with a Week 13 rest if needed
- If you fall behind, cut scope, don't extend hours

---

## Decision triggers (when to pull a lever)

| If you observe… | Then… |
|---|---|
| End of Week 4 and Phase 1 isn't done | Re-baseline the timeline. Don't pretend it's fine. |
| Event-replay diff test starts failing | Stop all feature work. Find the missing event type. Fix before adding features. |
| Printer/scanner integration unresolved by end of Week 2 | Add a Week 2.5 spike. Hardware risk dominates everything else. |
| 2 consecutive weeks miss their milestone | Cut something from [What slips first](./02-three-month-timeline.md#what-slips-first-if-you-fall-behind). |
| You're tempted to "just for now" UPDATE a state table directly | This is R2 happening. Stop. Define the event type. |
| Staff trial reveals UX problem affecting daily work | Schedule a Week 13 iteration before going live. Don't ship the bad UX. |

---

## Risks that are NOT on this list (intentionally)

- **Multi-device sync complexity** — v2 problem, not v1
- **SaaS architecture refactor** — v4 problem
- **AI feature integration** — not in v1 scope
- **High user load** — your shop does ~30 transactions/day; not a scale risk
- **Payment gateway disputes** — UPI is manual entry in v1
- **Data privacy / encryption at rest** — important but standard SQLite + Supabase RLS solves; not a derailer

If any of these become real risks, they'll be added — but they don't earn worry-budget right now.
