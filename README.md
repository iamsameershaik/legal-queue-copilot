# ClauseCompass v2

AI-assisted, human-in-the-loop first-pass legal triage for routine commercial contracts.

---

| | |
|---|---|
| **Live demo** | https://clausecompass.netlify.app/ |
| **Video walkthrough** | https://drive.google.com/file/d/1glA6a2GmQRi32N1jdMaqJXCDnUl7dNwb/view |
| **GitHub** | https://github.com/iamsameershaik/legal-queue-copilot |

---

> **Note:** The walkthrough video shows the original v1 PortSwigger AI Pioneer take-home submission.
> The live app and current repository have since been extended into **ClauseCompass v2**, which adds
> contract intake guardrails, evidence-grounded outputs with citation and provenance metadata, a
> citation coverage verifier, and a governance-focused Handover Lab. The core workflow and safety
> boundaries are unchanged.

---

## Why this exists

Small in-house legal teams receive a steady stream of repetitive low-risk commercial contracts —
mutual NDAs, customer order forms, vendor agreements, SaaS terms. Most are mostly boilerplate, but
each still requires human review before signing.

ClauseCompass demonstrates how AI-assisted tooling can reduce the repetitive first-pass component
of that workflow while keeping legal judgment, approval, and external redline sign-off entirely with
humans. The goal is faster triage, not autonomous approval.

---

## What ClauseCompass v2 does

ClauseCompass accepts contract text, applies a structured legal playbook, and returns:

- a **Green / Amber / Red** risk routing decision with explanation
- **clause-level findings** grounded in evidence from the submitted contract
- **suggested redline** wording for each at-risk clause, based on playbook fallback positions
- a **human decision prompt** (Accept / Edit / Reject / Escalate) for every finding
- a **governance and handover summary** showing launch readiness and production blockers

It covers: mutual NDAs, customer order forms, vendor agreements, SaaS agreements, and other
boilerplate-heavy commercial contracts.

It does not: autonomously approve contracts, produce legal advice, or send redlines without human
review and sign-off.

---

## Core workflow

```
1. Contract intake     → paste text or upload .txt / .md file
2. Preflight guardrail → classify input: accept / warn / reject before review
3. Playbook review     → 10 clause rules checked (governing law, liability, indemnity, data
                         protection, assignment, auto-renewal, confidentiality, payment terms,
                         publicity rights, security obligations)
4. Risk routing        → Green (batch spot-check) / Amber (quick lawyer review) / Red (full
                         legal review required)
5. Findings + evidence → clause-level findings with contract citations and playbook citations
6. Redline suggestions → current wording vs. fallback wording, with provenance metadata
7. Human decisions     → Accept / Edit / Reject / Escalate per finding; decisions logged
8. Handover Lab        → readiness scores, governance matrix, production blockers, adoption plan
```

---

## v2 feature highlights

| Area | Feature | Status |
|---|---|---|
| UI | Vite + React + TypeScript, crypto-green command-centre interface | Complete |
| Intake | Contract Intake Guardrail — deterministic preflight classifier | Complete |
| Intake | Preflight test fixtures with accept / warn / reject paths | Complete |
| Review | Deterministic review engine — 12 risk signals, regex-matched | Complete |
| Review | Structured playbook — 10 rules with preferred positions, fallbacks, escalation triggers | Complete |
| Review | Green / Amber / Red routing with routing rationale | Complete |
| Evidence | Contract citations on every finding and redline | Complete |
| Evidence | Playbook citations with evidence strength | Complete |
| Evidence | Provenance metadata (detectionType, ruleId, matchedSignals) | Complete |
| Evidence | Legal-reference status and authority status per finding | Complete |
| Evidence | Citation coverage eval — automated verifier, 0 fabricated URLs | Complete |
| Controls | Human decision controls — Accept / Edit / Reject / Escalate | Complete |
| Controls | Human approval required before any external redline | Complete |
| Governance | Handover Lab — readiness scores, control coverage, blockers, governance matrix | Complete |
| Persistence | localStorage prototype persistence | Complete |
| Backend | Supabase schema + RLS policies applied; client wired | Complete |
| Deploy | Netlify — Vite SPA build, `_redirects` rule | Complete |
| Parsing | DOCX / PDF ingestion | Not yet |
| Export | Word redline export with tracked changes | Not yet |
| LLM | Real LLM / Edge Function integration | Not yet |
| Auth | Reviewer roles, auth, multi-reviewer workflow | Not yet |

