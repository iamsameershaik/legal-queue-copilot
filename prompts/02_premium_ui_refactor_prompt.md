# Prompt 2 — Premium UI Refactor

**Goal:** Upgrade the visual design from functional to portfolio-grade, without changing product logic.

---

## Prompt (condensed)

We have a working v1. Now upgrade it into a premium, portfolio-grade product with a refined visual aesthetic.

### Design direction

References: Linear, Vercel Dashboard, OpenAI Platform, Stripe Dashboard.

**Not:** Heavy gradients, glassmorphism, glowing cards, generic Claude/Bolt template aesthetic.

**Yes:**
- Near-black background: `#080D10`
- Solid matte card surfaces: `#0F1A1F`
- Clean borders: `#1E2D35`
- Emerald accent: `#16C784` used sparingly — active states, accent values, positive signals only
- Sidebar: subtle left-marker active state (2px `#16C784` left edge, `rgba(22,199,132,0.08)` background), not glowing pill
- Typography: 28px/700 page title, 16px/600 section title, 14px/400 body
- Transitions: 120–180ms only — no heavy animations
- No backdrop-blur, no box-shadow glow, no gradient backgrounds on cards

### Design system

Build a complete `@layer components` system in `index.css`:
- `.surface-card`, `.surface-raised`, `.surface-inset`
- `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- `.pill`, `.pill-green`, `.pill-amber`, `.pill-red`, `.pill-neutral`, `.pill-blue`
- `.nav-item`, `.nav-item-active`
- `.page-title`, `.section-title`, `.card-title`, `.body-text`, `.meta-label`
- `.input-field`, `.code-block`, `.table-row`, `.accordion-header`

### Specific pages

**Command Centre:** Linear-style queue table with 8 columns (contract, type, risk, route, top issue, saved, status, open). Right intelligence panel (triage distribution with progress bars, key signals, time hypothesis).

**New Review:** Two-column cockpit layout. Left: sample chips, metadata form, monospace contract textarea. Right: numbered review path stepper, playbook coverage list, safety note.

**Review Results:** Legal workspace. Findings as accordions with 3-col playbook comparison (detected / playbook rule / recommendation). Side-by-side redline panels. Right sidebar with summary metrics and route explanation.

**Playbook:** Coverage matrix table. Rule accordions with collapse/expand. Stats strip.

**Evaluation:** Realistic metric cards. 7-column test cases table. Primary safety metric banner (false negatives, red tinted).

**Handover:** 72% readiness score hero. Activity trail. Deployment checklist. Week-two plan grid.

### Additional changes

- Rename Dashboard → "Command Centre"
- Add 2 more sample contracts: Enterprise SaaS (Red) and Partner NDA (Amber)
- Fix eval metrics: update test cases to show 87.5% pass rate, not 100%
- Add "Load demo queue" button that populates 5 seeded reviews
- Add playbook coverage matrix (8 clause types × 3 contract types)
