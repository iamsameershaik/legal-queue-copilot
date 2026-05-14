# Legal Queue Copilot

First-pass AI triage for routine commercial contracts.

---

| | |
|---|---|
| **Live demo** | _[add Netlify link]_ |
| **Video walkthrough** | _[add Loom/video link]_ |
| **GitHub repo** | _[add repo URL]_ |

---

## Why this exists

Small in-house legal teams receive a steady stream of repetitive low-risk commercial contracts — mutual NDAs, customer order forms, vendor agreements. Most are mostly boilerplate, but each still requires human review before signing.

Legal Queue Copilot demonstrates how AI can reduce the repetitive first-pass component of that workflow while keeping legal judgment and approval entirely with humans. The goal is faster triage, not autonomous approval.

---

## What I built

A working prototype that:

- Accepts contract text (paste or .txt/.md upload)
- Applies a structured legal playbook with 10 clause-level rules
- Classifies contract risk as **Green / Amber / Red**
- Explains the routing decision and surfaces clause-level findings
- Suggests fallback wording and tracked redlines for negotiation
- Captures human decisions (Accept / Edit / Reject / Escalate) per finding
- Shows a transparent evaluation dashboard with realistic metrics
- Includes a handover plan and launch-readiness score

---

## Core workflow

1. Intake contract (text paste or file upload)
2. Apply playbook — 10 rules checked across governing law, liability, indemnity, data protection, and more
3. Route **Green** (batch spot-check), **Amber** (quick lawyer review), or **Red** (full legal review)
4. Explain why — clause-level findings with evidence from contract text
5. Suggest redlines — side-by-side current vs. fallback wording
6. Human accepts / edits / rejects / escalates each finding
7. Decisions logged to evaluation and handover trail

---

## Key features

- **Command Centre** — contract queue with risk, route, top issue, and time-saved at a glance
- **Playbook-based review** — 10 configurable clause rules with preferred positions, fallbacks, and escalation triggers
- **Clause-level findings** — detected position, playbook rule, recommendation, and business impact per clause
- **Suggested redlines** — side-by-side wording comparison; copy to clipboard; human approval required before sending
- **Human decision controls** — Accept / Edit / Reject / Escalate per finding; decisions logged
- **Evaluation dashboard** — 87.5% pass rate, realistic false positive/negative tracking across 8 synthetic scenarios
- **Handover readiness** — 72% score, week-two plan, activity trail, deployment checklist
- **Demo mode** — 5 sample contracts covering standard NDA, risky NDA, order form, enterprise SaaS, and partner NDA
- **Supabase-ready** — schema and RLS policies applied; localStorage used as prototype persistence layer
- **Netlify-ready** — Vite build, SPA redirect rule, clean production bundle

---

## Safety boundaries

- This is **not legal advice**
- The system **does not approve contracts autonomously**
- **Human approval is required** before any external redline is sent
- **Red routes require full legal review** — the tool does not proceed without legal sign-off
- **False negatives are the primary risk metric** — missing a material issue is treated as more dangerous than over-escalation
- **The synthetic playbook must be reviewed and replaced** by Legal-approved positions before any production use

---

## Evaluation approach

Initial eval suite across 8 synthetic legal scenarios.

Tracks:
- Risk routing accuracy (Green/Amber/Red)
- Issue detection rate
- False positives (unexpected flags)
- False negatives (missed material issues)
- Partial passes (detected but miscalibrated)
- Suggested redline usefulness
- Time saved hypothesis

**Current metrics (v0 deterministic engine):**

| Metric | Value |
|---|---|
| Eval pass rate | 87.5% |
| Risk routing accuracy | 87.5% |
| Issue detection | 82% |
| False positives | 1 |
| False negatives | 1 |
| Partial passes | 2 |

A production eval set of 30–50 labelled historical contracts is required before deployment.

---

## Architecture

| Layer | Technology |
|---|---|
| Frontend | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Persistence | localStorage (prototype) · Supabase (schema applied, client wired) |
| Review engine | Deterministic regex-based mock engine |
| Future LLM integration | Supabase Edge Function or serverless proxy |
| Deployment | Netlify (Vite SPA, `dist/`, `_redirects`) |

---

## Why the mock engine exists

The prototype uses a deterministic rule-based review engine so the demo is reliable, inspectable, and safe without exposing API keys in the frontend. Every output is predictable and auditable.

A production version would call an LLM through a server-side function, validate the structured output against a strict schema, and log inputs/outputs for audit. The client would never hold API keys.

---

## Run locally

```bash
npm install
npm run dev
```

---

## Build

```bash
npm run build
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

## What I would do in week two

1. Shadow 3–5 real legal reviews to map the actual workflow
2. Replace the synthetic playbook with Legal-approved clause positions
3. Evaluate against 30–50 historical contracts; track false negatives by clause type
4. Measure time saved against a manual first-pass baseline
5. Add DOCX/PDF parsing via Edge Function
6. Add Word redline export with tracked changes
7. Integrate with legal intake email, Slack workflow, or ticketing system
8. Create an adoption guide and structured feedback loop for the legal team

---

## Known limitations

- Synthetic sample contracts — real drafting variance will differ
- Deterministic mock engine — no LLM yet
- No legal sign-off on the playbook
- No DOCX/PDF parsing
- No Word tracked-changes export
- Single-user demo mode — no auth or multi-reviewer workflow
- Not production legal advice under any circumstances

---

## Submission artefacts

See the `/docs` folder:

| File | Contents |
|---|---|
| `01_README_START_HERE.md` | Reviewer onboarding and review path |
| `02_AI_PIONEER_SPRINT_BRIEF.md` | Two-week sprint framing and discovery questions |
| `03_LIVE_DEMO_AND_VIDEO_LINKS.md` | Links, deploy notes, demo script |
| `04_ARCHITECTURE_AND_DATA_FLOW.md` | System design and data flow |
| `05_SAMPLE_LEGAL_PLAYBOOK.md` | All 10 playbook rules documented |
| `06_EVAL_REPORT.md` | Full evaluation with test cases and metrics |
| `07_HANDOVER_RUNBOOK.md` | How a legal team would adopt this tool |
| `08_ASSUMPTIONS_LIMITATIONS_AND_NEXT_STEPS.md` | Honest scope and production path |
| `09_PROMPTS_USED.md` | Prompts used to build this — artefact trail |
| `10_SUBMISSION_CHECKLIST.md` | Pre-submission verification checklist |

See `/sample-contracts` for the five synthetic contracts used in the demo.

See `/prompts` for cleaned-up versions of the build prompts.

---

_Take-home assignment artefact for PortSwigger AI Pioneer role. Not production software. Not legal advice._