---

## Safety boundaries

- **Not legal advice.** ClauseCompass is a triage prototype. Nothing it produces constitutes legal advice.
- **No autonomous approval.** The system does not approve, sign, or send contracts.
- **Human review required** before any suggested redline is shared externally.
- **Red routes require full legal review** — the tool explicitly blocks proceeding without sign-off.
- **False negatives are the primary risk metric.** Missing a material clause is treated as more
  dangerous than over-escalation.
- **The synthetic playbook is not legal-approved.** It must be reviewed and replaced by qualified
  legal stakeholders before any production use.

---

## Evidence & authority layer

Every finding and redline in v2 carries structured evidence:

**Contract citation** — the matched excerpt from the submitted contract, with character range,
evidence strength (`direct` / `ambiguous` / `missing`), and detection type.

**Playbook citation** — the specific playbook rule that triggered the finding, including preferred
position, acceptable fallback, and escalation trigger.

**Provenance metadata** — detector type, rule ID, matched signals, and text range for every output.

**Legal-reference status** — each finding is marked `not-added` (external authority structurally
supported but not yet curated) or `not-applicable`. No external legal URLs are generated or
fabricated by the engine.

**Authority status** — each finding is marked `external-authority-not-added` or `playbook-grounded`
depending on clause type.

A citation coverage verifier (`runCitationEval`) checks all of the above automatically across 5
sample contracts on every run.

---

## Contract Intake Guardrail

Before a contract enters the review queue it passes a deterministic preflight classifier:

| Outcome | Meaning |
|---|---|
| `accept` | Input looks like a valid commercial contract — proceed to review |
| `warn` | Input accepted with caveats (e.g. short text, unusual structure) |
| `reject` | Input does not meet minimum quality bar — reason surfaced to user |

Rejection reasons include: empty input, non-contract text (emails, code, CVs), contracts outside
supported scope, and inputs that are too short to review reliably.

A fixture-based eval (`runContractPreflightEval`) verifies all paths automatically.

---

## Evaluation and verification

| Check | Current result | Notes |
|---|---|---|
| Preflight guardrail fixtures | 17/18 · 94% pass rate | 18 synthetic test cases |
| Citation coverage | 100% · 128/128 checks | 5 sample contracts, 16 findings, 16 redlines |
| Fabricated legal refs | 0 | No external URLs generated |
| Synthetic review eval | 87.5% pass rate | 8 labelled scenarios |
| False negatives | 1 (current sample eval) | Primary safety metric |
| Historical validation | Not yet | 30–50 labelled real contracts required |

**The primary risk metric is false negatives.** Missing a material legal issue is more dangerous
than over-escalation. Current false negative count is within acceptable range for a deterministic
prototype engine, but must be validated against real contracts before production use.

---

## Handover Lab

The Handover Lab page summarises governance readiness for a legal-ops or AI-governance stakeholder:

- **Two readiness scores** — prototype readiness (v2 portfolio maturity) and production readiness
  (controls still required before real deployment)
- **Control coverage** — 12 controls with Complete / Not yet status and live metrics
- **Production blockers** — severity, owner, and next action for each outstanding requirement
- **Eval & safety metrics** — live preflight and citation eval figures
- **Governance matrix** — 8 governance areas with current state, production requirement, and status
- **Reviewer activity trail** — live or seeded review and decision events
- **Week-two adoption plan** — 10-step sequence with owners and success signals
- **Scope governance note** — playbook scope, critical rules, and UI selector design intent

---

## Architecture

| Layer | Technology |
|---|---|
| Frontend | Vite 5 + React 18 + TypeScript |
| Styling | Tailwind CSS + CSS custom properties (v2 design token system) |
| Review engine | Deterministic regex-signal engine — inspectable, auditable, no API keys |
| Persistence | localStorage (prototype) · Supabase (schema applied, RLS policies, client wired) |
| Evals | `runContractPreflightEval()` · `runCitationEval()` — run synchronously in-browser |
| LLM integration | Not yet — Edge Function stub present for future proxy |
| Deployment | Netlify (Vite SPA, `dist/`, `public/_redirects`) |

**Why the deterministic engine:** The prototype uses a regex-based rule engine so the demo is
reliable, inspectable, and safe without exposing API keys in the frontend. Every output is
predictable and auditable. A production version would call an LLM through a server-side Edge
Function, validate structured output against a strict schema, and log inputs and outputs for audit.
The client would never hold API keys.

---

## Run locally

```bash
npm install
npm run dev
```

Requires a `.env` file — copy `.env.example` and fill in Supabase credentials if using the
Supabase client. The prototype works without Supabase using localStorage only.

---

## Build

```bash
npm run build      # production bundle to dist/
npm run typecheck  # TypeScript check without emit
```

---

## Deployment

| Setting | Value |
|---|---|
| Platform | Netlify |
| Build command | `npm run build` |
| Publish directory | `dist` |
| SPA redirect | `public/_redirects` → `/* /index.html 200` |

---

## Production readiness gaps

The following are required before ClauseCompass could be used in a real legal workflow:

| Gap | Status |
|---|---|
| Legal-approved playbook | Not yet — synthetic rules only |
| Historical contract validation set | Not yet — 30–50 labelled contracts required |
| DOCX / PDF parsing | Not yet — plain text input only |
| Word redline export (tracked changes) | Not yet — UI only |
| Real LLM integration | Not yet — Edge Function stub present |
| Auth and reviewer roles | Not yet — single-session demo |
| External legal authority curation | Not yet — structurally supported, not curated |
| Legal sign-off | Not yet — required before any deployment |

---

## What I would do next

1. Shadow 3–5 real legal reviews — map workflow gaps and edge cases the prototype does not handle
2. Replace the synthetic playbook with Legal-approved clause positions
3. Build a 30–50 contract labelled eval set covering NDA and Order Form types
4. Track false negatives by clause type across the labelled set
5. Add DOCX/PDF ingestion via Supabase Edge Function
6. Add Word redline export with tracked changes
7. Add reviewer roles and an approval workflow with a persisted audit trail
8. Run a controlled pilot with the legal team on real (non-sensitive) contracts
9. Collect reviewer disagreement and override data to improve calibration
10. Update playbook based on the feedback loop; version-control each change

---

## Submission and portfolio context

ClauseCompass was originally built as a take-home prototype for the PortSwigger AI Pioneer
programme — a two-week sprint to demonstrate how AI could accelerate routine legal review for an
in-house team.

The `/docs` folder contains the original v1 submission artefacts:

| File | Contents |
|---|---|
| `01_README_START_HERE.md` | Reviewer onboarding |
| `02_AI_PIONEER_SPRINT_BRIEF.md` | Sprint framing and discovery questions |
| `03_LIVE_DEMO_AND_VIDEO_LINKS.md` | Links and demo script |
| `04_ARCHITECTURE_AND_DATA_FLOW.md` | System design and data flow |
| `05_SAMPLE_LEGAL_PLAYBOOK.md` | All 10 playbook rules |
| `06_EVAL_REPORT.md` | Full evaluation with test cases and metrics |
| `07_HANDOVER_RUNBOOK.md` | Legal team adoption plan |
| `08_ASSUMPTIONS_LIMITATIONS_AND_NEXT_STEPS.md` | Honest scope and production path |
| `09_PROMPTS_USED.md` | Prompts used during build |
| `10_SUBMISSION_CHECKLIST.md` | Pre-submission verification |

The repository has since been extended into v2 as a portfolio demonstration of a more complete
AI-assisted legal workflow. The v1 docs reflect the original sprint scope and have not been updated
to match v2.

`/sample-contracts` — five synthetic contracts used in the demo queue.

---

_ClauseCompass is a prototype. It is not production software. It is not legal advice. Every output
requires human review and legal sign-off before external use. The playbook must be reviewed and
approved by qualified legal stakeholders before any production deployment._
